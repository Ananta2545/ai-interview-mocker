import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Interview Mocker - Practice Your Interview Skills",
  description: "Practice and improve your interview skills with AI-powered mock interviews. Get real-time feedback and personalized evaluation.",
};

export default function RootLayout({ children }) {
  return (
    <>
      <ClerkProvider>
      <Toaster position="top-right" reverseOrder={false}/>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            {children}
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
