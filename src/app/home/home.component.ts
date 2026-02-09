import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from '@app/about/about.component';
import { ExperienceComponent } from '@app/experience/experience.component';
import { Certifications } from '@app/certifications/certifications';
import { ProjectsComponent } from '@app/projects/projects.component';
import experiencesData from '@data/experiences.json';
import skillsData from '@data/skills.json';
import { ExperienceEntry, SkillUsage, SkillEntry, Skill } from '@models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AboutComponent, ExperienceComponent, Certifications, ProjectsComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedSkillFilter: string | null = null;

  private experienceEntries: ExperienceEntry[] = experiencesData as ExperienceEntry[];
  private skillEntries: SkillEntry[] = skillsData as SkillEntry[];
  private skillCategoryMap = new Map(
    this.skillEntries.map(entry => [entry.name, entry.category])
  );

  skills: Skill[] = [];

  ngOnInit(): void {
    this.calculateSkillYears();
  }

  calculateSkillYears(): void {
    const skillMap = new Map<string, { periods: { start: Date, end: Date }[], category: string }>();
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 10); // only consider skill usage in the last 10 years
    
    // Collect all periods for each skill
    this.experienceEntries.forEach(exp => {
      const jobStart = new Date(exp.startDate);
      const jobEnd = exp.endDate ? new Date(exp.endDate) : new Date();

      exp.skills.forEach(skill => {
        const skillName = (typeof skill === 'string') ? skill : skill.name;
        let skillStart = (typeof skill === 'string' || !skill.startDate) ? jobStart : new Date(skill.startDate as string);
        let skillEnd = (typeof skill === 'string' || !skill.endDate) ? jobEnd : new Date(skill.endDate as string);

        // Intersect with cutoff to only count recent usage
        if (skillEnd <= cutoff) {
          return; // entirely before cutoff, ignore
        }
        if (skillStart < cutoff) {
          skillStart = cutoff;
        }

        if (!skillMap.has(skillName)) {
          skillMap.set(skillName, { periods: [], category: this.getSkillCategory(skillName) });
        }
        skillMap.get(skillName)!.periods.push({ start: skillStart, end: skillEnd });
      });
    });

    // Calculate total years for each skill, merging overlapping periods
    const skills: Skill[] = [];
    const skillLookup = new Map<string, Skill>();

    skillMap.forEach((data, skillName) => {
      const totalYears = this.calculateTotalYears(data.periods);
      const skill: Skill = {
        name: skillName,
        years: totalYears,
        category: data.category as Skill['category']
      };
      skills.push(skill);
      skillLookup.set(skillName, skill);
    });

    this.skillEntries.forEach(entry => {
      if (!skillLookup.has(entry.name)) {
        const skill: Skill = {
          name: entry.name,
          years: 0,
          category: entry.category
        };
        skills.push(skill);
        skillLookup.set(entry.name, skill);
      }
    });

    this.skills = skills;
  }

  onSkillFilterChanged(skillName: string | null): void {
    // Toggle: deselect if the same skill is clicked again
    if (this.selectedSkillFilter === skillName) {
      this.selectedSkillFilter = null;
    } else {
      this.selectedSkillFilter = skillName;
    }
  }

  calculateTotalYears(periods: { start: Date, end: Date }[]): number {
    if (periods.length === 0) return 0;

    // Sort periods by start date
    const sorted = periods.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Merge overlapping periods
    const merged: { start: Date, end: Date }[] = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const lastMerged = merged[merged.length - 1];
      
      if (current.start <= lastMerged.end) {
        // Overlapping, merge them
        lastMerged.end = new Date(Math.max(lastMerged.end.getTime(), current.end.getTime()));
      } else {
        // No overlap, add as new period
        merged.push(current);
      }
    }

    // Calculate total years from merged periods
    let totalDays = 0;
    merged.forEach(period => {
      const days = (period.end.getTime() - period.start.getTime()) / (1000 * 60 * 60 * 24);
      totalDays += days;
    });

    return Math.round((totalDays / 365) * 10) / 10; // Round to 1 decimal place
  }

  getSkillCategory(skillName: string): string {
    return this.skillCategoryMap.get(skillName) || 'tool';
  }

}
