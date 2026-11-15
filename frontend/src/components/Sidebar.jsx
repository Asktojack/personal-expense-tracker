
import React from 'react';
import './Sidebar.css';

function Sidebar({ activePage, setActivePage }) {

    const menuItems = [
        { name: 'Dashboard', id: 'dashboard' },
        { name: 'Transactions', id: 'transactions' },
        { name: 'Add Transaction', id: 'add-transaction' },
        { name: 'Category Report', id: 'category-report' },
        { name: 'Monthly Report', id: 'monthly-report' },
        { name: 'Monthly Budget', id: 'monthly-budget' },
        { name: 'Expense Analytics', id: 'charts' }
   ];

    const handleNavigation = (item) => {
        setActivePage(item.name);

        document.getElementById(item.id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    return (
        <div className="sidebar">

            <h2>Expense Tracker</h2>

            <nav>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={
                            activePage === item.name ? 'active-menu' : ''
                        }
                        onClick={() => handleNavigation(item)}
                    >
                        {item.name}
                    </button>
                ))}
            </nav>

        </div>
    );
}

export default Sidebar;
