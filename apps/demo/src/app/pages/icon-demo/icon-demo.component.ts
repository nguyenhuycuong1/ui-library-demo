import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IconComponent, type IconName, type IconSize, type IconVariant } from '@ui/icon';

type IconEntry = { name: IconName; label: string };
type IconGroup = { title: string; icons: IconEntry[] };

@Component({
  selector: 'app-icon-demo',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './icon-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconDemoComponent {
  readonly sizes: { value: IconSize; label: string }[] = [
    { value: 'xs',  label: 'xs  12px' },
    { value: 'sm',  label: 'sm  16px' },
    { value: 'md',  label: 'md  20px' },
    { value: 'lg',  label: 'lg  24px' },
    { value: 'xl',  label: 'xl  32px' },
  ];

  readonly variants: { value: IconVariant; label: string }[] = [
    { value: 'default', label: 'default' },
    { value: 'muted',   label: 'muted'   },
    { value: 'brand',   label: 'brand'   },
    { value: 'success', label: 'success' },
    { value: 'warning', label: 'warning' },
    { value: 'danger',  label: 'danger'  },
    { value: 'inverse', label: 'inverse' },
  ];

  readonly groups: IconGroup[] = [
    {
      title: 'Arrows',
      icons: [
        { name: 'arrow-up',    label: 'arrow-up'    },
        { name: 'arrow-down',  label: 'arrow-down'  },
        { name: 'arrow-left',  label: 'arrow-left'  },
        { name: 'arrow-right', label: 'arrow-right' },
      ],
    },
    {
      title: 'Chevrons',
      icons: [
        { name: 'chevron-up',    label: 'chevron-up'    },
        { name: 'chevron-down',  label: 'chevron-down'  },
        { name: 'chevron-left',  label: 'chevron-left'  },
        { name: 'chevron-right', label: 'chevron-right' },
      ],
    },
    {
      title: 'UI Controls',
      icons: [
        { name: 'menu',           label: 'menu'           },
        { name: 'close',          label: 'close'          },
        { name: 'more-horizontal',label: 'more-horizontal'},
        { name: 'more-vertical',  label: 'more-vertical'  },
        { name: 'plus',           label: 'plus'           },
        { name: 'minus',          label: 'minus'          },
        { name: 'check',          label: 'check'          },
        { name: 'slash',          label: 'slash'          },
      ],
    },
    {
      title: 'Actions',
      icons: [
        { name: 'edit',          label: 'edit'          },
        { name: 'trash',         label: 'trash'         },
        { name: 'copy',          label: 'copy'          },
        { name: 'download',      label: 'download'      },
        { name: 'upload',        label: 'upload'        },
        { name: 'refresh',       label: 'refresh'       },
        { name: 'search',        label: 'search'        },
        { name: 'filter',        label: 'filter'        },
        { name: 'sort',          label: 'sort'          },
        { name: 'share',         label: 'share'         },
        { name: 'link',          label: 'link'          },
        { name: 'external-link', label: 'external-link' },
        { name: 'send',          label: 'send'          },
        { name: 'print',         label: 'print'         },
        { name: 'save',          label: 'save'          },
      ],
    },
    {
      title: 'Status & Feedback',
      icons: [
        { name: 'check-circle',   label: 'check-circle'   },
        { name: 'x-circle',       label: 'x-circle'       },
        { name: 'info',           label: 'info'           },
        { name: 'alert-triangle', label: 'alert-triangle' },
        { name: 'alert-circle',   label: 'alert-circle'   },
        { name: 'clock',          label: 'clock'          },
        { name: 'calendar',       label: 'calendar'       },
        { name: 'loader',         label: 'loader'         },
      ],
    },
    {
      title: 'User & Account',
      icons: [
        { name: 'user',     label: 'user'     },
        { name: 'users',    label: 'users'    },
        { name: 'log-in',   label: 'log-in'   },
        { name: 'log-out',  label: 'log-out'  },
        { name: 'settings', label: 'settings' },
      ],
    },
    {
      title: 'Navigation & Location',
      icons: [
        { name: 'home',     label: 'home'     },
        { name: 'map-pin',  label: 'map-pin'  },
        { name: 'globe',    label: 'globe'    },
        { name: 'bookmark', label: 'bookmark' },
        { name: 'flag',     label: 'flag'     },
        { name: 'tag',      label: 'tag'      },
      ],
    },
    {
      title: 'Communication',
      icons: [
        { name: 'mail',    label: 'mail'    },
        { name: 'phone',   label: 'phone'   },
        { name: 'message', label: 'message' },
        { name: 'bell',    label: 'bell'    },
        { name: 'at',      label: 'at'      },
        { name: 'rss',     label: 'rss'     },
      ],
    },
    {
      title: 'Files & Data',
      icons: [
        { name: 'file',      label: 'file'      },
        { name: 'file-text', label: 'file-text' },
        { name: 'folder',    label: 'folder'    },
        { name: 'image',     label: 'image'     },
        { name: 'code',      label: 'code'      },
        { name: 'terminal',  label: 'terminal'  },
        { name: 'package',   label: 'package'   },
        { name: 'database',  label: 'database'  },
        { name: 'server',    label: 'server'    },
        { name: 'cloud',     label: 'cloud'     },
      ],
    },
    {
      title: 'Security',
      icons: [
        { name: 'eye',     label: 'eye'     },
        { name: 'eye-off', label: 'eye-off' },
        { name: 'lock',    label: 'lock'    },
        { name: 'unlock',  label: 'unlock'  },
        { name: 'key',     label: 'key'     },
        { name: 'shield',  label: 'shield'  },
      ],
    },
    {
      title: 'Favorites & Media',
      icons: [
        { name: 'star',       label: 'star'       },
        { name: 'heart',      label: 'heart'      },
        { name: 'play',       label: 'play'       },
        { name: 'pause',      label: 'pause'      },
        { name: 'stop',       label: 'stop'       },
        { name: 'volume',     label: 'volume'     },
        { name: 'volume-off', label: 'volume-off' },
        { name: 'mic',        label: 'mic'        },
        { name: 'camera',     label: 'camera'     },
        { name: 'video',      label: 'video'      },
      ],
    },
    {
      title: 'Layout & View',
      icons: [
        { name: 'grid',     label: 'grid'     },
        { name: 'list',     label: 'list'     },
        { name: 'maximize', label: 'maximize' },
        { name: 'minimize', label: 'minimize' },
        { name: 'sidebar',  label: 'sidebar'  },
        { name: 'layers',   label: 'layers'   },
        { name: 'zoom-in',  label: 'zoom-in'  },
        { name: 'zoom-out', label: 'zoom-out' },
        { name: 'sun',      label: 'sun'      },
        { name: 'moon',     label: 'moon'     },
      ],
    },
  ];
}
