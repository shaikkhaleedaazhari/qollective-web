import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { questionBankTable } from "@/lib/schema/questions";
import { questionBankSchema } from "@/lib/validation";
import { generateId } from "lucia";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const body = await req.json();
    const parsedDate = await questionBankSchema.safeParseAsync(body);
    if (!parsedDate.success) {
        return NextResponse.json({
            status: 400,
            error: parsedDate.error.format()
        })
    }

    const session = await getServerUser();
    if (!session?.user) {
        return NextResponse.json({
            error: "Unauthorized",
            status: 403
        })
    }



    const createdQbank = await db.insert(questionBankTable).values({
        id: generateId(10),
        userId: session.user.id,
        name: parsedDate.data.name,
        description: parsedDate.data.description,
        subject: parsedDate.data.subject
    })

    if (createdQbank) {
        return NextResponse.json({
            status: 200,
            message: "success"
        })
    } else {
        return NextResponse.json({
            status: 500,
            error: "Internal Server Error"
        })
    }
}

export const GET = async (req: NextRequest) => {

    const questionBanks = await db.select().from(questionBankTable)

    return NextResponse.json({
        status: 200,
        data: questionBanks
    })
}

