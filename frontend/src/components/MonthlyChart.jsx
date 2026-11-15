import React, { useEffect, useState } from 'react';
import API from '../services/api';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

function MonthlyChart({ refreshKey }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get('monthly-summary/');
                setData(response.data);
            } catch (error) {
                console.error('Unable to load monthly chart:', error);
            }
        };

        fetchData();
    }, [refreshKey]);

    return (
        <div>
            <h2>Monthly Expenses</h2>

            {data.length === 0 ? (
                <p>No monthly expense data available.</p>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="month" />

                        <YAxis />

                        <Tooltip
                            formatter={(value) => `₹${value}`}
                        />

                        <Legend />

                        <Bar
                            dataKey="total_expenses"
                            name="Expenses"
                            fill="#3157d5"
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default MonthlyChart;