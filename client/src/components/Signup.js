import React, { useState, useContext } from "react";
import { createUserDoc, createNativeUser } from "../firebase/firebase";
import FormInput from "./FormInput";
import Button from "./Button";
import { UserContext } from "../contexts/userContext";
import '../styles/Signup.scss';

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}


const Signup = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { displayName, email, password, confirmPassword } = formFields;

    const { setCurrentUser } = useContext(UserContext);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            const { user } = await createNativeUser(email, password);
            setCurrentUser(user);
            await createUserDoc(user, { displayName });
            resetFormFields();
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Cannot create user, email already exists');
            } else {
                console.log("Error creating user", error);
            }
        }
    }

    return (
        <div className="sign-up-container">
            <h2>Don't have an account?</h2>
            <span>Sign up with your email and password</span>
            <form onSubmit={handleOnSubmit}>
                <FormInput label="Display Name" type="text" required onChange={handleChange} value={displayName} name='displayName' />

                <FormInput label="Email" type="email" required onChange={handleChange} value={email} name='email' />

                <FormInput label="Password" type="password" required onChange={handleChange} value={password} name='password' />

                <FormInput label="Confirm Password" type="password" required onChange={handleChange} value={confirmPassword} name='confirmPassword' />

                <Button type='submit'>Sign Up</Button>
            </form>
        </div>
    )
}

export default Signup;