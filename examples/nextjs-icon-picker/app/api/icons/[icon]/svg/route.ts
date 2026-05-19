import { ApiError, SvgiconsClient } from "@svgicons-com/api-client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    icon: string;
  }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const token = process.env.SVGICONS_API_TOKEN;

  if (!token || token === "YOUR_API_TOKEN") {
    return NextResponse.json({ message: "Server is missing SVGICONS_API_TOKEN." }, { status: 500 });
  }

  const { icon } = await context.params;
  const numericIcon = Number(icon);

  if (!Number.isInteger(numericIcon) || numericIcon < 1) {
    return NextResponse.json({ message: "Icon id must be a positive integer." }, { status: 400 });
  }

  const client = new SvgiconsClient({ token });

  try {
    const response = await client.icons.getSvg({ icon: numericIcon });

    return NextResponse.json({
      data: {
        id: response.data.id,
        name: response.data.name,
        svg: response.data.svg,
        iconSet: response.data.iconSet
          ? {
              name: response.data.iconSet.name,
              prefix: response.data.iconSet.prefix,
              license: response.data.iconSet.license,
            }
          : null,
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    throw error;
  }
}
