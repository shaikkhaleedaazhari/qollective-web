// import React from 'react'
// import Link from 'next/link'
// import { cn } from '@/lib/utils'
// import Container from './Container'

// type HeaderProps = React.ComponentProps<"header">

// const Header = ({ children, className, ...props }: HeaderProps) => {
//     return (
//         <header
//             className={cn(`bg-gray-800 text-white py-4 px-6 flex justify-between items-center`, className)}
//             {...props}
//         >
//             <Container>
//                 <div className="flex items-center">
//                     <Link className='text-xl font-bold' href="/">
//                         Qollective
//                     </Link>
//                 </div>
//                 <div>{children}</div>
//             </Container>
//         </header>
//     )
// }

// export default Header

// app/components/Header.tsx

import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu"
import { getServerUser } from "@/lib/auth"

export default async function Header() {
    const session = await getServerUser()
    return (
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <Link href="/" className="mr-4 flex items-center space-x-2">
            <span className="font-bold">Qollective</span>
          </Link>
          <NavigationMenu>
            <NavigationMenuList className="gap-3">
              {session?.user && (
                <>
                  <NavigationMenuItem>
                    <Button asChild>
                      <Link href="/qbanks/create">Create Qbank</Link>
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Avatar>
                      <AvatarImage src="/avatar.png" alt="User Avatar" />
                      <AvatarFallback>
                        {session.user.email?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <form action="/api/auth/logout" method="POST">
                      <Button variant="outline">Sign Out</Button>
                    </form>
                  </NavigationMenuItem>
                </>
              )}
              {!session?.user && (
                <>
                  <NavigationMenuItem>
                    <Button asChild variant="ghost">
                      <Link href="/login">Login</Link>
                    </Button>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>
    );
}