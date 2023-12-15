export function Loading({ msg }: { msg?: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-12">
      <span className="loader"></span>
      <h2 className="text-2xl font-bold mt-3">{msg || "Loading..."}</h2>
    </div>
  );
}
