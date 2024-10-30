import { Component, Input, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { AboutService } from '../../../services/about.service';
import { AboutDialog } from '../../../view/shared/about-dialog/about-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, AboutDialog],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() showSignin = true;
  
  @ViewChild(AboutDialog) aboutDialog:AboutDialog | undefined;

  constructor(public _authService: AuthService, 
    public _aboutService: AboutService,
    private _router: Router) {
    
  }

  public showAbout(event: any) {
    event.preventDefault();

    this._aboutService.getApi().subscribe((apiDetail : any) => {
      this.aboutDialog?.open(apiDetail);
    });
  }

  public signOut(event: any) {
    event.preventDefault();

    console.log("We are doing the signout");
    this._authService.signout().subscribe((ok) => {
      window.location.reload();
    });
  }

}
