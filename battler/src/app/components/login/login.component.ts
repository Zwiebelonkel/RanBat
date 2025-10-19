
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../../services/database.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    private authService: AuthService
  ) {}

  async login() {
    try {
      const result = await this.databaseService.getUserByUsername(this.username);
      if (result.rows.length > 0) {
        const user: any = result.rows[0];
        if (user.password === this.password) {
          this.authService.setCurrentUser(user);
          this.router.navigate(['/generator']);
        } else {
          this.error = 'Invalid password';
        }
      } else {
        this.error = 'User not found';
      }
    } catch (error) {
      console.error(error);
      this.error = 'An error occurred while trying to log in';
    }
  }

  async register() {
    try {
      await this.databaseService.registerUser(this.username, this.password);
      const result = await this.databaseService.getUserByUsername(this.username);
      const user: any = result.rows[0];
      this.authService.setCurrentUser(user);
      this.router.navigate(['/generator']);
    } catch (error) {
      console.error(error);
      this.error = 'An error occurred while trying to register';
    }
  }
}
