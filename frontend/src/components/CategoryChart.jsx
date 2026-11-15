import React, { useEffect, useState } from 'react';
import API from '../services/api';

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

function CategoryChart({ refreshKey }) {

    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await API.get('category-summary/');
                setData(response.data);
            } catch (error) {
                console.error('Unable to load category chart:', error);
            }
        };

        fetchData();
    }, [refreshKey]);

    const COLORS = [
        '#3157d5',
        '#16a36a',
        '#e05252',
        '#f59e0b',
        '#8b5cf6',
        '#06b6d4'
    ];

    return (
        <div>
            <h2>Expenses by Category</h2>

            {data.length === 0 ? (
                <p>No expense data available.</p>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="total"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={110}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={entry.category}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default CategoryChart;