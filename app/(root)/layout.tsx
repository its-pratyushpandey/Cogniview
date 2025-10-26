import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <>
      <nav className="nav-header">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            <Image
              src="/logo.png"
              alt="Application logo"
              width={38}
              height={32}
              style={{ width: 'auto', height: 'auto' }}
            />
            <h2>Cogniview</h2>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              AI-Powered Interview Platform
            </span>
          </div>
        </div>
      </nav>
      
      <main className="root-layout">
        {children}
      </main>
    </>
  );
};

export default Layout;
