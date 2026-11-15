
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import './TransactionList.css';

function TransactionList({ refreshKey }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [reloadKey, setReloadKey] = useState(0);

    // Search and filter states
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');

    // Fetch transactions from Django API
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await API.get('transactions/');
                setTransactions(response.data);

            } catch (err) {
                console.error('Fetch Error:', err);
                setError('Unable to load transactions.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [refreshKey, reloadKey]);

    // Search and filter transactions
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            (transaction.title || '')
                .toLowerCase()
                .includes(search.toLowerCase());

        const matchesType =
            typeFilter === 'all' ||
            transaction.transaction_type === typeFilter;

        const matchesCategory =
            categoryFilter === 'all' ||
            transaction.category === categoryFilter;

        const matchesDate =
            dateFilter === '' ||
            String(transaction.date).slice(0, 10) === dateFilter;

        return (
            matchesSearch &&
            matchesType &&
            matchesCategory &&
            matchesDate
        );
    });

    // Get unique categories
    const categories = [
        ...new Set(
            transactions.map((transaction) => transaction.category)
        )
    ];

    // Export filtered transactions to CSV
    const handleExport = () => {
        if (filteredTransactions.length === 0) {
            alert('No transactions available to export.');
            return;
        }

        const headers = [
            'Title',
            'Amount',
            'Type',
            'Category',
            'Date',
            'Description'
        ];

        const rows = filteredTransactions.map((transaction) => [
            transaction.title,
            transaction.amount,
            transaction.transaction_type,
            transaction.category,
            transaction.date,
            transaction.description || ''
        ]);

        const csvContent = [
            headers,
            ...rows
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value ?? '').replace(/"/g, '""')}"`
                    )
                    .join(',')
            )
            .join('\r\n');

        const blob = new Blob(
            ['\uFEFF' + csvContent],
            { type: 'text/csv;charset=utf-8;' }
        );

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = 'expense-transactions.csv';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // Edit transaction
    const handleEdit = (transaction) => {
        setEditingId(transaction.id);

        setEditData({
            title: transaction.title,
            amount: transaction.amount
        });
    };

    // Save updated transaction
    const handleSave = async (id) => {
        try {
            await API.patch(`transactions/${id}/`, editData);

            setEditingId(null);
            setReloadKey((prev) => prev + 1);

            alert('Transaction updated successfully!');

        } catch (err) {
            console.error('Update Error:', err);
            alert('Unable to update transaction.');
        }
    };

    // Delete transaction
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }

        try {
            await API.delete(`transactions/${id}/`);

            setReloadKey((prev) => prev + 1);

            alert('Transaction deleted successfully!');

        } catch (err) {
            console.error('Delete Error:', err);
            alert('Unable to delete transaction.');
        }
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearch('');
        setTypeFilter('all');
        setCategoryFilter('all');
        setDateFilter('');
    };

    if (loading) {
        return <p>Loading transactions...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="transaction-list-container">
            <h2>Transaction History</h2>

            {/* Export Button */}
            <button onClick={handleExport}>
                Export to CSV
            </button>

            <hr />

            {/* Search */}
            <h3>Search and Filter Transactions</h3>

            <label>Search by Title</label>
            <br />

            <input
                type="text"
                placeholder="Search transaction..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <br /><br />

            {/* Transaction Type Filter */}
            <label>Transaction Type</label>
            <br />

            <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
            >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
            </select>

            <br /><br />

            {/* Category Filter */}
            <label>Category</label>
            <br />

            <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
            >
                <option value="all">All Categories</option>

                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>

            <br /><br />

            {/* Date Filter */}
            <label>Transaction Date</label>
            <br />

            <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
            />

            <br /><br />

            <button onClick={handleClearFilters}>
                Clear Filters
            </button>

            <p>
                Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>

            <hr />

            {/* Transactions Table */}
            {filteredTransactions.length === 0 ? (
                <p>No matching transactions found.</p>
            ) : (
                <table className="transaction-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                                {/* Title */}
                                <td>
                                    {editingId === transaction.id ? (
                                        <input
                                            type="text"
                                            value={editData.title}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    title: e.target.value
                                                })
                                            }
                                        />
                                    ) : (
                                        transaction.title
                                    )}
                                </td>

                                {/* Amount */}
                                <td>
                                    {editingId === transaction.id ? (
                                        <input
                                            type="number"
                                            min="0.01"
                                            step="0.01"
                                            value={editData.amount}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    amount: e.target.value
                                                })
                                            }
                                        />
                                    ) : (
                                        `₹${Number(transaction.amount).toFixed(2)}`
                                    )}
                                </td>

                                <td>{transaction.transaction_type}</td>
                                <td>{transaction.category}</td>
                                <td>{transaction.date}</td>

                                {/* Actions */}
                                <td>
                                    {editingId === transaction.id ? (
                                        <>
                                            <button
                                                onClick={() => handleSave(transaction.id)}
                                            >
                                                Save
                                            </button>

                                            <button
                                                onClick={() => setEditingId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(transaction)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default TransactionList;
