import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Nunito_Sans } from 'next/font/google';
import '../styles/globals.css';
import IntroScreen from '@/components/IntroScreen';

const avantGarde = localFont({
  src: '../../public/fonts/avant-garde.woff2',
  variable: '--font-syne', // keeping variable name for css compatibility
  display: 'swap',
});

const nunito = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Snehal Patil | Portfolio',
  description: 'Personal portfolio of Snehal Patil, showcasing experience, skills, and projects.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${avantGarde.variable} ${nunito.variable} scroll-smooth`}
    >
      <body className="bg-black text-foreground font-nunito antialiased min-h-screen selection:bg-accent selection:text-white">
        <IntroScreen />
        {children}
      </body>
    </html>
  );
}
