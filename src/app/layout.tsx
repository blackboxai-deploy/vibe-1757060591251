import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Taguig City Evacuee Registration System',
  description: 'Comprehensive family registration and directory management for evacuation centers in Taguig City',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}