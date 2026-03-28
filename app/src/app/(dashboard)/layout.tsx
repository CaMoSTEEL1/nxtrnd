import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider>
      <div className="flex h-full">
        <Sidebar />
        <main className="flex-1 ml-60 min-h-screen overflow-y-auto">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
