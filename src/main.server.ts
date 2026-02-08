import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Accept an optional BootstrapContext and forward it to bootstrapApplication.
const bootstrap = (context?: unknown) => bootstrapApplication(AppComponent, config, context as any);

export default bootstrap;
