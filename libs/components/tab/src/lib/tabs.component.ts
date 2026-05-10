import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  QueryList,
  inject,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TabItemComponent } from './tab-item.component';
import type { TabSize, TabVariant } from './tab.types';

@Component({
  selector: 'ui-tabs',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsComponent implements AfterContentInit {
  @Input() variant: TabVariant = 'line';
  @Input() size: TabSize = 'md';
  @Input() activeIndex = 0;
  @Output() readonly activeIndexChange = new EventEmitter<number>();
  @Output() readonly tabChange = new EventEmitter<number>();

  @ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

  private readonly cdr = inject(ChangeDetectorRef);

  @HostBinding('class')
  get hostClass(): string {
    return `tabs tabs--${this.variant} tabs--${this.size}`;
  }

  get tabList(): TabItemComponent[] {
    return this.tabs?.toArray() ?? [];
  }

  ngAfterContentInit(): void {
    this.cdr.markForCheck();
  }

  select(index: number): void {
    if (this.tabs.get(index)?.disabled) return;
    this.activeIndex = index;
    this.activeIndexChange.emit(index);
    this.tabChange.emit(index);
    this.cdr.markForCheck();
  }
}
