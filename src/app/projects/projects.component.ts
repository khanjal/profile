import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import projectsData from '../data/projects.json';
import { getSkillIconUrl } from '@app/shared/skill-icons';

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
  private failedIconKeys = new Set<string>();

  iconUrl(name: string): string | null { return getSkillIconUrl(name); }
  hideBrokenIcon(name: string, event: Event): void {
    this.failedIconKeys.add(name.toLowerCase());
    (event.target as HTMLImageElement).style.display = 'none';
  }

  get displayedProjects(): Project[] {
    return this.projects;
  }

  shouldShowProject(project: Project): boolean {
    if (!this.selectedSkillFilter) {
      return true;
    }
    return !!project.tags?.includes(this.selectedSkillFilter);
  }

  ngOnInit() {
    this.projects = projectsData;
  }

  projectId(name: string): string {
    return 'project-' + name.toLowerCase().replace(/\s+/g, '-');
  }
}
