import React, { useState } from 'react';
import './User.css';

function UserLogin (props: {
    loginUser: Function,
    loginError: {
        email: string,
        password: string
    }
}) {
    const { loginError, loginUser } = props;
    const [user, setUser] = useState({email: '', password: ''});
    const [error, setError] = useState({email: '', password: ''});

    const handleChange = (e: any) => {
        const _user: any = { ...user };
        _user[e.target.name] = e.target.value;
        setUser(_user);
    }

    const validateInputs = (): boolean => {
        let isError = false;
        const _error = { ...error };
        if (user.email === '') {
            _error['email'] = 'Email is required';
            isError = true;
        }
        if (user.password === '') {
            _error['password'] = 'Password is required';
            isError = true;
        }
        if (isError) {
            setError(_error);
        } else {
            setError({email: '', password: ''});
        }
        return isError;
    }

    const login = (e: any) => {
        e.preventDefault();
        
        if (!validateInputs()) {
            loginUser(user.email, user.password);
        }
    }

    return (
        <form className="pn-user-register">
            <h4 className="mt-b">
                Login<br/>
                <span className="pn-small">Keep your notes updated by logging in always.</span>
            </h4>
            <div className="form-group">
                <label htmlFor="exampleInputEmail1">Email</label>
                <input type="email" name="email" className="form-control" id="exampleInputEmail1" placeholder="Enter email" value={user.email} onChange={handleChange}/>
                <div className="invalid-value" hidden={error.email === '' && loginError.email === ''}>{error.email || loginError.email}</div>
            </div>
            <div className="form-group">
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={user.password} onChange={handleChange}/>
                <div className="invalid-value" hidden={error.password === '' && loginError.password === ''}>{error.password || loginError.password}</div>
            </div>
            <button type="submit" className="btn btn-primary" onClick={login}>Get In</button>
        </form>
    )
}

export default UserLogin;