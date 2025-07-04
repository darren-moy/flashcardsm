import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { topic, size, email } = await req.json();

    if (!topic || !size || !email) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Create placeholder cards
    const flashcards = Array.from({ length: size }, (_, i) => ({
    word: `Word ${i + 1}`,
    definition: `Definition for Word ${i + 1}`,
    }));


    await addDoc(collection(db, "flashcards"), {
      topic,
      user: email,
      cards: flashcards,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ error: err.message || "Failed to create flashcards" }, { status: 500 });
  }
}
