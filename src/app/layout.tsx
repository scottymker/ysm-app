import RegisterSW from "@/components/RegisterSW";
import SplashStyles from "@/components/SplashStyles";
import "./globals.css";
import BottomNav from "@/components/BottomNav";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <BottomNav />
              <SplashStyles />
      </body>
    </html>
  );
}


export const metadata = {
  applicationName: "YouStillMatter",
  title: "YouStillMatter",
  description: "Calming tools, grounding, and a crisis card—private and offline-friendly.",
  manifest: "/manifest.webmanifest",

  // Adaptive status bar + theme colors
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },  // surface light
    { media: "(prefers-color-scheme: dark)",  color: "#0b1220" }   // brand dark
  ],

  // iOS PWA presentation
  appleWebApp: {
    capable: true,
    title: "YouStillMatter",
    statusBarStyle: "black-translucent" // or "default" / "black"
  },

  // Icons (Next will also pick up app/icon.png and app/apple-icon.png automatically)
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png"
  }
};
