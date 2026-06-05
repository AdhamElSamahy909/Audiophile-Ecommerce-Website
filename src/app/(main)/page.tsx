import HomePage from "@/components/home/HomePage";
import { getSession } from "@/features/auth/session";
// import Link from "next/link";

export default async function Page() {
  const user = await getSession();

  console.log("user: ", user);

  return (
    <>
      <HomePage />
    </>
  );
}
