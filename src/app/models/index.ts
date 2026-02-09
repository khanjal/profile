export type SkillCategory = 'language' | 'framework' | 'cloud' | 'database' | 'concept' | 'utility';

export interface Skill {
  name: string;
  years: number;
  category: SkillCategory;
}

export type SkillUsage = string | { name: string; startDate?: string | null; endDate?: string | null };

export interface SkillEntry {
  name: string;
  category: Skill['category'];
}

export interface JobExperience {
  title: string;
  company: string;
  type: string;
  dateRange: string;
  startDate: string;
  endDate: string | null;
  skills: SkillUsage[];
}

export interface ExperienceEntry {
  startDate: string;
  endDate: string | null;
  skills: SkillUsage[];
}
