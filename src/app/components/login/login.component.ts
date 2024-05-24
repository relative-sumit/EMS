import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  fb = inject(FormBuilder);
  faUser = faUser;
  faLock = faLock;
  errorMessage: string = '';

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  constructor(private auth: AuthService, private router: Router) {}
  ngOnInit(): void {
    if (this.auth.isLoggedin()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.form.getRawValue().username && this.form.getRawValue().password) {
      this.errorMessage = '';

      this.auth
        .login(
          this.form.getRawValue().username,
          this.form.getRawValue().password
        )
        .subscribe(
          (data) => {
            if (data.status === 200) {
              this.auth.storeSession('token', data.token);
              this.auth.storeSession('userId', data.userId);
              this.auth.storeSession('username', data.username);
              this.auth.storeSession('role', data.role);

              if (data.role === 'user') {
                this.router.navigate(['/dashboard']);
              } else if (data.role === 'admin') {
                this.router.navigate(['/admin']);
              }
            } else {
              this.errorMessage = data.errorMessage;
              throw new Error('Faulty credentials!');
            }
          },
          (error) => {
            console.error(error);
          }
        );
    } else {
      if (
        this.form.getRawValue().username &&
        !this.form.getRawValue().password
      ) {
        this.errorMessage = 'Password field is empty.';
      } else if (
        !this.form.getRawValue().username &&
        this.form.getRawValue().password
      ) {
        this.errorMessage = 'Username field is empty.';
      } else {
        this.errorMessage = 'Username/Password required.';
      }
    }
  }
}
