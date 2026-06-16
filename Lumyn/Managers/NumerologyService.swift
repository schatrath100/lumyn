import Foundation

enum NumerologyService {
    private static let chaldean: [Character: Int] = [
        "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 8, "G": 3, "H": 5, "I": 1,
        "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 7, "P": 8, "Q": 1, "R": 2,
        "S": 3, "T": 4, "U": 6, "V": 6, "W": 6, "X": 5, "Y": 1, "Z": 7,
    ]

    private static let pythagorean: [Character: Int] = [
        "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9,
        "J": 1, "K": 2, "L": 3, "M": 4, "N": 5, "O": 6, "P": 7, "Q": 8, "R": 9,
        "S": 1, "T": 2, "U": 3, "V": 4, "W": 5, "X": 6, "Y": 7, "Z": 8,
    ]

    static func reduceNumber(_ n: Int) -> Int {
        var sum = n
        while sum > 9 && sum != 11 && sum != 22 && sum != 33 {
            sum = String(sum).compactMap { Int(String($0)) }.reduce(0, +)
        }
        return sum == 0 ? 1 : sum
    }

    static func chaldeanNumber(name: String) -> Int {
        let sum = name.uppercased().compactMap { chaldean[$0] }.reduce(0, +)
        return reduceNumber(sum)
    }

    static func pythagoreanNumber(name: String) -> Int {
        let sum = name.uppercased().compactMap { pythagorean[$0] }.reduce(0, +)
        return reduceNumber(sum)
    }

    static func personalNumber(name: String, system: NumerologySystem = .chaldean) -> Int {
        switch system {
        case .chaldean: return chaldeanNumber(name: name)
        case .pythagorean: return pythagoreanNumber(name: name)
        }
    }

    static func lifePathNumber(birthDate: String) -> Int? {
        let digits = birthDate.filter(\.isNumber)
        guard digits.count >= 8 else { return nil }
        let sum = digits.compactMap { Int(String($0)) }.reduce(0, +)
        return reduceNumber(sum)
    }

    static func resonanceNumber(personalNumber: Int?, lifePathNumber: Int?) -> Int? {
        lifePathNumber ?? personalNumber
    }

    static func resonantWordNames(number: Int?) -> [String] {
        guard let number else { return [] }
        return DataCatalog.shared.personalProfile(for: number)?.words ?? []
    }
}
