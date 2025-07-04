'use client';

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="bg-[#4A2F2D] text-[#FFC107] py-6">
      <div className="px-10 flex justify-between items-center">
        <h1 className="font-extrabold text-2xl hover:text-[#FFA000]">
          Welcome to Baby's flashcards collection
        </h1>
        <nav>
          <ul className="flex items-center gap-6 font-bold">
            <li className="hover:text-[#FFA000]">
              <Link href="/dashboard">Dashboard</Link>
            </li>
            <li className="hover:text-[#FFA000]">
              <Link href="/library">Library</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
