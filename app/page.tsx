'use client';

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS?.split(",") || [];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!allowedEmails.includes(email)) {
      setError("Unauthorized user.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError("Invalid login credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-50">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md space-y-4 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-yellow-800">Login to Madison's flashcards</h1>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
          onClick={() => {
            console.log('Input email:', email);
            console.log('Allowed:', allowedEmails.includes(email));
          }}
        >
          Log In
        </button>
      </form>
    </div>
  );
}
