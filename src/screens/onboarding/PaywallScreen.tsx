import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressDots } from '../../components/ProgressDots';
import { TrialTimeline } from '../../components/TrialTimeline';
import { useApp } from '../../context/AppContext';
import { PAYWALL_FEATURES } from '../../data/paywall-features';
import { SUBSCRIPTION_PLANS } from '../../data/subscription-plans';
import type { SubscriptionPlanId } from '../../types';
import { LEGAL, openExternal } from '../../lib/legal';
import { purchasePlan, restorePurchases } from '../../lib/purchases';

export function PaywallScreen() {
  const navigate = useNavigate();
  const { grantSubscription } = useApp();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanId>('quarterly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan) ?? SUBSCRIPTION_PLANS[0];

  const unlock = (planId: SubscriptionPlanId) => {
    grantSubscription(planId);
    navigate('/', { replace: true });
  };

  const startTrial = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await purchasePlan(selectedPlan);
      if (result.ok) {
        unlock(result.planId);
        return;
      }
      if (result.reason !== 'cancelled') {
        setError(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const restore = async () => {
    setError(null);
    setLoading(true);
    try {
      const result = await restorePurchases();
      if (result.ok) {
        unlock(result.planId);
        return;
      }
      setError(result.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen paywall-screen">
      <ProgressDots total={8} active={8} />

      <div className="paywall-scroll">
        <header className="paywall-header">
          <p className="eyebrow">3 days free</p>
          <h1 className="display paywall-title">Begin your practice</h1>
          <p className="paywall-subtitle">
            Full access to Lumyn&apos;s switch word library, rituals, and journal — free for 3 days.
          </p>
        </header>

        <TrialTimeline />

        <div className="paywall-trial-copy">
          <div>
            <span className="paywall-trial-copy__day">Today</span>
            <span className="paywall-trial-copy__detail">Unlock everything instantly</span>
          </div>
          <div>
            <span className="paywall-trial-copy__day">Day 3</span>
            <span className="paywall-trial-copy__detail">Trial ends — cancel anytime before</span>
          </div>
        </div>

        <ul className="paywall-features">
          {PAYWALL_FEATURES.map((f) => (
            <li key={f.title}>
              <span className="paywall-features__icon" aria-hidden>{f.icon}</span>
              <div>
                <div className="paywall-features__title">{f.title}</div>
                <div className="paywall-features__detail">{f.detail}</div>
              </div>
            </li>
          ))}
        </ul>

        <div className="paywall-plans" role="radiogroup" aria-label="Subscription plan">
          {SUBSCRIPTION_PLANS.map((p) => {
            const selected = selectedPlan === p.id;
            return (
              <button
                key={p.id}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`paywall-plan${selected ? ' paywall-plan--selected' : ''}${p.isHero ? ' paywall-plan--hero' : ''}`}
                onClick={() => setSelectedPlan(p.id)}
              >
                {p.isHero && <span className="paywall-plan__badge">Best value</span>}
                <div className="paywall-plan__row">
                  <span className="paywall-plan__label">{p.label}</span>
                  <span className="paywall-plan__price">{p.fallbackPrice}</span>
                </div>
                <span className="paywall-plan__sub">{p.subtext}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="paywall-error" role="alert">{error}</p>}
      </div>

      <footer className="paywall-footer">
        <button type="button" className="btn-primary" disabled={loading} onClick={startTrial}>
          {loading ? 'Processing…' : 'Start Free Trial'}
        </button>
        <p className="paywall-billing">{plan.billingNote}. Cancel anytime in Settings.</p>
        <div className="paywall-legal">
          <button type="button" className="paywall-legal__link" disabled={loading} onClick={restore}>
            Restore purchases
          </button>
          <span aria-hidden>·</span>
          <button type="button" className="paywall-legal__link" onClick={() => openExternal(LEGAL.privacyPolicy)}>
            Privacy
          </button>
          <span aria-hidden>·</span>
          <button type="button" className="paywall-legal__link" onClick={() => openExternal(LEGAL.termsOfUse)}>
            Terms
          </button>
        </div>
      </footer>
    </div>
  );
}
