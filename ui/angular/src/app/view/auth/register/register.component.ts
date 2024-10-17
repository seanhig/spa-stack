import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormControl,
  AbstractControl,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule, FormsModule, RouterLink, JsonPipe],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = {} as FormGroup;
  errorMessage: string = '';
  registeredUser : any | undefined;
  @ViewChild('email', { static: false }) inputEmailElement: ElementRef | undefined;  

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

    this.registeredUser = {
      email: '',
      password: '',
      password2: '',
    };

/*     this.registerForm = new FormGroup({
        email: new FormControl(this.registeredUser.email, [
          Validators.required,
          Validators.email]),
        password: new FormControl(this.registeredUser.password, [
          Validators.required,
          Validators.minLength(4)
        ]),
        password2: new FormControl(this.registeredUser.password2, [
          Validators.required,
          confirmPasswordValidator(), // <-- Here's how you pass in the custom validator.
        ])
      });
 */
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      password2: ['', [Validators.required]]
    }, { validator: checkPasswords });

    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.inputEmailElement?.nativeElement.focus();
    },100); 

  }

  cancel() {
    this.router.navigateByUrl('/site/home');
  }

  register() {
    this.errorMessage = '';
/*     this.auth.register(this.registerForm.value).subscribe({
      next: (res: any) => {
        this.router.navigateByUrl('/auth/signin?username=' + this.registerForm.value.email);
      },
      error: (err: string) => {
        this.errorMessage = err;
      },
    });
 */  }
}

export function checkPasswords (c: AbstractControl) {
  //safety check
  let password1=c.get('password')?.value;
  let password2=c.get('password2')?.value;

  if (password1 === password2) { 
    return null; 
  } else {
    c.get('password2')?.setErrors({ PasswordNoMatch: true });
    return { PasswordNoMatch: true };
  }
}