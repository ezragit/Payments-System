import { useState, useEffect } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const { data } = await axios.get("http://localhost:5000/api/payments/getTransactions");
            setTransactions(data);
        };
        fetchTransactions();
    }, []);

    return (
        <div>
            <h2>Transaction Dashboard</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Status</th>
                        <th>Payment Method</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((txn, index) => (
                        <tr key={index}>
                            <td>${txn.amount}</td>
                            <td>{txn.currency}</td>
                            <td>{txn.status}</td>
                            <td>{txn.payment_method}</td>
                            <td>{new Date(txn.createdAt).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
