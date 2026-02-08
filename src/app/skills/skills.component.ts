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

  private categoryOrder: Skill['category'][] = [
    'language',
    'framework',
    'cloud',
    'database',
    'tool'
  ];

  get groupedSkills(): { category: Skill['category']; skills: Skill[] }[] {
    const grouped = new Map<Skill['category'], Skill[]>();

    this.skills.forEach(skill => {
      const list = grouped.get(skill.category) || [];
      list.push(skill);
      grouped.set(skill.category, list);
    });

    return this.categoryOrder
      .map(category => ({
        category,
        skills: (grouped.get(category) || []).sort((a, b) => b.years - a.years)
      }))
      .filter(group => group.skills.length > 0);
  }

  getCategoryLabel(category: Skill['category']): string {
    switch (category) {
      case 'language':
        return 'Languages';
      case 'framework':
        return 'Frameworks';
      case 'cloud':
        return 'Cloud';
      case 'database':
        return 'Databases';
      case 'tool':
      default:
        return 'Tools';
    }
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
