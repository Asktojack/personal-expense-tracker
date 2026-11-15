
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function CategoryReport({ refreshKey }) {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                setLoading(true);

                const response = await API.get('category-summary/');

                setCategories(response.data);

            } catch (err) {
                setError('Unable to load category report.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();

    }, [refreshKey]);

    if (loading) {
        return <p>Loading category report...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Category-wise Expense Report</h2>

            {categories.length === 0 ? (
                <p>No expense records available.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total Expenses</th>
                        </tr>
                    </thead>

                    <tbody>
                        {categories.map((item, index) => (
                            <tr key={index}>
                                <td>{item.category}</td>
                                <td>
                                    ₹{Number(item.total).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default CategoryReport;
