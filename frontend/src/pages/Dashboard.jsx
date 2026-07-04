import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">TrueOrder Dashboard</h1>
      <p className="text-gray-500 mb-6">
        Orders processed from email & attachments
      </p>
      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="border rounded-lg p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-gray-500">
                {order.items.length} item(s) · ₹{order.total_amount}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                order.status === "exception"
                  ? "bg-red-100 text-red-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {order.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
