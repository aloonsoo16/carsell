"use client"; 

import { useState } from "react";
import { Loader2 } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { useRouter } from "next/navigation"; 

export default function CreateButton() {
  const [loading, setLoading] = useState(false); // Estado de carga
  const router = useRouter();

  const handleCreateClick = async () => {
    setLoading(true); // Activar la carga

    // Simular un pequeño retraso 
    await new Promise((resolve) => setTimeout(resolve, 500)); // Retraso de 500ms

    router.push("/new"); // Redirigir a la página de publicar
  };

  return (
    <Button
      onClick={handleCreateClick}
      disabled={loading}
      variant="outline"
      className="font-semibold text-sm" 
    >
      {loading ? (
        <Loader2 className="animate-spin" /> 
      ) : (
        "Publicar un anuncio"
      )}
    </Button>
  );
}
