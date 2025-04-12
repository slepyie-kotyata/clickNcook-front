import { Component } from '@angular/core';
import { UpgradeButtonComponent } from "../upgrade-button/upgrade-button.component";

@Component({
  selector: 'app-upgrade-window',
  standalone: true,
  imports: [UpgradeButtonComponent],
  templateUrl: './upgrade-window.component.html',
  styleUrl: './upgrade-window.component.css'
})
export class UpgradeWindowComponent {

}
