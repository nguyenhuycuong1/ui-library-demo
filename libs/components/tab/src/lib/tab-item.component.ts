import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'ui-tab',
  standalone: true,
  template: `<ng-template><ng-content /></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabItemComponent {
  @ViewChild(TemplateRef, { static: true }) content!: TemplateRef<unknown>;
  @Input({ required: true }) label!: string;
  @Input() disabled = false;
}
