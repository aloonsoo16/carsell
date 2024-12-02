"use client";

import { Github, Linkedin, LogIn } from "lucide-react";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { SidebarMenu } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/toggle-mode";
import Link from "next/link";

export default function LoginFooter() {
  return (
    <SidebarMenu>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() =>
            window.open("https://github.com/aloonsoo16/carsell", "_blank")
          }
        >
          <Github />
          Repositorio del proyecto
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem
          onClick={() =>
            window.open("https://www.linkedin.com/in/alonsomangas/", "_blank")
          }
        >
          <Linkedin />
          LinkedIn de Alonso
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="mt-2 ms-2 text-sm flex py-2">
          <div className="flex justify-center-items-center w-full">Tema</div>
          <ModeToggle />
        </div>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LogIn />
        <Link href="/auth/login" className="w-full text-left">
          Iniciar sesión
        </Link>
      </DropdownMenuItem>
    </SidebarMenu>
  );
}
