import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from "@angular/core";
import { provideRouter,withPreloading, PreloadAllModules } from "@angular/router";
import { routes } from "./app.routes";
import { HttpClientInMemoryWebApiModule } from "angular-in-memory-web-api";
import { InMemoryDataService } from "./in-memory-data-service";
import { authInterceptor } from "./authentification/interceptors";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    importProvidersFrom(
      HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
        dataEncapsulation: false
      })
    )
  ]
};
