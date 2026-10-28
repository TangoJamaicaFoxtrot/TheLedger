import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'The Ledger · A life of learning', description: 'A personal study for a lifelong polymath education.', robots: { index: false, follow: false } };
export default function Layout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
