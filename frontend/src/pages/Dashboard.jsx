
import React, { useEffect, useState } from 'react';
import API from '../services/api';

import Sidebar from '../components/Sidebar';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import CategoryReport from './CategoryReport';
import MonthlyReport from './MonthlyReport';
import CategoryChart from '../components/CategoryChart';
import MonthlyChart from '../components/MonthlyChart';
import MonthlyBudget from './MonthlyBudget';

import './Dashboard.css';

function Dashboard({ onLogout }) {

    const [activePage, setActivePage] = useState('Dashboard');

    const [summary, setSummary] = useState({
        total_income: 0,
        total_expenses: 0,
        balance: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setError('');
                const response = await API.get('dashboard-summary/');
                setSummary(response.data);
            } catch (err) {
                setError('Unable to load dashboard data.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, [refreshKey]);

    return (
        <div>
            <Sidebar
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="dashboard-container">

                <div className="dashboard-header">
                    <div>
                        <h1>Personal Expense Tracker</h1>
                        <p>Manage your money smarter.</p>
                    </div>

                    <button onClick={onLogout}>Logout</button>
                </div>

                <section id="dashboard">
                    <h2>Dashboard Overview</h2>

                    {loading ? (
                        <p>Loading dashboard...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        <div className="summary-cards">
                            <div className="summary-card income-card">
                                <h3>Total Income</h3>
                                <p>₹{Number(summary.total_income).toFixed(2)}</p>
                            </div>

                            <div className="summary-card expense-card">
                                <h3>Total Expenses</h3>
                                <p>₹{Number(summary.total_expenses).toFixed(2)}</p>
                            </div>

                            <div className="summary-card balance-card">
                                <h3>Balance</h3>
                                <p>₹{Number(summary.balance).toFixed(2)}</p>
                            </div>
                        </div>
                    )}
                </section>

                <hr />

                <section id="add-transaction">
                    <AddTransaction
                        onTransactionAdded={() => {
                            setRefreshKey(prev => prev + 1);
                        }}
                    />
                </section>

                <hr />

                <section id="transactions">
                    <TransactionList refreshKey={refreshKey} />
                </section>

                <hr />

                <section id="category-report">
                    <CategoryReport refreshKey={refreshKey} />
                </section>

                <hr />

                <section id="monthly-report">
                    <MonthlyReport refreshKey={refreshKey} />
                </section>
                <hr />
                <section id="monthly-budget">
                    <MonthlyBudget />
                </section>

                <section id="charts">
                    <h2>Expense Analytics</h2>

                    <CategoryChart refreshKey={refreshKey} />

                    <hr />

                    <MonthlyChart refreshKey={refreshKey} />
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
