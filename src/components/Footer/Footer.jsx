import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">
          &copy; {currentYear} Pokédex. Backend propio + PokeAPI + React. All rights reserved. By Axel Cisneros.
        </p>
      </div>
    </footer>
  );
}

export default Footer;