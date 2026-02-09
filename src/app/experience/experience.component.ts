import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import experiencesData from '@data/experiences.json';
import skillsData from '@data/skills.json';
import { JobExperience, SkillUsage, SkillEntry } from '@models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent {
  @Input() selectedSkillFilter: string | null = null;
  @Output() skillClicked = new EventEmitter<string>();

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
    'concept'
  ];

  shouldShowExperience(experienceSkills: SkillUsage[]): boolean {
    if (!this.selectedSkillFilter) return true;
    return experienceSkills.some(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      return name === this.selectedSkillFilter;
    });
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
      case 'concept':
        return 'Concepts & Patterns';
      case 'utility':
      default:
        return 'Utilities';
    }
  }

  getGroupedSkills(skills: SkillUsage[]): { category: SkillEntry['category']; skills: { name: string }[] }[] {
    const grouped = new Map<SkillEntry['category'], { name: string }[]>();

    // Filter out utility category from experience display
    skills.forEach(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      const category = this.skillCategoryMap.get(name) || 'concept';
      if (category === 'utility') return; // Skip utilities
      const list = grouped.get(category) || [];
      list.push({ name });
      grouped.set(category, list);
    });

    return this.categoryOrder
      .map(category => ({
        category,
        skills: grouped.get(category) || []
      }))
      .filter(group => group.skills.length > 0);
  }

  getUtilitySkills(skills: SkillUsage[]): string[] {
    return skills
      .map(s => (typeof s === 'string' ? s : s.name))
      .filter(name => this.skillCategoryMap.get(name) === 'utility');
  }

  calculateDuration(startDate: string, endDate: string | null): string {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    months = months % 12;

    if (years === 0) {
      return months === 1 ? '1 month' : `${months} months`;
    }
    if (months === 0) {
      return years === 1 ? '1 year' : `${years} years`;
    }
    return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
  }

  onSkillClick(skillName: string) {
    this.skillClicked.emit(skillName);
  }

  getSkillDuration(skill: SkillUsage, job: JobExperience): string {
    const s = (typeof skill === 'string') ? job.startDate : (skill.startDate ? skill.startDate : job.startDate);
    const e = (typeof skill === 'string') ? job.endDate : ((skill.endDate !== undefined && skill.endDate !== null) ? skill.endDate : job.endDate);
    return this.calculateDuration(s, e);
  }
}
