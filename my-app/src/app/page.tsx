<<<<<<< Updated upstream

import { redirect } from "next/navigation";

const Home = () => {
  redirect('/home');
};

export default Home;
=======
"use client"
import { useRouter } from 'next/navigation'
export default function Home() {
  const router = useRouter()

  router.push('/home', { scroll: false })

  return null;
}

>>>>>>> Stashed changes
