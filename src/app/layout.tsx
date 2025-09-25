import "./globals.css";
import BottomNav from "@/components/BottomNav";


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

export const metadata = {
  title: "YouStillMatter",
  description: "Calming tools, grounding, and a crisis card—private and offline-friendly.",
  manifest: "/manifest.webmanifest",
  themeColor: "#0b1220",
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};
