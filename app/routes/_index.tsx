import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <div className="flex min-h-screen flex-col items-center gap-20 p-6 md:p-12 lg:p-24">
        <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm flex">
          <Link
            className="transition-colors hover:text-sky-400 dark:hover:text-sky-600 hover:underline"
            to="/"
          >
            <img
              className="relative"
              src="/_static/logo.svg"
              alt="Next.js Logo"
              width={48}
              height={28}
            />
          </Link>
          <div className="flex items-center justify-center bg-gradient-to-t lg:static lg:h-auto lg:w-auto lg:bg-none text-white">
            Daryl Findlay
          </div>
        </div>
        <main className="relative flex items-center justify-center flex-col">
          <p className="text-white">A simple note taking app</p>
          <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
            {user ? (
              <Link
                to="/notes"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-100 sm:px-8"
              >
                View Notes for {user.email}
              </Link>
            ) : (
              <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
                <Link
                  to="/join"
                  className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-blue-700 shadow-sm hover:bg-blue-100 sm:px-8"
                >
                  Sign up
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center rounded-md bg-blue-900 px-4 py-3 font-medium text-white hover:bg-blue-800"
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
