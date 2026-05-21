import { NextRequest, NextResponse } from "next/server";
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. EXTRACT AND VERIFY THE SECURE TOKEN
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized. Missing token." }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const auth = getAuth();
    
    // Verify the token belongs to a real logged-in user
    const decodedToken = await auth.verifyIdToken(idToken);

    // 2. CHECK IF THE CALLER IS THE SUPER ADMIN
    if (decodedToken.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden. Only the Super Admin can do this." }, { status: 403 });
    }

    // 3. PROCEED WITH TEAM CREATION
    const { email, password } = await req.json();

    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid data." }, { status: 400 });
    }

    if (email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Cannot modify super admin from this panel." }, { status: 403 });
    }
    
    const listUsersResult = await auth.listUsers(10);
    const existingUsers = listUsersResult.users;
    const userExists = existingUsers.find(u => u.email === email);

    if (!userExists && existingUsers.length >= 4) {
      return NextResponse.json({ error: "Maximum limit of 3 team members reached." }, { status: 403 });
    }

    if (userExists) {
      await auth.updateUser(userExists.uid, { password });
      return NextResponse.json({ message: "Password updated successfully!" });
    } else {
      await auth.createUser({ email, password, emailVerified: true });
      return NextResponse.json({ message: "New team member created successfully!" });
    }

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Server Error or Invalid Token" }, { status: 500 });
  }
}