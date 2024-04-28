import { getServerUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { questionBankTable } from "@/lib/schema/questions";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, { params }: { params: { qbankid: string } }) => {
    const { qbankid } = params;
    const session = await getServerUser();
    if (!session?.user) {
        return NextResponse.json({
            error: "Unauthorized",
            status: 403
        })
    }

    const deletedQbank = await db.delete(questionBankTable).where(and(eq(questionBankTable.id, qbankid), eq(questionBankTable.userId, session.user.id)))

    if (deletedQbank) {
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