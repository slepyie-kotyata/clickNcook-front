import { Component } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-upgrade-button',
  standalone: true,
  imports: [NgIf],
  templateUrl: './upgrade-button.component.html',
  styleUrl: './upgrade-button.component.css',
})
export class UpgradeButtonComponent {}
