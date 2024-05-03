import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  faUser = faUser;
  faLock = faLock;
  errorMessage: string = '';

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private auth: AuthService, private login: LoginService) {}

  ngOnInit(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  onSubmit(): void {
    if (this.form.getRawValue().username && this.form.getRawValue().password) {
      this.errorMessage = '';

      this.login
        .login(
          this.form.getRawValue().username,
          this.form.getRawValue().password
        )
        .subscribe((data) => {
          console.log(data);
        });
    } else {
      if (
        this.form.getRawValue().username &&
        !this.form.getRawValue().password
      ) {
        this.errorMessage = 'Empty Password input, please provide input...';
      } else if (
        !this.form.getRawValue().username &&
        this.form.getRawValue().password
      ) {
        this.errorMessage = 'Empty Username input, please provide input...';
      } else {
        this.errorMessage = 'Empty input, please provide input...';
      }
    }
  }
}
