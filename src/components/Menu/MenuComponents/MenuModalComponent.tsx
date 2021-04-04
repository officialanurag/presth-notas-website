import React, { useEffect, useState } from 'react';
import './MenuModal.css';

import UserRegister from './../../User/UserRegisterComponent';
import UserLogin from '../../User/UserLoginComponent';
import { PNLStorage } from './../../../services/presth-notas-localstorage';
import { Users } from '../../../services/users.services';
import { GLOBAL_APP_STATUS } from '../../../global';

export enum  EUSER{
    LOGIN = 'LOGIN',
    REGISTER = 'REGISTER',
    LOGGEDIN = 'LOGGEDIN'
}

function MenuModal() {
    /**
     * Modes = LOGIN, REGISTER, LOGGEDIN
     */
    const [userMode, setUserMode] = useState(EUSER.LOGIN);
    const [errorLogin, setErrorLogin] = useState({email: '', password: ''});
    const [errorRegister, setErrorRegister] = useState({name: '', email: '', password: '', terms_conditions: ''});
    const [name, setName] = useState('');
    const [success, setSuccess] = useState(false);
    
    const showUserPage = (mode: EUSER) => {
        setUserMode(mode);
    }
    
    const logout = () => {
        PNLStorage.remove('_ui');
        PNLStorage.remove('_un');
        setUserMode(EUSER.LOGIN);
        window.location.reload();
    }

    const login = (email: string, password: string) => {
        Users.login(email, password);
    }

    const register = (name: string, email: string, password: string, terms_conditions: boolean) => {
        Users.register(name, email, password, terms_conditions);
    }

    useEffect(() => {    
        const checKLoggedInUser = () => {
            const userId: any = PNLStorage.get('_ui');
            const userName: any = PNLStorage.get('_un');
            if (userId && userName) {
                Users.checkLoggedInUser(userId);
            }
        }

        GLOBAL_APP_STATUS.callMeWhenLive(checKLoggedInUser);

        const onResponse = (data: any) => {
            if (data.service === 'check_logged_in_user') {
                if (data.result.status === false && data.result.message === 'USER_NOT_EXISTS') {
                    setUserMode(EUSER.LOGIN);
                }

                if (data.result.status) {
                    setUserMode(EUSER.LOGGEDIN);
                    setName(PNLStorage.get('_un') || '');
                }
            }

            if (data.service === 'login') {
                if (data.result.status === false) {
                    if (data.result.message === 'USER_NOT_EXISTS') {
                        setErrorLogin({
                            email: 'You are not registered with us. Please create a new account.',
                            password: '',
                        })
                    }
                    if (data.result.message === 'INVALID_PASSWORD') {
                        setErrorLogin({
                            email: '',
                            password: 'Oops! Invalid password. Please try again with correct password.',
                        })
                    }
                }

                if (data.result.status) {
                    PNLStorage.set('_ui', data.result.userId);
                    PNLStorage.set('_un', data.result.name);
                    setUserMode(EUSER.LOGGEDIN);
                    setName(data.result.name);
                    window.location.reload();
                }
            }

            if (data.service === 'register') {
                if (data.result.status === false && data.result.message === 'USER_EXISTS') {
                    setErrorRegister({
                        email: 'You are already registered with us. Please click forgot password to create your new password.',
                        name: '',
                        password: '',
                        terms_conditions: ''
                    })
                }

                if (data.result.status) {
                    setSuccess(true);
                }
            }
        }

        Users.subscribe(onResponse);
    }, []);

    return (
        <>
            <div className="modal presth-notas-modal" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            <span className="pn-logo"><i><b>PN</b></i></span>
                            Presth Notas
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true" className="close-btn">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="pn-nav text-center">
                            {
                                userMode === 'LOGGEDIN'
                                ? (
                                    <>
                                        <span>Hi, { name }</span>
                                        <span onClick={logout}>Logout</span>
                                    </>
                                )
                                : (
                                    <>
                                        <span onClick={() => showUserPage(EUSER.LOGIN)}>Login</span>
                                        <span onClick={() => showUserPage(EUSER.REGISTER)}>Create Account</span>
                                    </>
                                )
                            }
                        </div>
                        <div className="pn-user-frame" hidden={userMode === EUSER.LOGGEDIN}>
                            {
                                userMode === EUSER.LOGIN 
                                ? <UserLogin 
                                    loginUser={login}
                                    loginError={errorLogin}
                                /> 
                                : ''
                            }
                            {
                                userMode === EUSER.REGISTER 
                                ? <UserRegister
                                    registerError={errorRegister}
                                    registerUser={register}
                                    success={success}
                                /> 
                                : ''
                            }
                        </div>
                    </div>
                    <div className="modal-footer">
                    Pickiser&copy; Copyright 2021
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MenuModal;