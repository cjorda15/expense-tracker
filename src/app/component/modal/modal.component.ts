import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { ButtonComponent } from '@component/button/button.component';
import { DialogRef, DIALOG_DATA } from '@service/dialog.service';

@Component({
  selector: 'app-modal',
  imports: [ButtonComponent, CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent {
  @Input() title!: string;
  @Input() class!: string;
  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  close() {
    this.dialogRef.close();
  }
}
