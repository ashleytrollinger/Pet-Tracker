
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen p-8">
      <section className="mb-8 text-center">
        <p className="text-lg mx-25">
          Created by{' '}
          <a href="https://ashleytrollinger-azure.vercel.app/" className="text-blue-500 hover:underline">
            Ashley Trollinger
          </a>{' '}
          - This website was created to explore the functionality of Supabase as a backend and practice using CSS frameworks like Tailwind. As a new pet owner, I decided to build a virtual hub for all my pets' information.
        </p>
      </section>
      <section className="flex flex-col items-center">
        <Link href="/SignUp" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 p-4 rounded inline-block">
          Sign Up
        </Link>
        <Link href="/LogIn" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 p-4 rounded inline-block">
          Log In
        </Link>
      </section>
    </main>
  );
}

