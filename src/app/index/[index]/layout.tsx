export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-7xl p-5">{children}</div>
    </div>
  );
}
