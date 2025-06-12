import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './Components/Navbar';
import Verification from './Components/Verification';
import BillPage from './Components/CreateBill';
import Bills from './Components/Bills';
import Swithcher from './Components/Switcher';
import ProtectedRoutes from './Components/ProtectedRoutes';
import About from './Components/About';
import PublicRoute from './Components/PublicRoute'; 

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
      <Route path="/"element={<PublicRoute><Swithcher /></PublicRoute> }/>
        <Route path="/verify" element={<Verification />} />
        <Route path="/about" element={<About />} />

        <Route path="/BillPage" element={
          <ProtectedRoutes>
            <BillPage />
          </ProtectedRoutes>
        } />
        <Route path="/Bills" element={
          <ProtectedRoutes>
            <Bills />
          </ProtectedRoutes>
        } />
      </Routes>
    </Router>
  );
}

export default App;
