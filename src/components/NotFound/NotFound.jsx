import './NotFound.css';
import notFoundImage from '../../assets/images/404.png';
import Button from '../Button/Button';

function NotFound({ onBackToAll }) {
  return (
    <div className="not-found">
      <img src={notFoundImage} alt="Not Found" className="not-found__image" />
      <p className="not-found__text">No se encontró información</p>
      <Button onClick={onBackToAll} className="button not-found__button">
        Volver a todos
      </Button>
    </div>
  );
}

export default NotFound;