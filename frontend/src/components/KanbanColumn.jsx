import { useDroppable } from "@dnd-kit/core";
import OrderCard from "./OrderCard";

export default function KanbanColumn({ id, label, color, orders }) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`min-w-[280px] rounded-xl border-2 ${color} p-3 transition ${isOver ? "ring-2 ring-indigo-400" : ""}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-700 text-sm">{label}</h3>
        <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-500">
          {orders.length}
        </span>
      </div>
      <div className="space-y-2 min-h-[100px]">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
