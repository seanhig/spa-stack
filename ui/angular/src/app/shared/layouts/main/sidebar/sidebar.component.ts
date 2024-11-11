import { Component, ErrorHandler } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { NgIf } from '@angular/common';
import { interval, of, map, catchError, combineLatest, take, Observable } from 'rxjs';
import { User } from '../../../../model/user';
import { LOCATION_UPGRADE_CONFIGURATION } from '@angular/common/upgrade';



@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  _isAdminMode : boolean = false;

  constructor(public _authService : AuthService, 
    private _router : Router) {
    
  }

  get isAdminMode() : boolean {
    return this._isAdminMode;
  }

  ngOnInit() {

    this._authService.getActiveUser().subscribe((activeUser: User) => {
        console.log('current user: ' + activeUser.email);
        console.log(activeUser);
        if(activeUser && activeUser.userName != null) {
          this._isAdminMode = true;
        }
    })
  }

}
