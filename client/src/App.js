import './App.css';
//Pages
import LoginPage from './pages/LoginPage/LoginPage';
import { AdminDash } from './pages/AdminDash.js/AdminDash';
import { Layout } from './pages/Layout';
import { Routes, Route } from "react-router-dom"; 
import RequireAuth from './utils/RequireAuth';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Pubic routes */}
        <Route path="login" element={<LoginPage/>}/>

        {/* Protected */}
        <Route element={<RequireAuth/>}>
          <Route path="admin" element={<AdminDash/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App; 
