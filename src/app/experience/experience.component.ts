import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import experiencesData from '../data/experiences.json';
import skillsData from '../data/skills.json';

export interface JobExperience {
  title: string;
  company: string;
  type: string;
  dateRange: string;
  startDate: string;
  endDate: string | null;
  skills: SkillUsage[];
}

interface SkillUsage {
  name: string;
  startDate?: string | null;
  endDate?: string | null;
}

interface SkillEntry {
  name: string;
  category: 'language' | 'framework' | 'cloud' | 'database' | 'tool';
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  @Input() selectedSkillFilter: string | null = null;

  jobs: JobExperience[] = experiencesData as JobExperience[];
  private skillEntries: SkillEntry[] = skillsData as SkillEntry[];
  private skillCategoryMap = new Map(
    this.skillEntries.map(entry => [entry.name, entry.category])
  );
  private categoryOrder: SkillEntry['category'][] = [
    'language',
    'framework',
    'cloud',
    'database',
    'tool'
  ];

  shouldShowExperience(experienceSkills: SkillUsage[]): boolean {
    if (!this.selectedSkillFilter) {
      return true;
    }
    return experienceSkills.some(skill => skill.name === this.selectedSkillFilter);
  }

  getCategoryLabel(category: SkillEntry['category']): string {
    switch (category) {
      case 'language':
        return 'Languages';
      case 'framework':
        return 'Frameworks';
      case 'cloud':
        return 'Cloud';
      case 'database':
        return 'Databases';
      case 'tool':
      default:
        return 'Tools';
    }
  }

  getGroupedSkills(skills: SkillUsage[]): { category: SkillEntry['category']; skills: SkillUsage[] }[] {
    const grouped = new Map<SkillEntry['category'], SkillUsage[]>();

    skills.forEach(skill => {
      const category = this.skillCategoryMap.get(skill.name) || 'tool';
      const list = grouped.get(category) || [];
      list.push(skill);
      grouped.set(category, list);
    });

    return this.categoryOrder
      .map(category => ({
        category,
        skills: grouped.get(category) || []
      }))
      .filter(group => group.skills.length > 0);
  }
}
