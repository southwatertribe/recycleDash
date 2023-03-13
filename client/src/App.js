import './App.css';
//Pages
import LoginPage from './pages/LoginPage/LoginPage';
import { Dash } from './pages/Dash.js/Dash';
import { Layout } from './pages/Layout';
import { Routes, Route } from "react-router-dom"; 
import RequireAuth from './utils/RequireAuth';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Pubic routes */}
        <Route path="/" element={<LoginPage/>}/>

        {/* Protected */}
        <Route element={<RequireAuth/>}>
          <Route path="dash" element={<Dash/>}/>
        </Route>
      </Route>
    </Routes>
  );
}

export default App; 
