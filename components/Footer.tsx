'use client';
export default function Footer() {
	return (
		<div
			style={{
				marginTop: 32,
				borderTop: '1px solid var(--border)',
				paddingTop: 16,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				gap: 10,
			}}
		>
			{/* Ko-fi */}
			<a
				href='https://ko-fi.com/osrstracker'
				target='_blank'
				rel='noopener noreferrer'
				style={{
					display: 'inline-flex',
					alignItems: 'center',
					gap: 7,
					background: 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)',
					border: '1px solid var(--border-bright)',
					borderRadius: 20,
					padding: '6px 16px',
					fontSize: '0.8rem',
					fontWeight: 'bold',
					color: 'var(--gold)',
					textDecoration: 'none',
					transition: 'all 0.15s',
				}}
				onMouseEnter={(e) => {
					e.currentTarget.style.borderColor = 'var(--gold)';
					e.currentTarget.style.boxShadow = '0 0 8px var(--gold-glow)';
				}}
				onMouseLeave={(e) => {
					e.currentTarget.style.borderColor = 'var(--border-bright)';
					e.currentTarget.style.boxShadow = 'none';
				}}
			>
				☕ Support this project on Ko-fi
			</a>

			{/* Credits */}
			<div
				style={{
					fontSize: '0.72rem',
					color: 'var(--text-dim)',
					textAlign: 'center',
				}}
			>
				Data stored locally in your browser · No account required ·{' '}
				<span style={{ color: 'var(--gold-dim)' }}>OSRS Tracker v1.0</span>
			</div>
			<div
				style={{
					fontSize: '0.75rem',
					color: 'var(--text-muted)',
					textAlign: 'center',
					display: 'flex',
					alignItems: 'center',
					gap: 6,
					flexWrap: 'wrap',
					justifyContent: 'center',
				}}
			>
				<span>⚔️ Forged in code by</span>
				<a
					href='https://github.com/yuliannydev/'
					target='_blank'
					rel='noopener noreferrer'
					style={{
						color: 'var(--gold)',
						textDecoration: 'none',
						fontWeight: 'bold',
						borderBottom: '1px solid var(--gold-dim)',
						paddingBottom: 1,
						transition: 'color 0.15s',
					}}
					onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--gold-bright)')}
					onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--gold)')}
				>
					Yulianny B.
				</a>
				<span style={{ color: 'var(--text-dim)' }}>
					· A fellow adventurer, not just a developer 🏹
				</span>
			</div>
		</div>
	);
}