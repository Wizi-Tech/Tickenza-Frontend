"use client";
import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Avatar from "@/shared/Avatar";
import SwitchDarkMode2 from "@/shared/SwitchDarkMode2";
import Link from "next/link";
import Button from "@/shared/Button";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

interface Props {
  className?: string;
}

export default function AvatarDropdown({ className = "" }: Props) {
  const router = useRouter();
  const { user, clearUser } = useAuthStore();

  if (!user) {
    return (
      <div className="flex gap-3">
        <Button
          className="bg-primary-500 rounded-xl text-white"
          onClick={() => router.push("/signin")}
        >
          Sign In
        </Button>
        <Button
          className="bg-primary-500 rounded-xl text-white"
          onClick={() => router.push("/signup")}
        >
          Sign Up
        </Button>
      </div>
    );
  }

  return (
    <Popover className={`AvatarDropdown relative flex ${className}`}>
      {({ open, close }) => (
        <>
          <Popover.Button
            className="self-center w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Avatar sizeClass="w-8 h-8 sm:w-9 sm:h-9" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 top-full -right-10 sm:right-0 sm:px-0">
              <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                  
                 
                  <div className="flex items-center space-x-3">
                    <Avatar sizeClass="w-12 h-12" />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{user.name}</h4>
                      <p className="text-xs mt-0.5">@{user.username}</p>
                    </div>
                  </div>

                  <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                  <Link href="/account" onClick={() => close()} className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                    My Account
                  </Link>
                  <Link href="/bookings/my" onClick={() => close()} className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                    My Bookings
                  </Link>
                  <Link href="/account-savelists" onClick={() => close()} className="flex items-center p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg">
                    Wishlist
                  </Link>

                  <div className="w-full border-b border-neutral-200 dark:border-neutral-700" />

                  <div className="flex items-center justify-between p-2">
                    <p className="text-sm font-medium">Dark theme</p>
                    <SwitchDarkMode2 />
                  </div>

                  <button
                    onClick={() => {
                      clearUser();
                       setTimeout(() => router.push("/signin"),3);
                      close();
                    }}
                    className="flex items-center p-2 text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
                  >
                    Log out
                  </button>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
