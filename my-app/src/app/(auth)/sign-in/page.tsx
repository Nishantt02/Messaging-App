'use client'
import { useSession, signIn, signOut } from "next-auth/react"

// here we get the data from the session by using the usesession
export default function Component()
 {
  const { data: session } = useSession()
  if (session) 
    {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="bg-orange-400 px-3 py-1 m-4 rounded-2xl" onClick={() => signIn()}>Sign in</button>
    </>
  )
}