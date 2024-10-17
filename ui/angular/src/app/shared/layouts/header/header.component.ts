import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() showSignin = true;
  
  constructor(public _authService: AuthService, 
    private _router: Router) {
    
  }

  public signOut(event: any) {
    event.preventDefault();
    console.log("We are doing the signout");

    this._authService.signout().subscribe((ok) => {
      window.location.reload();
    });
  }

}
