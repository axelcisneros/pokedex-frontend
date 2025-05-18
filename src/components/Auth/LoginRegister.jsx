import { useState, useContext, useEffect } from 'react';
import UserContext from '../../context/UserContext';
import { login, register } from '../../utils/MainApi';
import './LoginRegister.css';

function LoginRegister({ onClose }) {
  const { setUser, setIsLoggedIn, setToken } = useContext(UserContext);
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Evita el scroll de fondo al abrir el modal
  useEffect(() => {
    document.body.classList.add('modal-open');
    const handleEscClose = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscClose);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const data = await login(form.email, form.password);
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('jwt', data.token);
          setIsLoggedIn(true);
          setUser(data.user || null);
          onClose();
        } else if (data.status === 401) {
          setError('Correo o contraseña incorrectos.');
        } else if (data.status === 404) {
          setError('Usuario no registrado.');
        } else {
          setError(data.message || 'Error al iniciar sesión');
        }
      } else {
        const data = await register(form.name, form.email, form.password);
        if (data.status === 201 || data.email) {
          setIsLogin(true);
        } else if (data.status === 400 && data.message && data.message.includes('duplicate')) {
          setError('El correo ya está registrado.');
        } else if (data.status === 400 && data.message && data.message.includes('correo')) {
          setError('Correo electrónico no válido.');
        } else {
          setError(data.message || 'Error al registrarse');
        }
      }
    } catch {
      setError('Error de red o del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal" onClick={handleOverlayClick}>
      <div className="auth-modal__content" onClick={e => e.stopPropagation()}>
        <button className="auth-modal__close" onClick={onClose}>&times;</button>
        <h2>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
        <form onSubmit={handleSubmit} className="auth-modal__form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              id='name'
              placeholder="Nombre"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            id='email'
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            autoComplete="username"
            required
          />
          <input
            type="password"
            name="password"
            id='password'
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            required
          />
          {error && <div className="auth-modal__error">{error}</div>}
          <button type="submit" disabled={loading} className="auth-modal__submit">
            {loading ? 'Cargando...' : isLogin ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
        <div className="auth-modal__switch">
          {isLogin ? (
            <>
              ¿No tienes cuenta?{' '}
              <button type="button" onClick={() => setIsLogin(false)} className="auth-modal__link">Regístrate</button>
            </>
          ) : (
            <>
              ¿Ya tienes cuenta?{' '}
              <button type="button" onClick={() => setIsLogin(true)} className="auth-modal__link">Inicia sesión</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginRegister;
