import {Component, HostListener} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {UpdateService} from './shared/lib/services/update.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Click & Cook';

  constructor(protected update: UpdateService) {
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (
      (event.ctrlKey || event.metaKey) &&
      ['c', 'u', 's', 'a'].includes(event.key.toLowerCase())
    ) {
      event.preventDefault();
    }
  }
}
