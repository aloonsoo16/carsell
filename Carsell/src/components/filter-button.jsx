"use client";

import { useSheet } from "@/context/sheet-provider";
import { Button } from "@/components/ui/button";

export default function FilterButton() {
  const { setOpenSheet } = useSheet();

  return (
    <Button
      variant="default"
      onClick={() => setOpenSheet(true)}
      className="rounded-full text-xs md:text-sm"
    >
      Abrir filtros
    </Button>
  );
}
