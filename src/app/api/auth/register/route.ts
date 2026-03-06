import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validations";
import logger from "@/lib/logger";
import { issueEmailVerification } from "@/lib/email-verification";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await dbConnect();

    const { username, email, password, role } = result.data;
    const user = await (User as any).registerUser(username, email, password, role);
    await issueEmailVerification(user);

    return NextResponse.json(
      {
        message:
          "Registration successful. Please verify your email before logging in.",
        userId: user._id.toString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    logger.warn({ err }, "Register failed");
    return NextResponse.json(
      { error: err.message || "Registration failed" },
      { status: 400 }
    );
  }
}
