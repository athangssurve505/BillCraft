import React from "react";
import "../Css/CreateAcc.css";
import eye from "../eye.png";
import hide_eye from "../invisible.png";
import { useState } from "react";
import { useFirebase } from "../Context/Firebase";
import { toast} from 'react-toastify';


import { useNavigate } from 'react-router-dom';

export default function CreateAcc({onSwitch}) {

  const firebase = useFirebase();
  const navigate = useNavigate();

  const [NewAccForm ,setNewAccForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    isValid: false,
  });

  const [errors, setErrors] = useState({});

  const [show, setshow] = useState(false);
  const [reshow, setreshow] = useState(false);

  const handleFormChange = (e) => {
    e.preventDefault();
    setErrors((prevState) => ({
      ...prevState,
      [name]: "",
    }));
    const { name, value } = e.target;
    setNewAccForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const validateForm = (e) => {
    e.preventDefault(); // Prevent form submission
    let valid = true;

    let newErrors = {};

    if (!NewAccForm.email.trim()) {
      newErrors.email = "* Email is required";
    valid= false    } else if (!mail_regex.test(NewAccForm.email)) {
      newErrors.email = "* Enter valid email"; valid= false 
    }

    if (!NewAccForm.password.trim()) {
      newErrors.password = "* Password is required"; valid= false 
    } else if (!pass_regex.test(NewAccForm.password)) {
      newErrors.password =
        "* Password must be at least 8 characters long and include one uppercase, one lowercase, and one special character.";
        valid= false 
    }

    if (NewAccForm.confirmPassword !== NewAccForm.password) {
      newErrors.confirmPassword = "* Passwords do not match";
      valid= false 
    }
    setErrors(newErrors);

    if(valid){
      toast.success('Account has been created successfully')
      addUserToFirebase(NewAccForm.email,NewAccForm.password);
    }
  }
  // Regex
  const mail_regex = /[A-Z a-z 0-9]+(?:[.%][a-z A-Z0-9]+)*@[a-z]+\.[a-z]{2,}/gm;
  const pass_regex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{8,}/;


  const addUserToFirebase = (email,password) =>{
    firebase
        .signUpUser(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (user) {
            firebase
              .sendEmailVerificationLink(user)
              .then(() => {
                navigate("/verify",{replace:true});
              })
              .catch((error) => {
                console.log("Error sending verification email:", error.message)
              });
          } else {
            console.log("No user object found in userCredential.");
          }
        })
        .catch((error) => {
          console.log("Error signing up user:", error.message);
        });
    }
  
  
  

  return (
    <form id="account-creation-form">
      <div id="account-creation-form-content">
        <h1>Create Account</h1>

        <div className="wrapper">
          <div className="input-wrapper">
            <input
              type="text"
              className="text-input"
              name="email"
              onChange={handleFormChange}
              placeholder="Enter your email..."
              required
            />
            <i className="ri-mail-line"></i>
          </div>
          {errors.email && <p className="display">{errors.email}</p>}
        </div>

        <div className="wrapper">
          <div className="input-wrapper">
            <input
              type={show ? "text" : "password"}
              className="text-input"
              name="password"
              onChange={handleFormChange}
              placeholder="Enter your password..."
              required
            />
            <i className="ri-lock-line"></i>
            {NewAccForm.password && (
              <img
                src={show ? eye : hide_eye}
                onClick={() => {
                  setshow(!show);
                }}
                alt="eye-image"
              />
            )}
          </div>
          {errors.password && <p className="display">{errors.password}</p>}
        </div>

        <div className="wrapper">
          <div className="input-wrapper">
            <input
              type={reshow ? "text" : "password"}
              className="text-input"
              name="confirmPassword"
              onChange={handleFormChange}
              placeholder="Re-Enter your password..."
              required
            />
            <i className="ri-lock-line"></i>
            {NewAccForm.confirmPassword && (
              <img
                src={reshow ? eye : hide_eye}
                onClick={() => {
                  setreshow(!reshow);
                }}
                alt="eye-image"
              />
            )}
          </div>
          {errors.confirmPassword && (
            <p className="display">{errors.confirmPassword}</p>
          )}
        </div>

        <p>
          Already have an account? <span onClick={onSwitch}>Login</span>
        </p>

        <button id="create-account-button" onClick={validateForm}>
          Create Account
        </button>
      </div>
    </form>
  );
}

