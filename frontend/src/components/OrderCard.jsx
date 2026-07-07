import { useDraggable } from "@dnd-kit/core";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderCard({ order }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: order.id });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.6 : 1,
        zIndex: isDragging ? 50 : 1,
      }
    : undefined;

  const hasConflict = order.conflicts && order.conflicts.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition"
    >
      <div className="flex justify-between items-start mb-1">
        <p className="font-medium text-sm text-slate-800">
          {order.customer_name}
        </p>
        {hasConflict && (
          <AlertTriangle size={14} className="text-amber-500 flex-shrink-0" />
        )}
      </div>
      <p className="text-xs text-slate-500 mb-2">
        {order.items.length} item(s) · ₹
        {order.total_amount?.toLocaleString("en-IN")}
      </p>
      {hasConflict && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded px-2 py-1 mb-2">
          Email overrode: {order.conflicts[0].field}
        </p>
      )}
      <Link
        to={`/order/${order.id}`}
        className="text-xs text-indigo-600 hover:underline"
      >
        View details →
      </Link>
    </div>
  );
}
