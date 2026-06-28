import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event, { IEvent } from "@/database/event.model";

type Params = Promise<{ slug: string }>;

export async function GET(
    _req: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { slug } = await params;

        if (!slug || typeof slug !== "string" || slug.trim() === "") {
            return NextResponse.json(
                { message: "Invalid or missing slug" },
                { status: 400 }
            );
        }

        // Strip anything that isn't alphanumeric or a hyphen — valid slug chars only
        const sanitizedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "");

        if (sanitizedSlug === "") {
            return NextResponse.json(
                { message: "Invalid slug" },
                { status: 400 }
            );
        }

        await connectDB();

        const event: IEvent | null = await Event.findOne({ slug: sanitizedSlug });

        if (!event) {
            return NextResponse.json(
                { message: `No event found with slug "${slug}"` },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Event fetched successfully", event },
            { status: 200 }
        );
    } catch (e) {
        console.error("[GET /api/events/[slug]]", e);
        return NextResponse.json(
            { message: "Failed to fetch events", error: e instanceof Error ? e.message : "Unknown error" },
            { status: 500 }
        );
    }
}
