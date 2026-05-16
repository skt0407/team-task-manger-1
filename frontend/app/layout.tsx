import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = {
  title: "TeamFlow Task Manager",
  description: "Collaborative project and task management dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <QueryProvider>
          <AuthProvider>
            {children}
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
