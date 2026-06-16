import { useNavigate } from 'react-router-dom';
import { ProgressDots } from './ProgressDots';

interface OnboardingHeaderProps {
  backTo: string;
  active: number;
  total?: number;
}

export function OnboardingHeader({ backTo, active, total = 8 }: OnboardingHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="onboarding-nav">
      <button type="button" className="onboarding-nav__back" onClick={() => navigate(backTo)} aria-label="Go back">
        ←
      </button>
      <ProgressDots total={total} active={active} />
      <div className="onboarding-nav__spacer" />
    </div>
  );
}
