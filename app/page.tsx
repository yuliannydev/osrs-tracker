'use client';
import { useRef, useState } from 'react';
import { useHiscores } from './useHistory';
import { PlayerHeader } from './PlayerHeader';
import { SkillGrid } from './SkillGrid';

export default function HomePage() {
	const [username, setUsername] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);
	const { result, loading, error, lookup } = useHiscores();

	const handleSearch = () => lookup(username);
	const handleKey = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') handleSearch();
	};

	return (
		<div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
			<header style={{ textAlign: 'center', marginBottom: 24 }}>
				<h1
					style={{
						fontSize: '1.6rem',
						fontWeight: 'bold',
						color: 'var(--gold)',
						textShadow: '0 0 20px var(--gold-glow)',
						letterSpacing: '0.06em',
						marginBottom: 6,
					}}
				>
					⚔️ OSRS Hiscores
				</h1>
				<p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
					Look up any player's stats on the official OSRS Hiscores
				</p>
			</header>

			{/* Search */}
			<div
				className='osrs-panel'
				style={{ padding: '16px 20px', marginBottom: 20 }}
			>
				<div className='section-header'>🔍 Player Lookup</div>
				<div
					className='search-row'
					style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}
				>
					<input
						ref={inputRef}
						className='osrs-input'
						style={{ flex: 1, fontSize: '0.95rem', minWidth: 0 }}
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						onKeyDown={handleKey}
						placeholder='Enter username...'
						maxLength={12}
					/>
					<button
						className='osrs-btn-gold'
						style={{
							padding: '8px 20px',
							fontSize: '0.9rem',
							fontWeight: 'bold',
							whiteSpace: 'nowrap',
							flexShrink: 0,
						}}
						onClick={handleSearch}
						disabled={loading}
					>
						{loading ? '...' : 'Search'}
					</button>
				</div>
			</div>

			{/* Loading */}
			{loading && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						padding: '40px 0',
						gap: 8,
					}}
				>
					<div className='loading-dot' />
					<div className='loading-dot' />
					<div className='loading-dot' />
				</div>
			)}

			{/* Error */}
			{error && (
				<div
					style={{
						background: 'rgba(180,40,40,0.2)',
						border: '1px solid rgba(200,60,60,0.4)',
						borderRadius: 4,
						padding: '12px 16px',
						color: '#ff8888',
						textAlign: 'center',
						fontSize: '0.85rem',
					}}
				>
					⚠ {error}
				</div>
			)}

			{/* Results */}
			{result && (
				<>
					<PlayerHeader result={result} />
					<SkillGrid skills={result.skills} />
				</>
			)}

			{/* Empty state */}
			{!result && !loading && !error && (
				<div className='empty-state'>
					<span style={{ fontSize: '3.5rem' }}>🗡️</span>
					<div style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
						Enter a player name to view their stats
					</div>
					<div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
						Data pulled live from the official OSRS Hiscores
					</div>
				</div>
			)}
		</div>
	);
}
