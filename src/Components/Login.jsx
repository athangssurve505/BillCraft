import React, { useState } from 'react';
import '../Css/Login.css';
import eye from '../eye.png'; 
import hide_eye from '../invisible.png'; 
import { useFirebase } from '../Context/Firebase';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Login({ onSwitch }) {
  const navigate = useNavigate(); 
  const [passCheck, setpassCheck] = useState();
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const firebase = useFirebase();

  const mail_regex = /[A-Z a-z 0-9]+(?:[.%][a-z A-Z0-9]+)*@[a-z]+\.[a-z]{2,}/gm;

  const [LoginForm, setLoginForm] = useState({
    email: "",
    password: "",
    isValid: false,
  });

  const changeImg = () => {
    setShow(!show);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "password" && value.trim().length > 0) {
      setpassCheck(true);
    } else if (name === "password") {
      setpassCheck(false);
    }
  };

  const login = async () => {
    try {
      await firebase.loginUser(LoginForm.email, LoginForm.password);
      toast.success('Login Successful');
      navigate('/Bills', { replace: true });
    } catch (err) {
      toast.error('Invalid credentials');
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    let valid = true;
    let newErrors = {};

    if (!LoginForm.email.trim()) {
      newErrors.email = "* Email is required";
      valid = false;
    } else if (!mail_regex.test(LoginForm.email)) {
      newErrors.email = "* Enter valid email";
      valid = false;
    }

    if (!LoginForm.password.trim()) {
      newErrors.password = "* Password is required";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      login();
    }
  };

  return (
    <form id='login-form'>
      <div id='form-content'>
        <h1>Login</h1>

        <div className="wrapper">
          <div className='input-wrapper'>
            <input
              type="text"
              className='text-input'
              name='email'
              onChange={handleChange}
              placeholder='Enter your email...'
              required
            />
            <i className="ri-mail-line"></i>
          </div>
          {errors.email && <p className="display">{errors.email}</p>}
        </div>

        <div className="wrapper">
          <div className='input-wrapper'>
            <input
              type={show ? 'text' : 'password'}
              onChange={handleChange}
              name='password'
              className='text-input'
              placeholder='Enter your password...'
              required
            />
            <i className="ri-lock-line"></i>
            {passCheck && (
              <img
                src={show ? eye : hide_eye}
                onClick={changeImg}
                alt='eye-image'
              />
            )}
          </div>
          {errors.password && <p className="display">{errors.password}</p>}
        </div>

        <p>Don't have an account? <span onClick={onSwitch}>Create account</span></p>

        <button id='login-button' onClick={validateForm}>Login</button>
      </div>
    </form>
  );
}
