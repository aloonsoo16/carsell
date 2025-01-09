"use client"; 

import { toast } from "sonner"; 
import { Button } from "@/components/ui/button"; 
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CustomAlertDialog from "@/components/custom-alert";
import { Loader2 } from "lucide-react"; 

export default function DeleteButton({ vehicle, onError, onSuccess }) {
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [currentToastId, setCurrentToastId] = useState(null); // Manejo de ID de toast
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vehicle/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: vehicle.id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (currentToastId) {
          toast.dismiss(currentToastId);
        }
        const newToastId = toast.error(`Error: ${errorData.error}`);
        setCurrentToastId(newToastId);
        return;
      }

      const data = await res.json();
      const currentDate = new Date().toLocaleString();
      if (currentToastId) {
        toast.dismiss(currentToastId);
      }
      const newToastId = toast.success(`${data.message}\n${currentDate}`);
      setCurrentToastId(newToastId);
      router.refresh();
    } catch (err) {
      console.error("Error:", err);
      if (currentToastId) {
        toast.dismiss(currentToastId);
      }
      const newToastId = toast.error("No se ha podido eliminar el vehículo");
      setCurrentToastId(newToastId);
    } finally {
      setLoading(false); // Detener la animación de carga
      setAlertDialogOpen(false); // Cerrar el dialog
    }
  };

  return (
    <>
      <Button variant="ghost" className="flex  items-start px-2" onClick={() => setAlertDialogOpen(true)}>
        Eliminar definitivamente
      </Button>
      <CustomAlertDialog
        open={alertDialogOpen}
        onOpenChange={setAlertDialogOpen}
        title="¿Estás seguro?"
        description="No podrás deshacer esta acción"
        onConfirm={handleDelete}
        confirmButtonText={
          loading ? <Loader2 className="animate-spin" /> : "Eliminar"
        } // Muestra el icono de carga cuando loading es true
        confirmButtonDisabled={loading} 
        cancelButtonText="Cancelar"
      />
    </>
  );
}
