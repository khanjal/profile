import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.projects = projectsData;
  }
}
