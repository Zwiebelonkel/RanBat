import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// ✅ WICHTIG: context-Parameter vom Server übernehmen
export default function bootstrap(context: any) {
  return bootstrapApplication(AppComponent, appConfig, context);
}
