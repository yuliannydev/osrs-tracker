import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

const SITE_URL = 'https://osrs-track.netlify.app';

export const metadata: Metadata = {
	// ── Core ──
	title: {
		default: 'OSRS Tracker',
		template: '%s | OSRS Tracker',
	},
	description:
		'Free community tool to track your Old School RuneScape daily habits — Herb Runs, Bird Houses, and Slayer Tasks. View streaks, yields, XP, and activity logs. No account required.',
	keywords: [
		'OSRS',
		'Old School RuneScape',
		'OSRS tracker',
		'herb run tracker',
		'bird house tracker',
		'slayer tracker',
		'OSRS hiscores',
		'RuneScape habits',
		'OSRS community',
		'free OSRS tool',
	],
	authors: [{ name: 'Yulianny B.', url: 'https://github.com/yuliannydev' }],
	creator: 'Yulianny B.',

	// ── Canonical & indexing ──
	metadataBase: new URL(SITE_URL),
	alternates: { canonical: '/' },
	robots: {
		index: true,
		follow: true,
		googleBot: { index: true, follow: true },
	},

	// ── Open Graph ──
	openGraph: {
		type: 'website',
		url: SITE_URL,
		siteName: 'OSRS Tracker',
		title: 'OSRS Tracker — Free Daily Habit Tracker for the OSRS Community',
		description:
			'Free community tool to track Herb Runs, Bird Houses, and Slayer Tasks. Streaks, yields, XP, and activity logs — no account required.',
		locale: 'en_US',
	},

	// ── Twitter / X ──
	twitter: {
		card: 'summary',
		title: 'OSRS Tracker — Free Daily Habit Tracker for the OSRS Community',
		description:
			'Free community tool to track Herb Runs, Bird Houses, and Slayer Tasks. Streaks, yields, XP — no account required.',
	},
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#1a1208', // matches --bg-dark
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<Nav />
				<main style={{ minHeight: 'calc(100vh - 60px)' }}>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
