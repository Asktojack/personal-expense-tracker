
import React, { useState } from 'react';
import API from '../services/api';

function AddTransaction({ onTransactionAdded }) {

    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        transaction_type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
    });

    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        try {
            await API.post('transactions/', formData);

            setMessage('Transaction added successfully!');

            setFormData({
                title: '',
                amount: '',
                transaction_type: 'expense',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0]
            });

            onTransactionAdded();

        } catch (error) {
            setMessage('Unable to add transaction. Please check your details.');
        }
    };

    return (
        <div>
            <h2>Add Transaction</h2>

            <form onSubmit={handleSubmit}>

                <label>Title</label>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Amount</label>
                <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    required
                />

                <br /><br />

                <label>Transaction Type</label>
                <select
                    name="transaction_type"
                    value={formData.transaction_type}
                    onChange={handleChange}
                >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                </select>

                <br /><br />

                <label>Category</label>
                <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <label>Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <br /><br />

                <label>Date</label>
                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />

                <br /><br />

                <button type="submit">
                    Add Transaction
                </button>

            </form>

            <p>{message}</p>
        </div>
    );
}

export default AddTransaction;
