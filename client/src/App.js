import './App.css';
//Pages
import LoginPage from './pages/LoginPage/LoginPage';
import { Dash } from './pages/Dash.js/Dash';
import { Layout } from './pages/Layout';
import { Routes, Route } from "react-router-dom"; 
import RequireAuth from './utils/RequireAuth';
import LocationDash from './pages/LocationDash/LocationDash';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        {/* Pubic routes */}
        <Route path="/" element={<LoginPage/>}/>

        {/* Protected */}
        <Route element={<RequireAuth/>}>
          <Route path="dash" element={<Dash/>}/>

          <Route path="location-dash/:location_id" element={<LocationDash/>}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App; 
