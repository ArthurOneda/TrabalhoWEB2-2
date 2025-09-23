export function Header() {
  return (
    <header className="bg-white shadow-sm p-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">FinTrack</h2>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
          JS
        </div>
      </div>
    </header>
  );
}