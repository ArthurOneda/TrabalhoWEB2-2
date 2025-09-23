export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`p-6 rounded-xl shadow-md border ${className}`}>
      {children}
    </div>
  );
}