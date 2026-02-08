import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface JobExperience {
  title: string;
  company: string;
  type: string;
  dateRange: string;
  skills: string[];
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

  jobs: JobExperience[] = [
    {
      title: 'Software Engineer',
      company: 'Rocket Mortgage',
      type: 'Full-time',
      dateRange: 'Jan 2024 - Present',
      skills: ['C#', 'Angular', 'AWS']
    },
    {
      title: 'Software Engineer / Owner',
      company: 'Iron Raptor Digital',
      type: 'Freelance',
      dateRange: 'Apr 2013 - Present',
      skills: ['C#', 'TypeScript', 'Angular', 'AWS', 'Lambda', 'Alexa Skills', 'Git']
    },
    {
      title: 'Software Engineer II',
      company: "DICK'S Sporting Goods",
      type: 'Full-time',
      dateRange: 'Dec 2018 - Aug 2023',
      skills: ['C#', 'Angular', 'Microservices', 'REST APIs', 'SQL', 'Azure', 'GitHub Actions']
    },
    {
      title: 'Software Engineer',
      company: 'AutoSoft Inc',
      type: 'Full-time',
      dateRange: 'Oct 2013 - Nov 2018',
      skills: ['C#', 'Angular', 'JavaScript', 'REST APIs', 'SQL', 'TeamCity', 'Octopus Deploy']
    },
    {
      title: 'Web Application Engineer',
      company: 'ZOLL Medical Corporation',
      type: 'Full-time',
      dateRange: 'Sep 2012 - Oct 2013',
      skills: ['ASP.NET MVC', 'JavaScript', 'SQL', 'SCRUM']
    },
    {
      title: 'Computer Programmer',
      company: 'Perkins Communications',
      type: 'Full-time',
      dateRange: 'Oct 2010 - Aug 2012',
      skills: ['C#', 'JavaScript', 'jQuery', 'AJAX', 'MySQL']
    },
    {
      title: 'Developer',
      company: 'Westpoint Underwriters',
      type: 'Full-time',
      dateRange: 'Nov 2008 - Sep 2010',
      skills: ['VB.NET', 'JavaScript', 'SQL', 'XML', 'BizTalk']
    },
    {
      title: 'Interactive Developer',
      company: 'Mindgrab Media',
      type: 'Freelance',
      dateRange: 'Jul 2008 - Oct 2008',
      skills: ['JavaScript', 'C#', 'SQL']
    },
    {
      title: 'Web Application Developer',
      company: 'PGT Trucking',
      type: 'Full-time',
      dateRange: 'May 2007 - Jun 2008',
      skills: ['ASP.NET', 'PHP', 'C#', 'SQL', 'SSRS']
    },
    {
      title: 'Web Application Programmer',
      company: 'Perkins Communications',
      type: 'Full-time',
      dateRange: 'Apr 2005 - May 2007',
      skills: ['ASP.NET', 'VB.NET', 'Perl', 'JavaScript', 'C#', 'SQL', 'VB']
    },
    {
      title: 'Web Application Programmer',
      company: 'Bird Dog',
      type: 'Full-time',
      dateRange: 'Apr 2004 - Apr 2005',
      skills: ['PHP', 'PostgreSQL', 'MySQL', 'SQL']
    },
    {
      title: 'Web Application Programmer',
      company: 'Innovative Ideas Int.',
      type: 'Full-time',
      dateRange: 'Jun 2001 - Apr 2004',
      skills: ['ASP', 'PHP']
    }
  ];

  shouldShowExperience(experienceSkills: string[]): boolean {
    if (!this.selectedSkillFilter) {
      return true;
    }
    return experienceSkills.includes(this.selectedSkillFilter);
  }
}
