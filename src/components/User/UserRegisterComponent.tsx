import React, { useState } from 'react';
import './User.css';

function UserRegister (
    props: {
        registerUser: Function,
        registerError: {
            name: string;
            email: string;
            password: string;
            terms_conditions: string
        },
        success: boolean
    }
) {
    const { registerError, registerUser, success } = props;
    const [user, setUser] = useState({name: '', email: '', password: '', terms_conditions: false});
    const [error, setError] = useState({name: '', email: '', password: '', terms_conditions: ''});

    const handleChange = (e: any) => {
        const _user: any = { ...user };
        _user[e.target.name] = e.target.value;
        setUser(_user);
    }

    const setSetTemsAndConditions = () => {
        const _user: any = { ...user };
        _user.terms_conditions = !_user.terms_conditions;
        setUser(_user);
    }
    
    const validateInputs = (): boolean => {
        let isError = false;
        const _error = { ...error };
        if (user.name === '') {
            _error['name'] = 'Name is required';
            isError = true;
        }
        if (user.email === '') {
            _error['email'] = 'Email is required';
            isError = true;
        }
        if (user.password === '') {
            _error['password'] = 'Password is required';
            isError = true;
        }
        if (user.terms_conditions === false) {
            _error['terms_conditions'] = 'In order to create account with use, you have accept our terms and conditions.';
            isError = true;
        }
        if (isError) {
            setError(_error);
        } else {
            setError({name: '', email: '', password: '', terms_conditions: ''});
        }
        return isError;
    }
    
    const register = (e: any) => {
        e.preventDefault();
        
        if (!validateInputs()) {
            registerUser(user.name, user.email, user.password, user.terms_conditions);
        }
    }

    return (
        <div className="pn-user-register">
            <form hidden={success}>
                <h4 className="mt-b">
                    Create Account<br/>
                    <span className="pn-small">Get registered with Presth Notas to make your notes centeralized for you.</span>
                </h4>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Full Name</label>
                    <input type="text" name="name" className="form-control" id="exampleInputEmail1" aria-describedby="nameHelp" placeholder="Enter full name" value={user.name} onChange={handleChange}/>
                    <small id="nameHelp" className="form-text text-muted">We need you beautiful name.</small>
                    <div className="invalid-value" hidden={error.name === '' && registerError.name === ''}>{error.name || registerError.name}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email</label>
                    <input type="email" name="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" value={user.email} onChange={handleChange}/>
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                    <div className="invalid-value" hidden={error.email === '' && registerError.email === ''}>{error.email || registerError.email}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" aria-describedby="passwordHelp" value={user.password} onChange={handleChange}/>
                    <small id="passwordHelp" className="form-text text-muted">We'll encrypt your password. Just keep it strong and unguessable.</small>
                    <div className="invalid-value" hidden={error.password === '' && registerError.password === ''}>{error.password || registerError.password}</div>
                </div>
                <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="exampleCheck1" defaultChecked={user.terms_conditions} name="terms_conditions" onClick={setSetTemsAndConditions}/>
                    <label className="form-check-label" htmlFor="exampleCheck1">Accept all terms and conditions.</label>
                    <div className="invalid-value" hidden={error.terms_conditions === '' && registerError.terms_conditions === ''}>{error.terms_conditions || registerError.terms_conditions}</div>
                </div>
                <button type="submit" className="btn btn-primary" onClick={register}>Register</button>
            </form>
            <div className="pn-register-success"  hidden={!success}>
                <h4 className="mt-b">
                    <span className="success">Success</span><br/>
                    <span className="pn-small">You have successfully created you account. Please Login now.</span>
                </h4>
            </div>
        </div>
    )
}

export default UserRegister;