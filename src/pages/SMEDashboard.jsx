function SMEDashboard() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <header className="flex h-16 items-center justify-between border-b bg-white px-6">
        <h1 className="text-xl font-bold text-[#173563]">
          ImportEase
        </h1>

        <span className="text-sm text-slate-600">
          SME Dashboard
        </span>
      </header>

      <main className="p-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Welcome to your dashboard
        </h2>

        <p className="mt-2 text-slate-500">
          Manage your imports, shipments and clearing agents from here.
        </p>
      </main>

    </div>
  );
}

export default SMEDashboard;