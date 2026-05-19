import { ApiError, SvgiconsClient } from "@svgicons-com/api-client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = process.env.SVGICONS_API_TOKEN;

  if (!token || token === "YOUR_API_TOKEN") {
    return NextResponse.json({ message: "Server is missing SVGICONS_API_TOKEN." }, { status: 500 });
  }

  const url = new URL(request.url);
  const q = sanitizeQuery(url.searchParams.get("q"));

  if (!q) {
    return NextResponse.json({ data: [] });
  }

  const client = new SvgiconsClient({ token });

  try {
    const response = await client.search.icons({
      q,
      limit: 24,
    });

    return NextResponse.json({
      data: response.data.map((icon) => ({
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
      })),
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    throw error;
  }
}

function sanitizeQuery(value: string | null): string {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, 100);
}
