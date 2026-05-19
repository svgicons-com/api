export interface PaletteIcon {
  id: number;
  name: string;
  label?: string;
  pageUrl: string;
  iconSet: {
    name: string;
    prefix: string;
    license?: string | null;
  } | null;
}

export interface PaletteSvgIcon extends PaletteIcon {
  svg: string;
}
