import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function OnboardingGuard() {
  const { state } = useApp();
  if (state.profile.isSubscribed) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function PaywallGuard() {
  const { state } = useApp();
  if (state.profile.isSubscribed) return <Navigate to="/" replace />;
  return <Outlet />;
}

export function AppGuard() {
  const { state } = useApp();
  if (!state.profile.isSubscribed) return <Navigate to="/onboarding/paywall" replace />;
  if (!state.profile.onboardingComplete) return <Navigate to="/onboarding" replace />;
  return <Outlet />;
}
