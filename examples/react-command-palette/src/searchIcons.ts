import { ApiError, SvgiconsClient } from "@svgicons-com/api-client";
import type { PaletteIcon, PaletteSvgIcon } from "./types";

export async function searchIconsForPalette(input: {
  q: string;
  token: string;
  limit?: number;
}): Promise<PaletteIcon[]> {
  const q = sanitizeQuery(input.q);

  if (!q) {
    return [];
  }

  const client = new SvgiconsClient({ token: input.token });

  try {
    const response = await client.search.icons({
      q,
      limit: clampLimit(input.limit ?? 12),
    });

    return response.data.map((icon) => ({
      id: icon.id,
      name: icon.name,
      label: icon.label,
      pageUrl: icon.pageUrl,
      iconSet: icon.iconSet
        ? {
            name: icon.iconSet.name,
            prefix: icon.iconSet.prefix,
            license: icon.iconSet.license,
          }
        : null,
    }));
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(`Svg/icons search failed: ${error.status} ${error.message}`);
    }

    throw error;
  }
}

export async function getPaletteIconSvg(input: {
  icon: number;
  token: string;
}): Promise<PaletteSvgIcon> {
  const client = new SvgiconsClient({ token: input.token });
  const response = await client.icons.getSvg({ icon: input.icon });

  return {
    id: response.data.id,
    name: response.data.name,
    label: response.data.label,
    pageUrl: response.data.pageUrl,
    svg: response.data.svg,
    iconSet: response.data.iconSet
      ? {
          name: response.data.iconSet.name,
          prefix: response.data.iconSet.prefix,
          license: response.data.iconSet.license,
        }
      : null,
  };
}

function sanitizeQuery(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, 100);
}

function clampLimit(value: number): number {
  return Math.min(Math.max(Math.trunc(value), 1), 20);
}
