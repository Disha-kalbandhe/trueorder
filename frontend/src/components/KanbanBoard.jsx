import { useState, useEffect } from "react";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { getOrders, updateOrderStatus } from "../api/client";
import KanbanColumn from "./KanbanColumn";

const STATUS_COLUMNS = [
  {
    key: "received",
    label: "Received",
    color: "bg-slate-100 border-slate-300",
  },
  {
    key: "exception",
    label: "Needs Review",
    color: "bg-amber-50 border-amber-300",
  },
  { key: "validated", label: "Validated", color: "bg-blue-50 border-blue-300" },
  {
    key: "confirmed",
    label: "Confirmed",
    color: "bg-emerald-50 border-emerald-300",
  },
  { key: "billed", label: "Billed", color: "bg-violet-50 border-violet-300" },
];

export default function KanbanBoard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((data) => {
        console.log("Orders fetched:", data);
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        alert(`API fetch failed: ${err.message}`);
        setLoading(false);
      });
  }, []);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;
    const orderId = active.id;
    const newStatus = over.id;
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === newStatus) return;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error("Status update failed, reverting:", err);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: order.status } : o,
        ),
      );
    }
  };

  if (loading)
    return <div className="p-8 text-slate-400">Loading orders...</div>;

  return (
    <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto p-6">
        {STATUS_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.key}
            id={col.key}
            label={col.label}
            color={col.color}
            orders={orders.filter((o) => o.status === col.key)}
          />
        ))}
      </div>
    </DndContext>
  );
}
