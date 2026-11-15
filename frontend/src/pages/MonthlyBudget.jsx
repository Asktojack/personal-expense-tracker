
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './MonthlyBudget.css';

function MonthlyBudget() {
    const [budgets, setBudgets] = useState([]);
    const [transactions, setTransactions] = useState([]);

    const [month, setMonth] = useState(
        new Date().toISOString().slice(0, 7)
    );

    const [budgetAmount, setBudgetAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    const fetchData = async () => {
        try {
            const [budgetResponse, transactionResponse] =
                await Promise.all([
                    API.get('budgets/'),
                    API.get('transactions/')
                ]);

            setBudgets(budgetResponse.data);
            setTransactions(transactionResponse.data);

        } catch (error) {
            console.error('Budget Error:', error);
            setMessage('Unable to load budget information.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (Number(budgetAmount) <= 0) {
            setMessage('Please enter a valid budget amount.');
            return;
        }

        try {
            await API.post('budgets/', {
                month: `${month}-01`,
                budget_amount: budgetAmount
            });

            setMessage('Monthly budget saved successfully!');
            setBudgetAmount('');

            await fetchData();

        } catch (error) {
            console.error('Save Budget Error:', error);

            setMessage(
                error.response?.data?.month
                    ? 'Unable to save budget for this month.'
                    : 'Unable to save budget. Please check your details.'
            );
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this monthly budget?'
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`budgets/${id}/`);

            setMessage('Monthly budget deleted successfully!');

            await fetchData();

        } catch (error) {
            console.error('Delete Budget Error:', error);
            setMessage('Unable to delete monthly budget.');
        }
    };

    const handleEdit = (budget) => {
        setMonth(budget.month.slice(0, 7));
        setBudgetAmount(budget.budget_amount);
        setMessage('You can now edit the selected monthly budget.');
    };


    const selectedBudget = budgets.find(
        (budget) => budget.month.slice(0, 7) === month
    );

    const monthlyExpenses = transactions
        .filter((transaction) =>
            transaction.transaction_type === 'expense' &&
            String(transaction.date).slice(0, 7) === month
        )
        .reduce(
            (total, transaction) =>
                total + Number(transaction.amount),
            0
        );

    const limit = selectedBudget
        ? Number(selectedBudget.budget_amount)
        : 0;

    const remaining = limit - monthlyExpenses;

    const percentage = limit > 0
        ? (monthlyExpenses / limit) * 100
        : 0;

    if (loading) {
        return <p>Loading monthly budget...</p>;
    }

    return (
        <div className="monthly-budget-container">

            <h2>Monthly Budget Management</h2>

            <form className="budget-form" onSubmit={handleSubmit}>

                <label>Select Month</label>

                <input
                    type="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                />

                <label>Monthly Budget Amount (₹)</label>

                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Enter your budget"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    required
                />

                <button type="submit">
                    Save Monthly Budget
                </button>

            </form>

            <p className="budget-message">{message}</p>

            <hr />

            <h2>Budget Overview</h2>

            <p>Selected Month: {month}</p>

            <div className="budget-overview">

                <div className="budget-card">
                    <h3>Monthly Budget</h3>
                    <p>₹{limit.toFixed(2)}</p>
                </div>

                <div className="budget-card">
                    <h3>Amount Spent</h3>
                    <p>₹{monthlyExpenses.toFixed(2)}</p>
                </div>

                <div className={`budget-card ${remaining < 0 ? 'budget-exceeded' : ''}`}>
                    <h3>Remaining Budget</h3>
                    <p>₹{remaining.toFixed(2)}</p>
                </div>

            </div>

            {limit > 0 && (
                <>
                    <h3>Budget Usage: {percentage.toFixed(1)}%</h3>
                    <p>
                        You have spent ₹{monthlyExpenses.toFixed(2)} out of
                        ₹{limit.toFixed(2)}.
                    </p>

                    <p>
                        {percentage.toFixed(1)}% used |
                        {(100 - percentage).toFixed(1)}% remaining
                    </p>

                    <div className="budget-progress">
                        <div
                            className={`budget-progress-fill ${
                                percentage >= 100
                                    ? 'danger'
                                    : percentage >= 80
                                    ? 'warning'
                                    : 'success'
                            }`}
                            style={{
                                width: `${Math.min(percentage, 100)}%`
                            }}
                        ></div>
                    </div>

                    {percentage >= 100 ? (
                        <p className="budget-status budget-exceeded">
                            Budget exceeded!
                        </p>
                    ) : percentage >= 80 ? (
                        <p className="budget-status budget-warning">
                            Warning: You have used at least 80% of your budget.
                        </p>
                    ) : (
                        <p className="budget-status budget-success">
                            You are within your budget.
                        </p>
                    )}
                </>
            )}

            <hr />

            <h2>Saved Monthly Budgets</h2>

            {budgets.length === 0 ? (
                <p>No monthly budgets saved yet.</p>
            ) : (
                <table className="budget-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Budget Amount</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {budgets.map((budget) => (
                            <tr key={budget.id}>
                                <td>{budget.month}</td>
                                <td>
                                    ₹{Number(budget.budget_amount).toFixed(2)}
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        className="edit-budget-btn"
                                        onClick={() => handleEdit(budget)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        className="delete-budget-btn"
                                        onClick={() => handleDelete(budget.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

        </div>
    );
}

export default MonthlyBudget;
