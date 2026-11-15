
import React, { useState } from 'react';
import API from '../services/api';

function Login({ onLogin, onSwitchToRegister }) {    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage('');

        try {
            const response = await API.post('login/', {
                username: username,
                password: password
            });

            localStorage.setItem('token', response.data.token);

            setMessage('Login successful!');

            onLogin();

        } catch (error) {

            console.error('Login Error:', error.response?.data || error.message);

            if (error.response) {
                const errorData = error.response.data;

                setMessage(
                    errorData.non_field_errors?.[0] ||
                    errorData.detail ||
                    JSON.stringify(errorData)
                );

            } else {
                setMessage('Cannot connect to the Django server.');
            }
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Personal Expense Tracker</h1>

            <h2>Login</h2>

            <form onSubmit={handleLogin}>

                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

            </form>

            <p>{message}</p>
            <p>Don't have an account?</p>

            <button
                type="button"
                onClick={onSwitchToRegister}
            >
                Create Account
            </button>
        </div>
    );
}

export default Login;
