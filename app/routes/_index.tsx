import { Link } from "@remix-run/react";

import { useOptionalUser } from "~/utils";

export default function Index() {
  const user = useOptionalUser();
  return (
    <>
      <div className="relative shadow-xl sm:overflow-hidden w-full">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover"
            src="https://user-images.githubusercontent.com/1500684/158276318-61064670-06c3-43f3-86e3-d624785b8ff7.jpg"
            alt="Nirvana playing on stage with Kurt's jagstang guitar"
          />
          <div className="absolute inset-0 bg-[color:rgba(255,56,56,0.5)] mix-blend-multiply" />
        </div>
        <div className="relative px-4 pb-8 pt-16 sm:px-6 sm:pb-14 sm:pt-24 lg:px-8 lg:pb-20 lg:pt-32">
          <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl drop-shadow">
            <span className="block uppercase text-red-500 drop-shadow-md">
              Daryl Findlay
            </span>
          </h1>
        </div>
      </div>
      <main className="relative bg-white sm:flex sm:items-center sm:justify-center">
        <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
          {user ? (
            <Link
              to="/notes"
              className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-red-700 shadow-sm hover:bg-red-50 sm:px-8"
            >
              View Notes for {user.email}
            </Link>
          ) : (
            <div className="space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0">
              <Link
                to="/join"
                className="flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-red-700 shadow-sm hover:bg-red-50 sm:px-8"
              >
                Sign up
              </Link>
              <Link
                to="/login"
                className="flex items-center justify-center rounded-md bg-red-500 px-4 py-3 font-medium text-white hover:bg-red-600"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
