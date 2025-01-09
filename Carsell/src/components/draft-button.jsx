"use client"; 

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import CustomAlertDialog from "@/components/custom-alert";
import { toast } from "sonner"; 
import { useRouter } from "next/navigation";

export default function DraftButton({
  vehicle,
  isDraft,
  onError,
  onSuccess,
  buttonText,
  alertDescription,
  alertTitle,
  confirmButtonText,
}) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const router = useRouter();

  const handleChangeState = async () => {
    const newState = isDraft ? "activo" : "borrador"; // Alterna entre "activo" y "borrador"

    try {
      const res = await fetch("/api/vehicle/state", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: vehicle.id, state: newState }), // Cambiar el estado a lo que corresponda
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(`Error: ${errorData.error}`);
        onError(errorData.error);
        return;
      }

      const data = await res.json();
      toast.success(`${data.message}`);
      router.refresh(); // Refresca la página después de realizar la acción
    } catch (err) {
      console.error("Error:", err);
      toast.error("No se ha podido cambiar el estado del vehículo.");
    } finally {
      setAlertDialogOpen(false); // Cierra el dialog
    }
  };

  return (
    <>
      <Button variant="outline" onClick={() => setAlertDialogOpen(true)}>
        {buttonText}
      </Button>

      <CustomAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title={alertTitle}
        description={alertDescription}
        onConfirm={handleChangeState}
        confirmButtonText={confirmButtonText}
        cancelButtonText="Cancelar"
      />
    </>
  );
}
