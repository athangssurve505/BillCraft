import React, { useState ,useEffect} from 'react'
import CreateAcc from '../Components/CreateAcc'
import Login from "../Components/Login"
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Context/Firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Swithcher() {
  const [isLogin, setLogin] = useState(false)
  const firebase = useFirebase();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/Bills', { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  return (
    <>
      {isLogin ? (
        <Login onSwitch={() => setLogin(false)} />
        
      ) : (
        <CreateAcc onSwitch={() => setLogin(true)} />
      )}
    </>
  )
}
