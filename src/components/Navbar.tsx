"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Logo from "@/images/amcat-logo.svg";
import { useMiddlecat } from "middlecat-react";
import AuthForm from "./AuthForm";

const Navbar = () => {
  const { user, loading, signIn, signOut, fixedResource } = useMiddlecat();

  return (
    <div
      className={`relative flex h-full items-center justify-between  border-b-[1px] border-gray-200 bg-white px-4 lg:justify-start`}
    >
      <div className="">
        <Logo />
      </div>
      <AuthForm />
    </div>
  );
};

export default Navbar;
