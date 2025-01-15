import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MathPipe } from 'src/app/pipe/math.pipe';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  imports:[MathPipe,CommonModule]
})
export class PaginatorComponent implements OnInit {
  @Input() totalItems: number = 0; // Total number of items
  @Input() pageSize: number = 10; // Items per page
  @Input() currentPage: number = 1; // Current active page
  @Output() pageChange = new EventEmitter<number>(); // Notify parent of page changes

  totalPages: number = 0;
  visiblePages: number[] = [];

  ngOnInit() {
    this.calculatePages();
  }

  // calculate total pages and visible page numbers
calculatePages() {
  this.totalPages = Math.ceil(this.totalItems / this.pageSize);

  const maxVisiblePages = 3; // Always show exactly 3 pages
  let startPage = this.currentPage - Math.floor(maxVisiblePages / 2);
  let endPage = this.currentPage + Math.floor(maxVisiblePages / 2);

  // Adjust the range if it goes out of bounds
  if (startPage < 1) {
    startPage = 1;
    endPage = Math.min(this.totalPages, maxVisiblePages);
  } else if (endPage > this.totalPages) {
    endPage = this.totalPages;
    startPage = Math.max(1, this.totalPages - maxVisiblePages + 1);
  }

  // Create an array of visible pages
  this.visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}


  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
    this.calculatePages();
  }
}
