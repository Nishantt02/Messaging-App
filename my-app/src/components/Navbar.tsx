'use client'
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react'; 
// usession is used to get the information of the user from the session
import { User } from 'next-auth';
import { Button } from './ui/button';

function Navbar() {
  const { data: session } = useSession(); //get the data from the session
  const user = session?.user;// extract the user from the data.

  return(
    <nav className='p-4 md:p-6 shadow-md bg-gray-900 text-white'>
 <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
  <a href="#" className='ext-xl font-bold mb-4 md:mb-0'>True Feedback</a>
  {
    // if the session exist this will run use the ternitary operator
    session ? (
      <>
       <span className="mr-4">
               Welcome, {user.username || user.email}
            </span>
            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" >
              Logout
            </Button>

      </>
      // else this will run if session is not exist.
    ):(
      <Link href="/sign-in">
          <Button className="w-full md:w-auto bg-slate-100 text-black" >Login</Button>
           </Link>
      )}
    
 </div>
    </nav>
  )
}

export default Navbar;