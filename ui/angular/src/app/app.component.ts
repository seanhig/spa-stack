import { Component, ErrorHandler } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AboutService } from './services/about.service';
import { CommonModule } from '@angular/common';
import { IdentityService } from './services/identity.service';
import { AuthGuard } from './services/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AuthGuard]
})
export class AppComponent {
  public apiname!: string;
  public currentUser!: any;

  title = 'WebApp';

  constructor(private aboutService: AboutService,
    private identityService: IdentityService
  ) { }

  ngOnInit(): void {

  }

}
