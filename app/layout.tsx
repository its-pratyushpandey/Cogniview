import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import FloatingChatButton from "@/components/FloatingChatButton";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cogniview - Powered by AI",
  description: "An AI-powered job interview platform with Kiki AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${monaSans.className} antialiased pattern`}
      >
        {children}
        <FloatingChatButton />
      </body>
    </html>
  );
}
