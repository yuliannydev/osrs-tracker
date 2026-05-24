import { useState } from 'react';
import type { SkillData } from './types';

type Skill = { name: string; icon: string };

type Props = {
	skill: Skill;
	data: SkillData;
};

const MAX_OVERALL = 2277;
const MAX_SKILL = 99;

function isMaxed(skillName: string, level: number): boolean {
	return skillName === 'Overall' ? level >= MAX_OVERALL : level >= MAX_SKILL;
}

export function SkillCell({ skill, data }: Props) {
	const [showTooltip, setShowTooltip] = useState(false);
	const maxed = isMaxed(skill.name, data.level);

	return (
		<div
			className={'skill-cell' + (maxed ? ' maxed' : '')}
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
			style={{
				background: maxed
					? 'linear-gradient(135deg,rgba(255,153,0,0.15),rgba(255,180,0,0.08))'
					: 'rgba(0,0,0,0.2)',
				position: 'relative',
			}}
		>
			<span style={{ fontSize: '1rem' }}>{skill.icon}</span>
			<span
				style={{
					fontSize: '0.58rem',
					color: 'var(--text-muted)',
					textAlign: 'center',
					lineHeight: 1.2,
				}}
			>
				{skill.name}
			</span>
			<span
				style={{
					fontSize: '0.9rem',
					fontWeight: 'bold',
					color: maxed ? 'var(--gold-bright)' : 'var(--text-primary)',
				}}
			>
				{data.level}
			</span>

			{showTooltip && (
				<div
					style={{
						position: 'absolute',
						bottom: 'calc(100% + 6px)',
						left: '50%',
						transform: 'translateX(-50%)',
						background: 'var(--bg-dark)',
						border: '1px solid var(--border-bright)',
						borderRadius: 3,
						padding: '4px 8px',
						fontSize: '0.7rem',
						whiteSpace: 'nowrap',
						zIndex: 10,
						pointerEvents: 'none',
					}}
				>
					<div style={{ color: 'var(--gold)' }}>
						Rank:{' '}
						{data.rank > 0 ? '#' + data.rank.toLocaleString() : 'Unranked'}
					</div>
					<div style={{ color: 'var(--text-muted)' }}>
						XP: {data.xp.toLocaleString()}
					</div>
				</div>
			)}
		</div>
	);
}
