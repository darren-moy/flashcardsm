'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Navbar from '@/components/Navbar'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/UI/carousel'
import clsx from 'clsx'

export default function FlashcardSetPage() {
  const { id } = useParams()
  const [flashcardSet, setFlashcardSet] = useState<any>(null)
  const [flipped, setFlipped] = useState<boolean[]>([])

  useEffect(() => {
    const fetchSet = async () => {
      const docRef = doc(db, 'flashcards', id as string)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const data = docSnap.data()
        setFlashcardSet({ id, ...data })
        setFlipped(new Array(data.cards.length).fill(false))
      }
    }
    fetchSet()
  }, [id])

  const handleFlipCard = (index: number) => {
    setFlipped(prev => {
      const updated = [...prev]
      updated[index] = !updated[index]
      return updated
    })
  }

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        {flashcardSet ? (
          <>
            <h1 className="text-2xl font-bold mb-4">{flashcardSet.topic}</h1>
            <p className="mb-4 text-gray-600">{flashcardSet.difficulty}</p>

            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {flashcardSet.cards?.map((card: any, index: number) => (
                  <CarouselItem key={index}>
                    <div
                      className="w-full h-60 flex justify-center items-center"
                      onClick={() => handleFlipCard(index)}
                      style={{ perspective: '1000px' }}
                    >
                      <div
                        className={clsx(
                          'relative w-full h-full transition-transform duration-700 transform-style preserve-3d cursor-pointer rounded-lg border bg-white shadow-md p-6 text-center',
                          flipped[index] ? 'rotate-y-180' : ''
                        )}
                      >
                        {/* Front */}
<div className="absolute inset-0 backface-hidden flex items-center justify-center text-xl font-bold break-all whitespace-pre-wrap overflow-auto px-4 text-center">
  {card.word}
</div>

{/* Back */}
<div className="absolute inset-0 backface-hidden rotate-y-180 flex items-center justify-center text-lg text-gray-700 break-all whitespace-pre-wrap overflow-auto px-4 text-center">
  {card.definition}
</div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  )
}
