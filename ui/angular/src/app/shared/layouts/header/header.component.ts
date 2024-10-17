import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
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
  
  constructor(public _authService: AuthService) {
    
  }

  public signOut() {
    //alert("You are signed out!  Not really");
    this._authService.signout();
  }

}
