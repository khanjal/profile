import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import projectsData from '../data/projects.json';

interface Project {
  name: string;
  company: string;
  description: string;
  url: string;
  image: string;
  tags: string[];
  featured: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  @Input() selectedSkillFilter?: string | null;

  get displayedProjects(): Project[] {
    if (!this.selectedSkillFilter) return this.projects;
    return this.projects.filter(p => p.tags?.includes(this.selectedSkillFilter as string));
  }

  ngOnInit() {
    this.projects = projectsData;
  }
}
