import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CustomAlertDialog from "@/components/custom-alert";
import Link from "next/link";

export function ActionCell({ vehicle, onChangeStatus, onDelete, isLoading }) {
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center justify-center h-8 w-8 cursor-pointer"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuItem>
          <Link
            href={`/vehicle/${vehicle.id}/details`}
            className="flex items-center"
          >
            Ver detalles
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href={`/vehicle/${vehicle.id}/edit`}
            className="flex items-center"
          >
            Editar vehículo
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(vehicle.id)}>
          Cambiar estado a{" "}
          {vehicle.status === "Inactivo" ? "activo" : "inactivo"}
          {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
        </DropdownMenuItem>
        {vehicle.status === "Inactivo" && (
          <DropdownMenuItem
            onPointerDown={(e) => {
              e.stopPropagation();
              setAlertDialogOpen(true);
            }}
          >
            <span className="cursor-pointer">Eliminar definitivamente</span>
          </DropdownMenuItem>
        )}
        <CustomAlertDialog
          open={alertDialogOpen}
          onOpenChange={setAlertDialogOpen}
          title="¿Estás seguro?"
          description="Ya no podrás volver a recuperar tu vehículo si lo eliminas de aquí"
          onConfirm={() => onDelete(vehicle.id)}
          confirmButtonText="Eliminar definitivamente"
          cancelButtonText="Cancelar"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
