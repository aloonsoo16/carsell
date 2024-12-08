"use client";

import { signOut } from "next-auth/react";
import { LogOut, Github, Linkedin } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu } from "@/components/ui/sidebar";
import CustomAlertDialog from "@/components/custom-alert";

import React, { useState } from "react";
import { ModeToggle } from "@/components/toggle-mode";

export default function UserFooter() {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setAlertDialogOpen(true);
  };

  const handleContinue = () => {
    signOut();
    setAlertDialogOpen(false);
  };

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
      <DropdownMenuItem onClick={handleLogoutClick}>
        <LogOut />
        Cerrar sesión
      </DropdownMenuItem>
      <CustomAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title="¿Quieres cerrar sesion?"
        description="Perderás el acceso completo al cerrar la sesión."
        onConfirm={handleContinue}
        confirmButtonText="Cerrar sesión"
        cancelButtonText="Cancelar"
      />
    </SidebarMenu>
  );
}
