import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent {
  // Intercept in-page anchor clicks and perform a smooth scroll
  @HostListener('click', ['$event'])
  onClick(event: Event) {
    const target = event.target as HTMLElement;
    const anchor = target.closest && target.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    const id = href.slice(1);
    if (!id) return;

    const el = document.getElementById(id);
    if (!el) return;

    event.preventDefault();

    // Account for fixed header height (matches the spacer `h-16` in template)
    const headerOffset = 64; // px
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
