import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  _isAdminMode : boolean = false;

  constructor(public _authService : AuthService) {
    
  }

  get isAdminMode() : boolean {
    return this._isAdminMode;
  }

  ngOnInit() {
    this._authService.getActiveUser().subscribe(activeUser => {
      if(activeUser && activeUser.userName != null) {
        this._isAdminMode = true;
      }
      
    })
  }

}
