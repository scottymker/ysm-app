import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata = {
  title: "YouStillMatter",
  description: "Calming tools and crisis card — private and offline-friendly.",
  manifest: "/manifest.webmanifest"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
