import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'profile-site';
  showBackToTop = signal(false);

  // Intercept in-page anchor clicks site-wide and perform a smooth scroll
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const anchor = target.closest && target.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    const id = href.slice(1);
    if (!id) return;
    event.preventDefault();

    // Special-case top anchor -> scroll to absolute top
    if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(id);
    if (!el) return;

    // Compute header height dynamically if available
    const headerEl = document.querySelector('header') as HTMLElement | null;
    const headerOffset = headerEl ? headerEl.offsetHeight : 64;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const aboutEl = document.getElementById('about');
    const threshold = aboutEl ? (aboutEl.offsetTop + aboutEl.offsetHeight) : 200;
    this.showBackToTop.set(window.scrollY > threshold);
  }
}
