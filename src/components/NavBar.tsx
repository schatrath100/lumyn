import { NavLink, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Home', sym: '⌂', match: ['/', '/mood/result'] },
  { to: '/library', label: 'Library', sym: '≡', match: ['/library'] },
  { to: '/combo', label: 'Combo', sym: '◈', match: ['/combo', '/combos', '/share'] },
  { to: '/mood', label: 'Mood', sym: '◉', match: ['/mood'] },
  { to: '/journal', label: 'Journal', sym: '↗', match: ['/journal', '/analytics'] },
];

interface NavBarProps {
  dark?: boolean;
}

export function NavBar({ dark }: NavBarProps) {
  const { pathname } = useLocation();

  const isActive = (match: string[]) =>
    match.some((m) => (m === '/' ? pathname === '/' : pathname.startsWith(m)));

  return (
    <nav className={`nav-bar${dark ? ' nav-bar--dark' : ''}`}>
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.match);
        return (
          <NavLink key={item.to} to={item.to} className={`nav-item${active ? ' nav-item--active' : ''}`}>
            <span className="nav-item__icon">{item.sym}</span>
            <span className="nav-item__label">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
