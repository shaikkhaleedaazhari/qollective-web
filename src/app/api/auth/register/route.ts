import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { userTable } from "@/lib/schema/auth";
import { registerSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { generateId } from "lucia";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";

export const POST = async (req: NextRequest) => {
    const reqbody = await req.json();
    const parsedData = await registerSchema.safeParseAsync(reqbody)
    if (!parsedData.success) {
        return NextResponse.json({
            status: 400,
            error: parsedData.error.format()
        })
    }


    const user = await db.select().from(userTable).where(eq(userTable.email, parsedData.data.email))

    if (user.length > 0) {
        return NextResponse.json({
            status: 404,
            error: "user already exists"
        })
    }

    const hashedPassword = await new Argon2id().hash(parsedData.data.password);
    const userId = generateId(15);

    const res = await db.insert(userTable).values({
        email: parsedData.data.email,
        hashedPassword,
        id: userId
    })

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    return NextResponse.json({
        status: 200,
        message: "success"
    })
}