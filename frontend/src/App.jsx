import React, { useState } from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem('token'))
    );

    const [showRegister, setShowRegister] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setShowRegister(false);
    };

    return (
        <div>

            {isLoggedIn ? (

                <Dashboard onLogout={handleLogout} />

            ) : showRegister ? (

                <Register
                    onSwitchToLogin={() => setShowRegister(false)}
                />

            ) : (

                <Login
                    onLogin={() => setIsLoggedIn(true)}
                    onSwitchToRegister={() => setShowRegister(true)}
                />

            )}

        </div>
    );
}

export default App;