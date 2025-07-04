'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/UI/form";
import { useToast } from "@/components/UI/use-toast";
import { Textarea } from "@/components/UI/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import Navbar from "@/components/Navbar";

const formSchema = z.object({
  topic: z.string().min(2, { message: "Topic must be longer than 2 characters" }),
  cards: z.array(z.object({
    word: z.string().min(1, "Required"),
    definition: z.string().min(1, "Required"),
  }))
});

type FormData = z.infer<typeof formSchema>;

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      cards: [{ word: "", definition: "" }]
    },
  });

  const { fields, append, remove } = useFieldArray({ control: form.control, name: "cards" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserEmail(user.email);
        await loadFlashcards();
      }
    });
    return () => unsubscribe();
  }, [router]);

  const loadFlashcards = async () => {
  const q = query(collection(db, "flashcards"));
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  setFlashcards(results);
};


  const handleSubmit = async (values: FormData) => {
    if (!userEmail) return;
    try {
      await addDoc(collection(db, "flashcards"), {
        topic: values.topic,
        cards: values.cards,
        user: userEmail,
        createdAt: new Date(),
      });
      toast({ title: "Success!", description: "Flashcards saved." });
      await loadFlashcards(); 
    } catch (err: any) {
      toast({ title: "Error", description: err.message });
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto bg-yellow-50 min-h-screen">
        <h1 className="text-2xl font-bold text-yellow-800 mb-6">Create Flashcards</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xl">Topic</FormLabel>
                  <FormControl>
                    <Input className="text-black" type="text" placeholder="Enter topic..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
  <div key={field.id} className="flex gap-4 items-start">
    <FormField
      control={form.control}
      name={`cards.${index}.word`}
      render={({ field }) => {
        return (
          <FormItem className="flex-1">
            <FormLabel>Word</FormLabel>
            <FormControl>
              <Textarea
                className="text-black w-full max-w-2px overflow-hidden resize-none whitespace-pre-wrap break-all"
                rows={1}
                {...field}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                  field.onChange(e); // Update value in form
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
    <FormField
      control={form.control}
      name={`cards.${index}.definition`}
      render={({ field }) => {
        return (
          <FormItem className="flex-1">
            <FormLabel>Definition</FormLabel>
            <FormControl>
              <Textarea
                className="text-black w-full max-w-2px overflow-hidden resize-none whitespace-pre-wrap break-all"
                rows={1}
                {...field}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = `${target.scrollHeight}px`;
                  field.onChange(e); // Update value in form
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
    <Button type="button" onClick={() => remove(index)} className="self-end">
      Remove
    </Button>
  </div>
))}

            <Button type="button" onClick={() => append({ word: "", definition: "" })}>
              Add Card
            </Button>
            <Button type="submit" className="bg-[#FFA726] hover:bg-[#FB8C00] text-[#FFF3E0]">Save Flashcards</Button>
          </form>
        </Form>

        <div className="mt-10">
  <h2 className="text-xl font-bold mb-4 text-yellow-900">Your Flashcards</h2>
  {flashcards.length === 0 ? (
    <p className="text-gray-600">No flashcards yet. Create one above!</p>
  ) : (
    <ul className="space-y-4">
      {flashcards.map((fc, idx) => (
        <li key={idx} className="bg-white p-4 rounded shadow max-w-full overflow-auto">
          <p className="font-bold break-words">{fc.topic}</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            {fc.cards?.map((card: any, i: number) => (
              <li key={i} className="break-words whitespace-pre-wrap">
                <strong>{card.word}</strong>: {card.definition}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )}
</div>

      </div>
    </>
  );
}
