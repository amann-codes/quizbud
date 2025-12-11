import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
    const session = await auth();
    const { pathname } = request.nextUrl;
    const isLoggedIn = !!session?.user;

    const isPublicPage = pathname === ("/");
    if (isPublicPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/generate", request.url));
    }

    if (isPublicPage && !isLoggedIn) {
        return NextResponse.next();
    }

    const isAuthPage = pathname.startsWith("/auth");
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL("/generate", request.url));
    }

    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL("/auth", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};