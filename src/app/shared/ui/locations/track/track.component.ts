import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-track',
  standalone: true,
  imports: [NgIf],
  templateUrl: './track.component.html',
  styleUrl: './track.component.css',
})
export class TrackComponent {
  @Input({ required: true }) decorCount: number = 0;
}
