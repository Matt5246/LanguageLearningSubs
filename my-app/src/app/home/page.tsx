import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]/route'
export default async function Home() {
  //@ts-ignore
  const session = await getServerSession(authOptions)
  return (
    <>
      <pre>{JSON.stringify(session)}</pre>
    </>
  );
}
