import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import AmbientAudio from "@/components/AmbientAudio";
import SettingsButton from "@/components/SettingsButton";
import ReduceMotionInit from "@/components/ReduceMotionInit";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Moonlight Oracle — A Nightly Ritual of Insight",
  description:
    "Draw a card under the moonlight. Moonlight Oracle is a cozy, mystical card reading experience with daily draws, yes/no guidance, and 3-card spreads.",
  keywords: ["oracle", "tarot", "card reading", "daily draw", "moonlight", "mystical"],
  openGraph: {
    title: "Moonlight Oracle",
    description: "A cozy nightly ritual of insight. Draw a card under the moonlight.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0b1026",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} antialiased`}>
        <ReduceMotionInit />
        {children}
        <SettingsButton />
        <AmbientAudio />
      </body>
    </html>
  );
}
