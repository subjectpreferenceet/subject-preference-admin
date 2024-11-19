import React, { useContext, useState } from 'react';
import "./Login.css";
import { useNavigate } from 'react-router-dom';
import { login, resetPass } from '../../config/firebaseConfig';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loading,setLoading } = useContext(StoreContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {

            await login(email, password);
            setIsAuthenticated(true); 
            navigate('/home'); 
            
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false)
    };

    return (
        <div className='login-popup'>
            <form onSubmit={handleLogin} className="login-popup-container">
                <div className="login-popup-title">
                
                </div>
                <div className="login-popup-inputs">
                    <h2>Admin Login</h2>
                    <input onChange={(e) => { setEmail(e.target.value) }} value={email} type="text" placeholder='Email ID' required />
                    <input onChange={(e) => { setPassword(e.target.value) }} value={password} type="password" placeholder='Password' required />
                </div>
                <button type='submit'>Login</button>
                <p>Forgot Password? <span onClick={()=>{resetPass(email)}}>Click Here</span></p>
            </form>
        </div>
    );
}

export default Login;
