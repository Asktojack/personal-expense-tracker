import React, { useState } from 'react';
import API from '../services/api';

function Register({ onSwitchToLogin }) {

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        try {
            await API.post('register/', formData);

            setMessage('Registration successful! You can now log in.');

            setFormData({
                username: '',
                email: '',
                password: ''
            });

        } catch (error) {
            const errors = error.response?.data;

            setMessage(
                errors
                    ? JSON.stringify(errors)
                    : 'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Personal Expense Tracker</h1>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>

                <label>Username</label>
                <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength="8"
                    required
                />

                <br /><br />

                <button type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

            </form>

            <p>{message}</p>

            <button onClick={onSwitchToLogin}>
                Back to Login
            </button>
        </div>
    );
}

export default Register;