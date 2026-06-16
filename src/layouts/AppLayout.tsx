import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export function AppLayout() {
  return (
    <div className="screen screen--tabs">
      <Outlet />
      <div className="tab-dock">
        <div className="tab-dock__fade" aria-hidden="true" />
        <NavBar />
      </div>
    </div>
  );
}
