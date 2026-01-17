import React, { FC } from "react";
import Logo from "@/shared/Logo";
import MenuBar from "@/shared/MenuBar";
import NotifyDropdown from "./NotifyDropdown";
import AvatarDropdown from "./AvatarDropdown";
import HeroSearchForm2MobileFactory from "../(HeroSearchForm2Mobile)/HeroSearchForm2MobileFactory";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";

export interface MainNav2Props {
  className?: string;
}

const MainNav2: FC<MainNav2Props> = ({ className = "" }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <div className={`MainNav2 relative z-10 ${className}`}>
      <div className="px-4 h-20 lg:container flex justify-between items-center">
        <div className="flex items-center space-x-8 flex-1">
          <Logo className="w-24 self-center" />
        </div>
      {user && (
  <nav className="hidden md:flex items-center space-x-5 text-gray-700 font-medium">
    {user.role === "Admin" && (
      <>
        <Link
          href="/events/eventList"
          className="hover:text-primary-500 transition-colors"
        >
          Events
        </Link>

        <Link
          href="/ticket-type/ticketTypeList"
          className="hover:text-primary-500 transition-colors"
        >
          Ticket Type
        </Link>
      </>
    )}

    <Link
      href="/bookings"
      className="hover:text-primary-500 transition-colors"
    >
      Booking
    </Link>

  </nav>
)}

        <div className="flex items-center space-x-4">
          <NotifyDropdown />
          <AvatarDropdown />
          <div className="lg:hidden">
            <MenuBar />
          </div>
        </div>
        <div className="self-center lg:hidden flex-[3] max-w-lg !mx-auto md:px-3">
          <HeroSearchForm2MobileFactory />
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
