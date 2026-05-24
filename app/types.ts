export type SkillData = {
	rank: number;
	level: number;
	xp: number;
};

export type HiscoresResult = {
	username: string;
	skills: Record<string, SkillData>;
};
