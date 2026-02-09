export type SkillCategory = 'language' | 'framework' | 'cloud' | 'database' | 'concept' | 'utility';

export interface Skill {
  name: string;
  years: number;
  category: SkillCategory;
  parent?: string;
}

export type SkillUsage = string | { name: string; startDate?: string | null; endDate?: string | null };

export interface SkillEntry {
  name: string;
  category: Skill['category'];
  parent?: string;
}

export interface JobExperience {
  title: string;
  company: string;
  type: string;
  startDate: string;
  endDate: string | null;
  skills: SkillUsage[];
}

export interface ExperienceEntry {
  startDate: string;
  endDate: string | null;
  skills: SkillUsage[];
}
