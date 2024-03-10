import { getServerSession } from "next-auth";

export default async function Home() {

  return (
    <div className="flex justify-center mt-6 text-2xl">
      <div>
        home screen, later there will be cards with short functionality of other route pages, or sth else.
      </div>
    </div>
  );
}
