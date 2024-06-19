import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { userTable } from "@/lib/schema/auth";
import { loginSchema } from "@/lib/validation";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Argon2id } from "oslo/password";

export const POST = async (req: NextRequest) => {
    const reqbody = await req.json();
    const parsedData = await loginSchema.safeParseAsync(reqbody)
    if (!parsedData.success) {
        return NextResponse.json({
            status: 400,
            error: parsedData.error.format()
        })
    }


    try {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, parsedData.data.email));

      if (user.length === 0) {
        return NextResponse.json({
          status: 400,
          error: "invalid credentials",
        });
      }

      const validPassword = await new Argon2id().verify(
        user[0].hashedPassword,
        parsedData.data.password
      );

      if (!validPassword) {
        return NextResponse.json({
          status: 400,
          error: "Invalid credentials",
        });
      }

      const session = await lucia.createSession(user[0].id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      revalidatePath("/", "layout");

      return NextResponse.json({
        status: 200,
        message: "success",
      });
    } catch (e) {
      console.error(e);
      return NextResponse.json({
        status: 500,
        error: "Something went wrong",
      });
    }
}