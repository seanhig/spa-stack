# SpringBoot + Angular

Scaffold for a combined SpringBoot REST backend hosting an Angular `dist` export as a static resource.  

In `development` each project can be hosted independently, but then deployed as a single containerized unit for easy `AppService` style container deployment, reducing CORS configuration overhead (when a CDN isn't worth the trouble).