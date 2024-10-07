import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AboutService } from './services/about.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  public apiname!: string;

  title = 'WebApp';

  constructor(private aboutService: AboutService) { }

  ngOnInit(): void {
    this.aboutService.getApi().subscribe(
      (response) => { 
          console.log(response);
          this.apiname = response.apiName; 
      },
      (error) => { console.log(error); });
  }

}
