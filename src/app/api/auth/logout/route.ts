import { getServerUser, lucia } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const POST = async () => {
    const session = await getServerUser();
    if (!session?.session) {
        return NextResponse.json({
            error: "Unauthorized",
            status: 403
        })
    }

    await lucia.invalidateSession(session?.session.id);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    revalidatePath("/", "layout");

    return redirect("/");
}