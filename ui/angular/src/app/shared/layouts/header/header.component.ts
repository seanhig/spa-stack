import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() showSignin = true;  
}
