import React, { useState, useEffect } from 'react';
import billImage from '../bill.png';
import '../Css/Navbar.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFirebase } from '../Context/Firebase';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

function Navbar() {
  const [state, setState] = useState({
    isActive: false,
    isAuthPage: false,
    isModalOpen: false,
  });

  const location = useLocation();
  const navigate = useNavigate();
  const firebase = useFirebase();

  useEffect(() => {
    const shouldLockScroll = state.isActive || state.isModalOpen;
    document.body.style.overflow = shouldLockScroll ? 'hidden' : '';

    setState(prev => ({
      ...prev,
      isAuthPage: location.pathname === '/',
    }));

    return () => {
      document.body.style.overflow = '';
    };
  }, [state.isActive, state.isModalOpen, location.pathname]);

  const toggleMenu = () => {
    window.scrollTo(0, 0); // Add this line
    setState(prev => ({
      ...prev,
      isActive: !prev.isActive,
    }));
  };

  const signOutUser = () => {
    toggleMenu();
    setState(prev => ({ ...prev, isModalOpen: true }));

    confirmAlert({
      title: 'Confirm to logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await firebase.Logout();
            setState(prev => ({ ...prev, isModalOpen: false }));
            navigate('/', { replace: true });
          },
        },
        {
          label: 'No',
          onClick: () => {
            setState(prev => ({ ...prev, isModalOpen: false }));
          },
        },
      ],
      afterClose: () => {
        setState(prev => ({ ...prev, isModalOpen: false }));
      },
    });
  };

  return (
    <>
      <div className={`offScreen-menu list-common ${state.isActive ? 'showMenu' : ''}`}>
        <ul>
          <li onClick={() => { toggleMenu(); navigate('/Bills'); }}>View Bills</li>
          <li onClick={() => { toggleMenu(); navigate('/BillPage'); }}>Create Bill</li>
          <li onClick={()=>{toggleMenu(); navigate("/About");}}>About</li>
          {!state.isAuthPage && <li onClick={signOutUser}>Logout</li>}
        </ul>
      </div>

      <nav>
        <div id="img-name-div">
          <img src={billImage} id="navbar-bill-img" alt="bill-img" />
          <p>Bill Craft</p>
        </div>

        <div className="onScreen-menu list-common">
          <ul>
            <li>
              <button className="menu-button" onClick={toggleMenu}>
                <svg
                  id="menu-icon"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect className={`line ${state.isActive ? 'top' : ''}`} x="2" y="3" width="30" height="2" rx="1" />
                  <rect className={`line ${state.isActive ? 'middle' : ''}`} x="2" y="8" width="30" height="2" rx="1" />
                  <rect className={`line ${state.isActive ? 'bottom' : ''}`} x="2" y="13" width="30" height="2" rx="1" />
                </svg>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
