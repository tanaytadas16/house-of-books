import React, { useState } from "react";
import { NativeSignIn, signInWithGooglePopup } from "../firebase/firebase";
import FormInput from "./FormInput";
import Button from "./Button";
import '../styles/Signin.scss';

const defaultFormFields = {
    email: '',
    password: ''
}


const Signin = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const SignInWithGoogle = async () => {
        await signInWithGooglePopup();
    }

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormFields({ ...formFields, [name]: value });
    }

    const handleOnSubmit = async (event) => {
        event.preventDefault();

        try {
            await NativeSignIn(email, password);
            resetFormFields();
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                alert('Invalid email or password');
            }
            console.log('Error signing in', error);
        }
    }

    return (
        <div className="sign-up-container">
            <h2>Already have an account?</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={handleOnSubmit}>
                <FormInput label="Email" type="email" required onChange={handleChange} value={email} name='email' />

                <FormInput label="Password" type="password" required onChange={handleChange} value={password} name='password' />

                <div className="buttons-container">
                    <Button type='submit'>Sign In</Button>
                    <Button type='button' buttonType='google' onClick={SignInWithGoogle}>Google sign in</Button>
                </div>
            </form>
        </div>
    )
}

export default Signin;