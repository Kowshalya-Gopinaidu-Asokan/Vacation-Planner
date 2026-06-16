import { Button } from '../common/Button';
import { useApp } from '../../context/AppContext';

export type View = 'dashboard' | 'trips' | 'trip-detail';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Header({ currentView, onNavigate }: HeaderProps) {
  const { settings, toggleTheme } = useApp();

  return (
    <header className="header">
      <div className="header__brand" onClick={() => onNavigate('dashboard')} role="button" tabIndex={0}>
        <span className="header__logo" aria-hidden="true">
          ✈
        </span>
        <span className="header__title">Vacation Planner</span>
      </div>

      <nav className="header__nav" aria-label="Main navigation">
        <button
          className={`header__nav-item ${currentView === 'dashboard' ? 'header__nav-item--active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`header__nav-item ${currentView === 'trips' || currentView === 'trip-detail' ? 'header__nav-item--active' : ''}`}
          onClick={() => onNavigate('trips')}
        >
          My Trips
        </button>
      </nav>

      <div className="header__actions">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label={`Switch to ${settings.theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {settings.theme === 'light' ? '🌙' : '☀️'}
        </Button>
      </div>
    </header>
  );
}
