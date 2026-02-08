import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Skill {
  name: string;
  years: number;
  category: 'language' | 'framework' | 'cloud' | 'database' | 'tool';
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent {
  @Input() skills: Skill[] = [];
  @Input() selectedSkillFilter: string | null = null;
  @Output() skillFilterChanged = new EventEmitter<string | null>();

  get sortedSkills(): Skill[] {
    return [...this.skills].sort((a, b) => b.years - a.years);
  }

  filterBySkill(skillName: string | null): void {
    const newFilter = this.selectedSkillFilter === skillName ? null : skillName;
    this.skillFilterChanged.emit(newFilter);
  }

  isSkillActive(skillName: string): boolean {
    return this.selectedSkillFilter === null || this.selectedSkillFilter === skillName;
  }

  isSkillSelected(skillName: string): boolean {
    return this.selectedSkillFilter === skillName;
  }
}
