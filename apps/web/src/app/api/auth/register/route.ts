import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@zestify/db";
import crypto from "crypto";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already in use" }, { status: 400 });
    }

    // Hash password with SHA-256
    const passwordHash = crypto.createHash("sha256").update(data.password).digest("hex");

    // Create user with profile (UserProfile model in SQLite schema)
    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        profile: {
          create: {
            firstName: data.firstName,
            lastName: data.lastName,
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: { message: "User registered", userId: newUser.id } });
  } catch (error: any) {
    console.error("Signup Error:", error);

    // Handle Zod validation errors
    if (error.issues) {
      const messages = error.issues.map((issue: any) => issue.message).join(", ");
      return NextResponse.json(
        { success: false, error: `Validation failed: ${messages}` },
        { status: 400 }
      );
    }

    // Handle Prisma unique constraint errors
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Email already in use" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
