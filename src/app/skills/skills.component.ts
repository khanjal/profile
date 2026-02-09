import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Skill } from '@models';

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
    'concept'
  ];

  get groupedSkills(): { category: Skill['category']; skills: Skill[] }[] {
    const grouped = new Map<Skill['category'], Skill[]>();

    // Exclude utility category from main skills display
    this.skills.filter(skill => skill.category !== 'utility').forEach(skill => {
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

  get groupedByParent(): { parent: string | null; categories: { category: Skill['category']; skills: Skill[] }[] }[] {
    // Build map: parent -> category -> skills[]
    const parentMap = new Map<string | null, Map<Skill['category'], Skill[]>>();

    this.skills.filter(s => s.category !== 'utility').forEach(skill => {
      const parent = skill.parent || null;
      const catMap = parentMap.get(parent) || new Map<Skill['category'], Skill[]>();
      const list = catMap.get(skill.category) || [];
      list.push(skill);
      catMap.set(skill.category, list);
      parentMap.set(parent, catMap);
    });

    const result: { parent: string | null; categories: { category: Skill['category']; skills: Skill[] }[] }[] = [];

    // Put parentless group first (null) then named parents sorted
    const parents = [...parentMap.keys()].sort((a, b) => {
      if (a === null) return -1;
      if (b === null) return 1;
      return (a || '').localeCompare(b || '');
    });

    parents.forEach(parent => {
      const catMap = parentMap.get(parent)!;
      const categories = this.categoryOrder
        .map(category => ({
          category,
          skills: (catMap.get(category) || []).sort((a, b) => b.years - a.years)
        }))
        .filter(g => g.skills.length > 0);

      if (categories.length > 0) {
        result.push({ parent, categories });
      }
    });

    return result;
  }

  get utilitySkills(): Skill[] {
    return this.skills
      .filter(skill => skill.category === 'utility')
      .sort((a, b) => a.name.localeCompare(b.name));
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
      case 'concept':
        return 'Concepts & Patterns';
      case 'utility':
      default:
        return 'Technologies Used';
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
