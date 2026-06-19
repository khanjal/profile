import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import experiencesData from '@data/experiences.json';
import skillsData from '@data/skills.json';
import projectsData from '../data/projects.json';
import { JobExperience, SkillUsage, SkillEntry } from '@models';
import { getSkillIconUrl } from '@app/shared/skill-icons';

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
  @Input() strongSkillUsageThreshold = 3;
  @Input() strongSkillMaxAgeYears = 7;
  activePopoverTech: string | null = null;
  popoverStyle: { left: string; top: string } = { left: '0px', top: '0px' };

  jobs: JobExperience[] = experiencesData as JobExperience[];
  private projects = projectsData;
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

  private get featuredTechnologyMetrics(): Map<string, { name: string; lastUsed: number; usageCount: number; firstSeen: number }> {
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

    this.projects.forEach(project => {
      project.tags.forEach(tag => {
        const key = tag.toLowerCase();
        const existing = metrics.get(key);
        if (existing) {
          existing.usageCount += 1;
        } else {
          metrics.set(key, { name: tag, lastUsed: now, usageCount: 1, firstSeen: 999999 });
        }
      });
    });

    return metrics;
  }

  get featuredTechnologies(): string[] {
    return [...this.featuredTechnologyMetrics.values()]
      .sort((a, b) =>
        (b.lastUsed - a.lastUsed) ||
        (b.usageCount - a.usageCount) ||
        (a.firstSeen - b.firstSeen) ||
        a.name.localeCompare(b.name)
      )
      .map(skill => skill.name);
  }

  isStrongTechnology(skillName: string): boolean {
    const entry = this.skillEntries.find(e => e.name === skillName);
    if (entry?.strong) return true;
    const metrics = this.featuredTechnologyMetrics.get(skillName.toLowerCase());
    if (!metrics) return false;
    const now = Date.now();
    const ageMs = now - metrics.lastUsed;
    const maxAgeMs = this.strongSkillMaxAgeYears * 365 * 24 * 60 * 60 * 1000;
    return metrics.usageCount >= this.strongSkillUsageThreshold && ageMs <= maxAgeMs;
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

  shouldShowExperience(job: JobExperience): boolean {
    if (!this.selectedSkillFilter) return true;
    const inSkills = job.skills.some(skill => {
      const name = typeof skill === 'string' ? skill : skill.name;
      return name === this.selectedSkillFilter;
    });
    if (inSkills) return true;
    return this.projects
      .filter(p => p.company === job.company)
      .some(p => p.tags.includes(this.selectedSkillFilter!));
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
    const fromJobs = this.jobs
      .filter(job => {
        const inSkills = job.skills.some(skill => {
          const name = typeof skill === 'string' ? skill : skill.name;
          return name.toLowerCase() === key;
        });
        const inProjects = this.projects
          .filter(p => p.company === job.company)
          .some(p => p.tags.some(t => t.toLowerCase() === key));
        return inSkills || inProjects;
      })
      .map(job => job.company);

    return [...new Set(fromJobs)];
  }

  getCompaniesPreviewForTechnology(skillName: string): string[] {
    return this.getCompaniesForTechnology(skillName).slice(0, 6);
  }

  getAdditionalCompaniesCount(skillName: string): number {
    return Math.max(0, this.getCompaniesForTechnology(skillName).length - 6);
  }

  getProjectsForCompany(company: string): { name: string; id: string }[] {
    return this.projects
      .filter(p => p.company === company)
      .map(p => ({ name: p.name, id: 'project-' + p.name.toLowerCase().replace(/\s+/g, '-') }));
  }

  scrollToProject(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

  @HostListener('document:click')
  onDocumentClick(): void {
    if (!window.matchMedia('(hover: hover)').matches) {
      this.activePopoverTech = null;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.activePopoverTech = null;
  }

  onChipClick(skillName: string, event: MouseEvent): void {
    if (!window.matchMedia('(hover: hover)').matches) {
      event.stopPropagation();
      if (this.activePopoverTech === skillName) {
        this.activePopoverTech = null;
        return;
      }
      const chip = event.currentTarget as HTMLElement;
      const rect = chip.getBoundingClientRect();
      const margin = 8;
      const popoverWidth = Math.min(312, window.innerWidth - margin * 2);
      let left = rect.left + rect.width / 2 - popoverWidth / 2;
      left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));
      this.popoverStyle = { left: `${left}px`, top: `${rect.bottom + 8}px` };
      this.activePopoverTech = skillName;
    }
    this.skillClicked.emit(skillName);
  }

  showPopover(event: MouseEvent, tech: string): void {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const chip = event.currentTarget as HTMLElement;
    const rect = chip.getBoundingClientRect();
    const margin = 8;
    const popoverWidth = Math.min(312, window.innerWidth - margin * 2);
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - popoverWidth - margin));
    this.popoverStyle = { left: `${left}px`, top: `${rect.bottom + 8}px` };
    this.activePopoverTech = tech;
  }

  hidePopover(): void {
    if (!window.matchMedia('(hover: hover)').matches) return;
    this.activePopoverTech = null;
  }

  iconUrl(skillName: string): string | null {
    return getSkillIconUrl(skillName);
  }

  hideBrokenIcon(skillName: string, event: Event): void {
    this.failedIconKeys.add(skillName.toLowerCase());
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
