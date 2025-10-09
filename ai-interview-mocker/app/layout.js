import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";

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
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
        <ClerkProvider>
          <ThemeProvider>
            <Toaster 
              position="top-right" 
              reverseOrder={false}
              toastOptions={{
                className: 'dark:bg-gray-800 dark:text-white',
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                },
              }}
            />
            {children}
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
