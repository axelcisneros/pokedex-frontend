import { NavLink } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation__list">
        <li className="navigation__item">
          <NavLink 
            to="/" 
            className={({ isActive }) => `navigation__link ${isActive ? 'navigation__link_active' : ''}`}
            end
          >
            Todos
          </NavLink>
        </li>
        <li className="navigation__item">
          <NavLink 
            to="/favorites" 
            className={({ isActive }) => `navigation__link ${isActive ? 'navigation__link_active' : ''}`}
          >
            Favoritos
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;