import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css',
})
export class BodyComponent {
  @Input() collapsed = true;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    let styleClass = '';

    if (this.collapsed && this.screenWidth <= 768 && this.screenWidth > 0) {
      styleClass = 'body-md-screen';
    } else if (this.collapsed) {
      styleClass = '';
    } else {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }
}
