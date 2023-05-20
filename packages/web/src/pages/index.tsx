import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session } = useSession({
    required: true,
  });
  return (
    <div>hello , {session?.user?.email}</div>
  )
}
