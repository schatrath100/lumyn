import Foundation
import StoreKit
import os

enum SubscriptionProductID: String, CaseIterable, Identifiable {
    case quarterly = "com.whyteboard.lumyn.premium.quarterly"
    case weekly = "com.whyteboard.lumyn.premium.weekly"

    var id: String { rawValue }

    var planId: SubscriptionPlanId {
        switch self {
        case .quarterly: return .quarterly
        case .weekly: return .weekly
        }
    }
}

enum SubscriptionError: LocalizedError {
    case productNotFound
    case cancelled
    case pending
    case noActiveSubscription
    case unverifiedTransaction
    case unknown

    var errorDescription: String? {
        switch self {
        case .productNotFound:
            return "This plan isn't available right now. Please try again shortly."
        case .cancelled:
            return nil
        case .pending:
            return "Your purchase is pending approval."
        case .noActiveSubscription:
            return "No active subscription was found for this Apple ID."
        case .unverifiedTransaction:
            return "We couldn't verify your purchase. Please try again."
        case .unknown:
            return "Something went wrong. Please try again."
        }
    }
}

@MainActor
@Observable
final class SubscriptionManager {
    static let shared = SubscriptionManager()

    private(set) var products: [Product] = []
    private(set) var isEntitled = false
    private(set) var isLoadingProducts = false
    private(set) var lastProductLoadFailed = false

    var hasProducts: Bool { !products.isEmpty }

    private let logger = Logger(subsystem: "com.whyteboard.lumyn", category: "StoreKit")
    private var updatesTask: Task<Void, Never>?

    private init() {
        updatesTask = Task { await listenForTransactions() }
        Task {
            await loadProducts()
            await refreshEntitlements()
        }
    }

    func product(for id: SubscriptionProductID) -> Product? {
        products.first { $0.id == id.rawValue }
    }

    func displayPrice(for id: SubscriptionProductID, fallback: String) -> String {
        product(for: id)?.displayPrice ?? fallback
    }

    func loadProducts() async {
        isLoadingProducts = true
        defer { isLoadingProducts = false }

        do {
            let ids = SubscriptionProductID.allCases.map(\.rawValue)
            let loaded = try await Product.products(for: ids)
            products = loaded
            lastProductLoadFailed = loaded.isEmpty
            logger.info("Loaded \(self.products.count) subscription products")
        } catch {
            lastProductLoadFailed = true
            products = []
            logger.error("Failed to load products: \(error.localizedDescription)")
        }
    }

    func refreshEntitlements() async {
        var entitled = false
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else { continue }
            if SubscriptionProductID(rawValue: transaction.productID) != nil {
                entitled = true
            }
        }
        isEntitled = entitled
    }

    func activePlanId() async -> SubscriptionPlanId? {
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else { continue }
            if let product = SubscriptionProductID(rawValue: transaction.productID) {
                return product.planId
            }
        }
        return nil
    }

    @discardableResult
    func purchase(_ plan: SubscriptionProductID) async throws -> Bool {
        if product(for: plan) == nil {
            await loadProducts()
        }
        guard let product = product(for: plan) else {
            throw SubscriptionError.productNotFound
        }

        let result: Product.PurchaseResult
        do {
            result = try await product.purchase()
        } catch let skError as StoreKitError {
            if case .userCancelled = skError {
                throw SubscriptionError.cancelled
            }
            throw skError
        }

        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            await refreshEntitlements()
            return isEntitled
        case .userCancelled:
            throw SubscriptionError.cancelled
        case .pending:
            throw SubscriptionError.pending
        @unknown default:
            throw SubscriptionError.unknown
        }
    }

    func restore() async throws {
        try await AppStore.sync()
        await refreshEntitlements()
        guard isEntitled else {
            throw SubscriptionError.noActiveSubscription
        }
    }

    private func listenForTransactions() async {
        for await result in Transaction.updates {
            guard case .verified(let transaction) = result else { continue }
            await transaction.finish()
            await refreshEntitlements()
        }
    }

    private func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .verified(let value):
            return value
        case .unverified:
            throw SubscriptionError.unverifiedTransaction
        }
    }
}
