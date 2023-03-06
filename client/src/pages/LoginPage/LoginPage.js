import { useRef, useState, useEffect} from 'react';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

//Utils
import { Link, useNavigate, useLocation } from 'react-router-dom';
//Backend
const LOGIN_URL = "/login"




const LoginPage = () => {
  const {setAuth} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/"
  const emailRef = useRef();
  //Make err ref

  const [email, setEmail]= useState('');
  const [pwd, setPWD] = useState('');


  //UseEffects
  useEffect(()=>{
    emailRef.current.focus()
  }, []);
  //Make err effect

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(LOGIN_URL, 
            JSON.stringify({email: email, password: pwd}),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
            }
        );
        console.log(JSON.stringify(response))
        const at = response?.data;
        setAuth({email, pwd, at})
        setEmail('');
        setPWD('');
        //Nav
        navigate(from, { replace: true});        
    } catch (error) {
        
    }
    
  }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <label htmlFor='email'>email</label>
            <input
                type="text"
                id="email"
                ref={emailRef}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
            />
            <label htmlFor='pwd'>Password: </label>
            <input
                type="password"
                id="pwd"
                autoComplete="off"
                onChange={(e) => setPWD(e.target.value)}
                value={pwd}
                required
            />
            <button>Sign In</button>
        </form>
        {/* MAKE A SIGN UP  */}
    </div>
  )
}

export default LoginPage