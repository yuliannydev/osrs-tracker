import { SKILLS } from '@/lib/osrs-data';
import { SkillCell } from './SkillCell';
import type { HiscoresResult } from './types';

type Props = {
	skills: HiscoresResult['skills'];
};

export function SkillGrid({ skills }: Props) {
	return (
		<div
			className='osrs-panel'
			style={{ padding: 14 }}
		>
			<div className='section-header'>
				📊 Skills
				<span
					style={{
						marginLeft: 'auto',
						color: 'var(--text-muted)',
						fontSize: '0.7rem',
						fontWeight: 'normal',
					}}
				>
					Hover for rank · Gold = 99
				</span>
			</div>
			<div
				className='skill-grid-responsive'
				style={{ display: 'grid', gap: 3 }}
			>
				{SKILLS.map((skill) => {
					const data = skills[skill.name];
					if (!data) return null;
					return (
						<SkillCell
							key={skill.name}
							skill={skill}
							data={data}
						/>
					);
				})}
			</div>
		</div>
	);
}
