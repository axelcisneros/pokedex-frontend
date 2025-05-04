import './Header.css';
import Navigation from '../Navigation/Navigation';

function Header() {
  return (
    <header className="header">
      <div className="header__container">
        <h1 className="header__title">Pokédex</h1>
        <Navigation />
      </div>
    </header>
  );
}

export default Header;