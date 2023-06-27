import { useRef, useState, useEffect} from 'react';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

//Utils
import { Link, useNavigate, useLocation } from 'react-router-dom';
//Styles
import loginStyles from '../../styles/Login.module.css';

//Backend
const LOGIN_URL = '/login/admin-auth';



const AdminLogin = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dash';
  const emailRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPWD] = useState('');

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ email: email, password: password }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const at = response?.data.access_token;
      const role = response?.data.role;
      const business_id = response?.data.business_id;
      const user_id = response?.data.user_id;

      setAuth({ email, role, at, business_id, user_id });
      setEmail('');
      setPWD('');
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={loginStyles.container}>
      <form className={loginStyles.form} onSubmit={handleSubmit}>
        <h1 className={loginStyles.title}>Sign In</h1>
        <div className={loginStyles.inputGroup}>
          <label htmlFor="email" className={loginStyles.label}>
            Email
          </label>
          <input
            type="text"
            id="email"
            ref={emailRef}
            autoComplete="off"
            className={loginStyles.input}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>
        <div className={loginStyles.inputGroup}>
          <label htmlFor="pwd" className={loginStyles.label}>
            Password
          </label>
          <input
            type="password"
            id="pwd"
            autoComplete="off"
            className={loginStyles.input}
            onChange={(e) => setPWD(e.target.value)}
            value={password}
            required
          />
        </div>
        <button className={loginStyles.button}>Sign In</button>
      </form>
      {/* MAKE A SIGN UP */}
    </div>
  );
};

export default AdminLogin;