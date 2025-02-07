import Navbar from "@/components/Menu/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex h-full w-full flex-auto flex-col pt-6 md:pt-6">
        <div className="flex justify-center">
          <div className="flex w-full max-w-[1500px] flex-col px-5 py-5 sm:px-10">{children}</div>
        </div>
      </div>
    </>
  );
}
