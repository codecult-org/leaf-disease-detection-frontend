'use client';
import React, { useState } from "react";
import { HoveredLink, Menu, MenuItem, ProductItem } from "./ui/navbar-menu";
import { cn } from "@/lib/utils";

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className={cn("fixed top-1 inset-x-0 max-w-2xl mx-auto z-50", className)}>
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="Leaf disease detection">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/web-dev">Github repo link</HoveredLink>
            <HoveredLink href="/interface-design">Contributors</HoveredLink>
          </div>
        </MenuItem>
        </Menu>
      </div>
  )
}

export default Navbar