'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/Navbar'

export default function LibraryPage() {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchSets = async () => {
      const snapshot = await getDocs(collection(db, 'flashcards'))
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setFlashcardSets(data)
    }
    fetchSets()
  }, [])

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📚 Flashcard Library</h1>
        {flashcardSets.length === 0 ? (
          <p>No flashcard sets found.</p>
        ) : (
          <ul className="space-y-4">
            {flashcardSets.map((set) => (
              <li
                key={set.id}
                onClick={() => router.push(`/library/${set.id}`)}
                className="cursor-pointer bg-yellow-100 hover:bg-yellow-200 p-4 rounded shadow"
              >
                <p className="font-bold">{set.topic}</p>
                <p className="text-sm text-gray-600">{set.difficulty} · {set.cards?.length || 0} cards</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
