"use server";

import { auth, currentUser as clerkCurrentUser } from "@clerk/nextjs/server";
import db from "@/lib/db";

export const currentUser = async () => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    // Check if user exists in our database
    let user = await db.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    // If user doesn't exist in our database, create them
    if (!user) {
      const clerkUser = await clerkCurrentUser();
      if (clerkUser) {
        user = await db.user.create({
          data: {
            id: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: clerkUser.fullName || clerkUser.firstName || "User",
            image: clerkUser.imageUrl || null,
            emailVerified: true,
          },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            createdAt: true,
            updatedAt: true,
          }
        });
      }
    }

    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
};



