import { Component, ErrorHandler } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AboutService } from './services/about.service';
import { CommonModule } from '@angular/common';
import { IdentityService } from './services/identity.service';
import { AuthGuard } from './services/auth.guard';

export class GlobalErrorHandler extends ErrorHandler {
  override handleError(error: any) {
    // Custom error handling logic
    console.log("global stuff");
    throw error;
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthGuard, {
    provide: ErrorHandler,
    useClass: GlobalErrorHandler
  }]
})
export class AppComponent {
  public apiname!: string;
  public currentUser!: any;

  title = 'WebApp';

  constructor(private aboutService: AboutService,
    private identityService: IdentityService
  ) { }

  ngOnInit(): void {

    /* this.aboutService.getApi().subscribe(
      (response) => {
        console.log(response);
        this.apiname = response.apiName;
      },
      (error) => { console.log(error); }
    );

    this.identityService.getCurrentUser().subscribe(
      (response) => {
        console.log(response);
        this.currentUser = response;
      },
      (error) => { console.log(error); }
    ); */

  }

}
