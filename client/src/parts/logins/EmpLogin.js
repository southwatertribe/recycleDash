import { useRef, useState, useEffect } from 'react';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';
import loginStyles from '../../styles/Login.module.css'; // Import the CSS module

// Utils
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Backend
const LOGIN_URL = '/login/emp-auth';

const EmpLogin = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dash';
  const user_nameRef = useRef();

  const [user_name, setuser_name] = useState('');
  const [pwd, setPWD] = useState('');

  useEffect(() => {
    user_nameRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user_name: user_name, password: pwd }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      const at = response?.data.access_token;
      const role = response?.data.role;
      const business_id = response?.data.business_id;
      const f_name = response?.data.f_name;
      const l_name = response?.data.l_name;
      const user_id = response?.data.user_id;
      const curr_location = response?.data.curr_location;
      setAuth({ user_name, role, at, business_id, f_name, l_name, user_id, curr_location });
      setuser_name('');
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
          <label htmlFor="user_name" className={loginStyles.label}>
            User Name
          </label>
          <input
            type="text"
            id="user_name"
            ref={user_nameRef}
            autoComplete="off"
            className={loginStyles.input}
            onChange={(e) => setuser_name(e.target.value)}
            value={user_name}
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
            value={pwd}
            required
          />
        </div>
        <button className={loginStyles.button}>Sign In</button>
      </form>
      {/* MAKE A SIGN UP */}
    </div>
  );
};

export default EmpLogin;
