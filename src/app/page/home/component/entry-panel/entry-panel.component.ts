import { Component } from '@angular/core';
import { ButtonComponent } from '../../../../component/button/button.component';

@Component({
  selector: 'app-entry-panel',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './entry-panel.component.html',
  styleUrl: './entry-panel.component.css'
})
export class EntryPanelComponent {

}
