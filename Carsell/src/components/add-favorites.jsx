"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 

export default function AddFavorites() {
  return (
    <Link href="/home">
      <Button variant="outline" className="text-sm font-semibold">
        Explorar vehículos
      </Button>
    </Link>
  );
}
