import type { Metadata } from 'next';
import './globals.css';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
	title: 'OSRS Tracker',
	description:
		'Track your Old School RuneScape habits — Herb Runs, Bird Houses, Slayer Task',
};

export const viewport = {
	width: 'device-width',
	initialScale: 1,
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='es'>
			<body>
				<Nav />
				<main style={{ minHeight: 'calc(100vh - 60px)' }}>{children}</main>
			</body>
		</html>
	);
}
