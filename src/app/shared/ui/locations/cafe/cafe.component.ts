import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-cafe',
  standalone: true,
  imports: [NgIf],
  templateUrl: './cafe.component.html',
  styleUrl: './cafe.component.css',
})
export class CafeComponent {}
