import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup = {} as FormGroup;
  errorMessage: string = '';
  username: string = 'test@example.com';
  private route = inject(ActivatedRoute);
  @ViewChild('password', { static: false }) inputPasswordElement: ElementRef | undefined;  
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {}
  ngOnInit(): void {
    this.buildBasicForm();
    localStorage.clear();
  }

  buildBasicForm() {
    let value = this.route.snapshot.queryParamMap.get('username');
    if(value) { 
      this.username = value 
      setTimeout(()=>{ // this will make the execution after the above boolean has changed
        this.inputPasswordElement?.nativeElement.focus();
      },100); 
    };
    this.signinForm = this.fb.group({
      email: [this.username, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  signin() {
    this.errorMessage = '';
/*     this.auth.signin(this.signinForm.value).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/site/home');
      },
      error: (err: string) => {
        this.errorMessage = err;
      },
    });
 */  }
}