import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const SELLER_PAGE_PREFIXES = ["/decks/new", "/seller"];
const SELLER_API_PREFIXES = ["/api/seller"];

function hasSellerPagePrefix(pathname: string): boolean {
  return SELLER_PAGE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function hasSellerApiPrefix(pathname: string): boolean {
  return SELLER_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function isSellerProtectedApi(req: NextRequest): boolean {
  const { pathname } = req.nextUrl;

  if (hasSellerApiPrefix(pathname)) return true;

  // Existing seller-only action.
  if (pathname === "/api/decks" && req.method === "POST") return true;

  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const protectsPage = hasSellerPagePrefix(pathname);
  const protectsApi = isSellerProtectedApi(req);

  if (!protectsPage && !protectsApi) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (protectsApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if ((token as any).role !== "seller") {
    if (protectsApi) {
      return NextResponse.json(
        { error: "Only sellers can access this resource." },
        { status: 403 }
      );
    }

    return NextResponse.redirect(new URL("/decks?forbidden=seller", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/decks/new/:path*", "/seller/:path*", "/api/decks", "/api/seller/:path*"],
};
