import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">
          © {currentYear} Pokédex. Desarrollado con PokeAPI
        </p>
      </div>
    </footer>
  );
}

export default Footer;