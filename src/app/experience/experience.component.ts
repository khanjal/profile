import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import experiencesData from '@data/experiences.json';
import skillsData from '@data/skills.json';
import { JobExperience, SkillUsage, SkillEntry } from '@models';
import { getSkillIconUrl, getSkillInitials } from '@app/shared/skill-icons';

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
  private failedIconKeys = new Set<string>();

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
    'concept',
    'utility'
  ];

  get featuredTechnologies(): string[] {
    const now = Date.now();
    const metrics = new Map<string, { name: string; lastUsed: number; usageCount: number; firstSeen: number }>();

    this.jobs.forEach((job, jobIndex) => {
      const recency = this.getJobRecencyTimestamp(job, now);

      job.skills.forEach((skill, skillIndex) => {
        const name = typeof skill === 'string' ? skill : skill.name;
        const key = name.toLowerCase();

        const existing = metrics.get(key);
        if (existing) {
          existing.lastUsed = Math.max(existing.lastUsed, recency);
          existing.usageCount += 1;
          return;
        }

        metrics.set(key, {
          name,
          lastUsed: recency,
          usageCount: 1,
          firstSeen: (jobIndex * 1000) + skillIndex
        });
      });
    });

    return [...metrics.values()]
      .sort((a, b) =>
        (b.lastUsed - a.lastUsed) ||
        (b.usageCount - a.usageCount) ||
        (a.firstSeen - b.firstSeen) ||
        a.name.localeCompare(b.name)
      )
      .map(skill => skill.name);
  }

  private getJobRecencyTimestamp(job: JobExperience, now: number): number {
    if (job.endDate === null) {
      return now;
    }

    const end = new Date(job.endDate);
    if (!isNaN(end.getTime())) {
      return end.getTime();
    }

    const start = new Date(job.startDate);
    return isNaN(start.getTime()) ? 0 : start.getTime();
  }

  get featuredTechnologyGroups(): { category: SkillEntry['category']; label: string; technologies: string[] }[] {
    const grouped = new Map<SkillEntry['category'], string[]>();

    this.featuredTechnologies.forEach(tech => {
      const category = this.skillCategoryMap.get(tech) || 'concept';
      const list = grouped.get(category) || [];
      list.push(tech);
      grouped.set(category, list);
    });

    return this.categoryOrder
      .map(category => ({
        category,
        label: this.getSnapshotCategoryLabel(category),
        technologies: grouped.get(category) || []
      }))
      .filter(group => group.technologies.length > 0);
  }

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

  getSnapshotCategoryLabel(category: SkillEntry['category']): string {
    switch (category) {
      case 'language':
        return 'Languages';
      case 'framework':
        return 'Frontend & Frameworks';
      case 'cloud':
        return 'Cloud';
      case 'database':
        return 'Data';
      case 'concept':
        return 'Concepts';
      case 'utility':
      default:
        return 'Tools';
    }
  }

  getCompaniesForTechnology(skillName: string): string[] {
    const key = skillName.toLowerCase();
    const companies = this.jobs
      .filter(job => job.skills.some(skill => {
        const name = typeof skill === 'string' ? skill : skill.name;
        return name.toLowerCase() === key;
      }))
      .map(job => job.company);

    return [...new Set(companies)];
  }

  getCompaniesPreviewForTechnology(skillName: string): string[] {
    return this.getCompaniesForTechnology(skillName).slice(0, 6);
  }

  getAdditionalCompaniesCount(skillName: string): number {
    const total = this.getCompaniesForTechnology(skillName).length;
    return total > 6 ? total - 6 : 0;
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

  formatDateRange(job: JobExperience): string {
    const start = new Date(job.startDate);
    if (isNaN(start.getTime())) return '';
    const end = job.endDate ? new Date(job.endDate) : null;
    const fmt = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short' });
    const startLabel = fmt.format(start);
    const endLabel = end && !isNaN(end.getTime()) ? fmt.format(end) : 'Present';
    return `${startLabel} - ${endLabel}`;
  }

  onSkillClick(skillName: string) {
    this.skillClicked.emit(skillName);
  }

  getSkillDuration(skill: SkillUsage, job: JobExperience): string {
    const s = (typeof skill === 'string') ? job.startDate : (skill.startDate ? skill.startDate : job.startDate);
    const e = (typeof skill === 'string') ? job.endDate : ((skill.endDate !== undefined && skill.endDate !== null) ? skill.endDate : job.endDate);
    return this.calculateDuration(s, e);
  }

  iconUrl(skillName: string): string | null {
    return getSkillIconUrl(skillName);
  }

  shouldRenderIcon(skillName: string): boolean {
    const key = skillName.toLowerCase();
    return this.iconUrl(skillName) !== null && !this.failedIconKeys.has(key);
  }

  iconFallback(skillName: string): string {
    return getSkillInitials(skillName);
  }

  shouldShowIconFallback(skillName: string): boolean {
    return !this.shouldRenderIcon(skillName);
  }

  hideBrokenIcon(skillName: string, event: Event): void {
    this.failedIconKeys.add(skillName.toLowerCase());
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
