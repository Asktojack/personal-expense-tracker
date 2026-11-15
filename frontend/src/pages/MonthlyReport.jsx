
import React, { useEffect, useState } from 'react';
import API from '../services/api';

function MonthlyReport({ refreshKey }) {

    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {

        const fetchMonthlyReport = async () => {
            try {
                setLoading(true);

                const response = await API.get('monthly-summary/');

                setMonthlyData(response.data);

            } catch (err) {
                setError('Unable to load monthly report.');
            } finally {
                setLoading(false);
            }
        };

        fetchMonthlyReport();

    }, [refreshKey]);

    if (loading) {
        return <p>Loading monthly report...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Monthly Expense Report</h2>

            {monthlyData.length === 0 ? (
                <p>No monthly expense records available.</p>
            ) : (
                <table border="1" cellPadding="10">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Total Expenses</th>
                        </tr>
                    </thead>

                    <tbody>
                        {monthlyData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.month}</td>
                                <td>
                                    ₹{Number(item.total_expenses).toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MonthlyReport;
