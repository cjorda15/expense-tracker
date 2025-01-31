import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MathPipe } from 'src/app/pipe/math.pipe';

@Component({
  selector: 'app-result-count',
  imports: [MathPipe, CommonModule],
  templateUrl: './result-count.component.html',
  styleUrl: './result-count.component.css'
})
export class ResultCountComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;
}
