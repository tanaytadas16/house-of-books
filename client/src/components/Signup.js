import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { createNativeUser } from '../firebase/firebase';
import FormInput from './FormInput';
import Button from './Button';
import { UserContext } from '../contexts/userContext';
import '../styles/Signup.scss';

const defaultFormFields = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
  address: '',
  city: '',
  state: '',
  zip: '',
};

const Signup = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    username,
    password,
    confirmPassword,
    address,
    city,
    state,
    zip,
  } = formFields;

  const { setCurrentUser } = useContext(UserContext);
  const history = useNavigate();

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  const handleOnSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const { user } = await createNativeUser(email, password);
      setCurrentUser(user);
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already exists');
      } else {
        console.log('Error creating user', error);
      }
    }
    let dataBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      username: username,
      password: password,
      address: address,
      city: city,
      state: state,
      zip: zip,
    };
    axios
      .post('http://localhost:4000/users/signup', {
        data: dataBody,
      })
      .then(function (response) {
        console.log(response.data);
        history('/', { replace: true });
      });
  };

  return (
    <div className='sign-up-container'>
      <h2>Don't have an account?</h2>
      <span>Sign up with your email and password</span>
      <form onSubmit={handleOnSubmit}>
        <FormInput
          label='First Name'
          type='text'
          required
          onChange={handleChange}
          value={firstName}
          name='firstName'
        />
        <FormInput
          label='Last Name'
          type='text'
          required
          onChange={handleChange}
          value={lastName}
          name='lastName'
        />
        <FormInput
          label='Email'
          type='email'
          required
          onChange={handleChange}
          value={email}
          name='email'
        />
        <FormInput
          label='Phone Number'
          type='text'
          required
          onChange={handleChange}
          value={phoneNumber}
          name='phoneNumber'
        />
        <FormInput
          label='Username'
          type='text'
          required
          onChange={handleChange}
          value={username}
          name='username'
        />
        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          value={password}
          name='password'
        />
        <FormInput
          label='Confirm Password'
          type='password'
          required
          onChange={handleChange}
          value={confirmPassword}
          name='confirmPassword'
        />
        <FormInput
          label='Address'
          type='text'
          required
          onChange={handleChange}
          value={address}
          name='address'
        />
        <FormInput
          label='City'
          type='text'
          required
          onChange={handleChange}
          value={city}
          name='city'
        />
        <FormInput
          label='State'
          type='text'
          required
          onChange={handleChange}
          value={state}
          name='state'
        />
        <FormInput
          label='Zip'
          type='text'
          required
          onChange={handleChange}
          value={zip}
          name='zip'
        />

        <Button type='submit'>Sign Up</Button>
      </form>
    </div>
  );
};

export default Signup;
