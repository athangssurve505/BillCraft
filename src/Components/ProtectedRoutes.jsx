import { React, useEffect, useState } from 'react';
import { useFirebase } from '../Context/Firebase';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from './Loader';

export default function ProtectedRoutes({ children }) {
  const firebase = useFirebase();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = loading

  useEffect(() => {
    let isMounted = true;
    const checkLogin = async () => {
      const loggedIn = await firebase.isUserLoggedIn();
      if (isMounted) {
        setIsLoggedIn(loggedIn);
        if (!loggedIn) toast.info("Please login first to access features of website");
      }
    };
    checkLogin();
    return () => {
        isMounted = false;
      };
  }, [firebase]);

  if (isLoggedIn === null) {
    return <Loader/>; // Show loader if you want
  }

  return isLoggedIn ? children : <Navigate to="/" replace />;
}
