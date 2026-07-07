import KanbanBoard from "../components/KanbanBoard";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-slate-800">TrueOrder</h1>
        <p className="text-sm text-slate-500">
          Orders reconciled from email intent + attachments
        </p>
      </header>
      <KanbanBoard />
    </div>
  );
}
