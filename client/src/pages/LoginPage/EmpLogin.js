import { useRef, useState, useEffect} from 'react';
import axios from '../../utils/axios';
import useAuth from '../../hooks/useAuth';

//Utils
import { Link, useNavigate, useLocation } from 'react-router-dom';
//Backend
const LOGIN_URL = "/login/emp-auth"




const EmpLogin = () => {
  const {setAuth} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dash"
  const user_nameRef = useRef();
  //Make err ref

  const [user_name, setuser_name]= useState('');
  const [pwd, setPWD] = useState('');


  //UseEffects
  useEffect(()=>{
    user_nameRef.current.focus()
  }, []);
  //Make err effect

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
        const response = await axios.post(LOGIN_URL, 
            JSON.stringify({user_name: user_name, password: pwd}),
            {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true,
            }
        );

        const at = response?.data.access_token
        const role = response?.data.role
        const business_id = response?.data.business_id
        const f_name = response?.data.f_name
        const l_name = response?.data.l_name
        const user_id = response?.data.user_id
        setAuth({user_name, role, at, business_id, f_name, l_name, user_id})
        setuser_name('');
        setPWD('');
        //Nav
        navigate(from, { replace: true});        
    } catch (error) {
      console.log(error)        
    }
    
  }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <label htmlFor='user_name'>user_name</label>
            <input
                type="text"
                id="user_name"
                ref={user_nameRef}
                autoComplete="off"
                onChange={(e) => setuser_name(e.target.value)}
                value={user_name}
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

export default EmpLogin