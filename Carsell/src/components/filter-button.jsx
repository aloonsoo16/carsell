"use client";

import { useSheet } from "@/context/sheet-provider";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

export default function FilterButton() {
  const { setOpenSheet } = useSheet();

  return (
    <Button
      variant="secondary"
      onClick={() => setOpenSheet(true)}
      className="rounded-full text-xs md:text-sm font-semibold"
    >
      Abrir filtros
      <SquareArrowOutUpRight size={12} />
    </Button>
  );
}
