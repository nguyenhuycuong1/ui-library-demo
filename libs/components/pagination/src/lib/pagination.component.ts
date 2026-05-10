import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { IconComponent } from '@ui/icon';
import type { PaginationSize } from './pagination.types';

@Component({
  selector: 'ui-pagination',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() size: PaginationSize = 'md';
  @Input() disabled = false;
  @Input() showFirstLast = true;
  @Input() siblingCount = 1;

  @Output() readonly pageChange = new EventEmitter<number>();

  @HostBinding('style.display') readonly hostDisplay = 'inline-flex';

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get isFirst(): boolean { return this.page <= 1; }
  get isLast(): boolean  { return this.page >= this.totalPages; }

  get pages(): (number | '...')[] {
    const total = this.totalPages;
    if (total <= 1) return [1];

    const range = (from: number, to: number): number[] =>
      Array.from({ length: to - from + 1 }, (_, i) => from + i);

    const leftSibling  = Math.max(2, this.page - this.siblingCount);
    const rightSibling = Math.min(total - 1, this.page + this.siblingCount);

    const showLeftEllipsis  = leftSibling > 3;
    const showRightEllipsis = rightSibling < total - 2;

    if (!showLeftEllipsis && !showRightEllipsis) return range(1, total);

    if (!showLeftEllipsis) return [...range(1, rightSibling), '...', total];

    if (!showRightEllipsis) return [1, '...', ...range(leftSibling, total)];

    return [1, '...', ...range(leftSibling, rightSibling), '...', total];
  }

  goToPage(page: number | '...'): void {
    if (page === '...' || this.disabled || page === this.page) return;
    this.pageChange.emit(page as number);
  }

  prevPage(): void {
    if (!this.isFirst && !this.disabled) this.pageChange.emit(this.page - 1);
  }

  nextPage(): void {
    if (!this.isLast && !this.disabled) this.pageChange.emit(this.page + 1);
  }

  firstPage(): void {
    if (!this.isFirst && !this.disabled) this.pageChange.emit(1);
  }

  lastPage(): void {
    if (!this.isLast && !this.disabled) this.pageChange.emit(this.totalPages);
  }
}
