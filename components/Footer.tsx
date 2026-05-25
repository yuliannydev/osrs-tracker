'use client';

const STORAGE_KEYS = ['osrs-herb-runs', 'osrs-bird-houses', 'osrs-slayer'];

function handleExport() {
	const data: Record<string, unknown> = {};
	for (const key of STORAGE_KEYS) {
		const val = localStorage.getItem(key);
		if (val) data[key] = JSON.parse(val);
	}
	const blob = new Blob([JSON.stringify(data, null, 2)], {
		type: 'application/json',
	});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `osrs-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
	a.click();
	URL.revokeObjectURL(url);
}

function handleImport() {
	const input = document.createElement('input');
	input.type = 'file';
	input.accept = '.json';
	input.onchange = (e) => {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (ev) => {
			try {
				const data = JSON.parse(ev.target?.result as string);
				for (const key of STORAGE_KEYS) {
					if (data[key]) localStorage.setItem(key, JSON.stringify(data[key]));
				}
				window.location.reload();
			} catch {
				alert('Invalid backup file.');
			}
		};
		reader.readAsText(file);
	};
	input.click();
}

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
			{/* Actions row — Ko-fi + Export + Import */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 8,
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

				{/* Export */}
				<button
					onClick={handleExport}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 6,
						background: 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)',
						border: '1px solid var(--border-bright)',
						borderRadius: 20,
						padding: '6px 16px',
						fontSize: '0.8rem',
						fontWeight: 'bold',
						color: 'var(--text-muted)',
						cursor: 'pointer',
						transition: 'all 0.15s',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = 'var(--gold)';
						e.currentTarget.style.color = 'var(--gold)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = 'var(--border-bright)';
						e.currentTarget.style.color = 'var(--text-muted)';
					}}
				>
					📤 Export data
				</button>

				{/* Import */}
				<button
					onClick={handleImport}
					style={{
						display: 'inline-flex',
						alignItems: 'center',
						gap: 6,
						background: 'linear-gradient(180deg, #3a2a1a 0%, #2a1a0a 100%)',
						border: '1px solid var(--border-bright)',
						borderRadius: 20,
						padding: '6px 16px',
						fontSize: '0.8rem',
						fontWeight: 'bold',
						color: 'var(--text-muted)',
						cursor: 'pointer',
						transition: 'all 0.15s',
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.borderColor = 'var(--gold)';
						e.currentTarget.style.color = 'var(--gold)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.borderColor = 'var(--border-bright)';
						e.currentTarget.style.color = 'var(--text-muted)';
					}}
				>
					📥 Import data
				</button>
			</div>

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
					onMouseEnter={(e) =>
						(e.currentTarget.style.color = 'var(--gold-bright)')
					}
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
