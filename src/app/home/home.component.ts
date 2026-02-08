import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { SkillsComponent, Skill } from '../skills/skills.component';
import { ExperienceComponent } from '../experience/experience.component';
import { ProjectsComponent } from '../projects/projects.component';

interface Experience {
  startDate: Date;
  endDate: Date | null; // null means present
  skills: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeroComponent, AboutComponent, SkillsComponent, ExperienceComponent, ProjectsComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  selectedSkillFilter: string | null = null;

  experiences: Experience[] = [
    { startDate: new Date('2024-01-01'), endDate: null, skills: ['C#', 'Angular', 'AWS'] },
    { startDate: new Date('2013-04-01'), endDate: null, skills: ['C#', 'TypeScript', 'Angular', 'AWS', 'Lambda', 'Alexa Skills', 'Git'] },
    { startDate: new Date('2018-12-01'), endDate: new Date('2023-08-31'), skills: ['C#', 'Angular', 'Microservices', 'REST APIs', 'SQL', 'Azure', 'GitHub Actions'] },
    { startDate: new Date('2013-10-01'), endDate: new Date('2018-11-30'), skills: ['C#', 'Angular', 'JavaScript', 'REST APIs', 'SQL', 'TeamCity', 'Octopus Deploy'] },
    { startDate: new Date('2012-09-01'), endDate: new Date('2013-10-31'), skills: ['ASP.NET MVC', 'JavaScript', 'SQL', 'SCRUM'] },
    { startDate: new Date('2010-10-01'), endDate: new Date('2012-08-31'), skills: ['C#', 'JavaScript', 'jQuery', 'AJAX', 'MySQL'] },
    { startDate: new Date('2008-11-01'), endDate: new Date('2010-09-30'), skills: ['VB.NET', 'JavaScript', 'SQL', 'XML', 'BizTalk'] },
    { startDate: new Date('2008-07-01'), endDate: new Date('2008-10-31'), skills: ['JavaScript', 'C#', 'SQL'] },
    { startDate: new Date('2007-05-01'), endDate: new Date('2008-06-30'), skills: ['ASP.NET', 'PHP', 'SQL', 'C#', 'SSRS'] },
    { startDate: new Date('2005-04-01'), endDate: new Date('2007-05-31'), skills: ['ASP.NET', 'VB.NET', 'Perl', 'JavaScript', 'C#', 'SQL', 'VB'] },
    { startDate: new Date('2004-04-01'), endDate: new Date('2005-04-30'), skills: ['PHP', 'PostgreSQL', 'MySQL', 'SQL'] },
    { startDate: new Date('2001-06-01'), endDate: new Date('2004-04-30'), skills: ['ASP', 'PHP'] },
  ];

  skills: Skill[] = [];

  ngOnInit(): void {
    this.calculateSkillYears();
  }

  calculateSkillYears(): void {
    const skillMap = new Map<string, { periods: { start: Date, end: Date }[], category: string }>();
    
    // Collect all periods for each skill
    this.experiences.forEach(exp => {
      const endDate = exp.endDate || new Date();
      exp.skills.forEach(skill => {
        if (!skillMap.has(skill)) {
          skillMap.set(skill, { periods: [], category: this.getSkillCategory(skill) });
        }
        skillMap.get(skill)!.periods.push({ start: exp.startDate, end: endDate });
      });
    });

    // Calculate total years for each skill, merging overlapping periods
    const skills: Skill[] = [];
    skillMap.forEach((data, skillName) => {
      const totalYears = this.calculateTotalYears(data.periods);
      skills.push({
        name: skillName,
        years: totalYears,
        category: data.category as any
      });
    });

    this.skills = skills;
  }

  onSkillFilterChanged(skillName: string | null): void {
    this.selectedSkillFilter = skillName;
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
    const categories: { [key: string]: string } = {
      'C#': 'language',
      'JavaScript': 'language',
      'TypeScript': 'language',
      'VB.NET': 'language',
      'VB': 'language',
      'PHP': 'language',
      'Perl': 'language',
      'ASP': 'language',
      'SQL': 'database',
      'MySQL': 'database',
      'PostgreSQL': 'database',
      'Angular': 'framework',
      'jQuery': 'framework',
      'ASP.NET MVC': 'framework',
      'ASP.NET': 'framework',
      'AWS': 'cloud',
      'Azure': 'cloud',
      'Lambda': 'cloud',
      'REST APIs': 'tool',
      'Microservices': 'tool',
      'Git': 'tool',
      'TeamCity': 'tool',
      'Octopus Deploy': 'tool',
      'SCRUM': 'tool',
      'GitHub Actions': 'tool',
      'Alexa Skills': 'tool',
      'AJAX': 'tool',
      'XML': 'tool',
      'BizTalk': 'tool',
      'SSRS': 'tool',
    };
    return categories[skillName] || 'tool';
  }

  get sortedSkills(): Skill[] {
    return [...this.skills].sort((a, b) => b.years - a.years);
  }

  filterBySkill(skillName: string | null): void {
    this.selectedSkillFilter = this.selectedSkillFilter === skillName ? null : skillName;
  }

  isSkillActive(skillName: string): boolean {
    return this.selectedSkillFilter === null || this.selectedSkillFilter === skillName;
  }

  isSkillSelected(skillName: string): boolean {
    return this.selectedSkillFilter === skillName;
  }

  shouldShowExperience(experienceSkills: string[]): boolean {
    if (!this.selectedSkillFilter) {
      return true;
    }
    return experienceSkills.includes(this.selectedSkillFilter);
  }
}
