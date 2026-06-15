import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';

export function AppLayout() {
  return (
    <div className="screen">
      <Outlet />
      <div className="screen__footer screen__footer--nav">
        <NavBar />
      </div>
    </div>
  );
}
