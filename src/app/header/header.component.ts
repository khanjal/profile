import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  mobileOpen = false;

  toggleMobile() {
    this.mobileOpen = !this.mobileOpen;
  }
  onMobileNavClick(event: MouseEvent) {
    // Legacy handler kept for compatibility - delegate to mobileNavigate when possible
    const elTarget = (event.currentTarget as HTMLElement);
    const href = (elTarget as HTMLAnchorElement)?.getAttribute('href') || '';
    const target = href && href.startsWith('#') ? href.substring(1) : elTarget.getAttribute('data-target') || '';
    if (target) {
      this.mobileNavigate(event, target);
    }
  }

  mobileNavigate(event: Event, id: string) {
    event.preventDefault();
    event.stopPropagation();
    // close the mobile menu
    this.mobileOpen = false;

    // allow menu to collapse before computing positions
    setTimeout(() => {
      const el = document.getElementById(id) || document.querySelector(`[name="${id}"]`);
      if (!el) {
        try { history.replaceState(null, '', `#${id}`); } catch {}
        return;
      }

      const headerEl = document.querySelector('header') as HTMLElement | null;
      const headerOffset = headerEl ? headerEl.offsetHeight : 64;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
      try { history.replaceState(null, '', `#${id}`); } catch {}
    }, 80);
  }
  // Close mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(_event: Event) {
    if (this.mobileOpen) {
      this.mobileOpen = false;
    }
  }
}
