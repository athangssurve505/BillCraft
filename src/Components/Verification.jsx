import React, { useEffect, useState } from 'react';
import '../Css/Verification.css';
   import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../Context/Firebase';
import { toast } from 'react-toastify';

export default function Verification() {
  const [status, setStatus] = useState("Pending Verification");
  const [email, setEmail] = useState(null);
  const firebase = useFirebase();
  const navigate = useNavigate()

  useEffect(() => {
    const getUser = async () => {
      try {
        const user = await firebase.getCurrentUser();
        setEmail(user.email);

        const interval = setInterval(async () => {
          try {
            await user.reload();
            const username = user.email.split("@")[0];

            if (user.emailVerified) {
              setStatus("Verified");
              navigate("/Bills");
              firebase.addUserToFireStore(username);
              clearInterval(interval);
            }
          } catch (reloadError) {
            toast.error("Error reloading user:", reloadError.message);
          }
        }, 1000);
      } catch (error) {
        toast.error("Cannot find any user:", error.message);
      }
    };

    getUser();
  }, []);

  return (
    <div className='Verify-Page'>
      <div className="verification-box">
        <h1>{email ? `A verification link has been sent to email: ${email}` : `Loading...`}</h1>
        <h1>Please verify your mail by clicking the link</h1>
        <p>{`Verification status: ${status}`}</p>
      </div>
    </div>
  );
}
