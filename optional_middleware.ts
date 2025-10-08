import { User } from "@/types/User";
import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function middleware(req: NextRequest): Promise<NextResponse> {
    console.log("Middleware executed for path:", req.nextUrl.pathname);
    const token = req.cookies.get("jwt")?.value;

    if (!token) {
        console.log("No token found, redirecting to /login");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not defined");
        return NextResponse.redirect(new URL("/login", req.url));
    }

    let user: User | null = null;
    try {
        user = jwt.decode(token) as User;
        if (!user) {
            throw new Error("Invalid token");
        }
        console.log("User role:", user.role);
    } catch (error) {
        console.error("Error decoding token:", error);
        return NextResponse.redirect(new URL("/login", req.url));
    }

    const path = req.nextUrl.pathname;
    if (path.startsWith("/dashboard/verificationQueue") && !["verifier", "admin"].includes(user.role)) {
        console.log("Access denied: User is not a verifier or admin");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (path.startsWith("/dashboard/manageUsers") && user.role !== "admin") {
        console.log("Access denied: User is not an admin");
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    console.log("Access granted, proceeding to next middleware/page");
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"]
};