import './Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <p className="footer__text">
          &copy; {currentYear} Pokédex. Built with PokeAPI and React. All rights reserved. By Axel Cisneros.
        </p>
      </div>
    </footer>
  );
}

export default Footer;