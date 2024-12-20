"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowUpDown, MoreHorizontal, Loader2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ActionCell } from "./action-cell";

const CellWithLoader = ({ isLoading, children }) => (
  <div className="flex items-center">
    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
  </div>
);

export function useColumns() {
  const router = useRouter();
  const [currentToastId, setCurrentToastId] = React.useState(null);
  const [loadingId, setLoadingId] = React.useState(null);

  const handleChangeStatus = React.useCallback(
    async (vehicleId) => {
      setLoadingId(vehicleId);
      try {
        const res = await fetch("/api/vehicle/state", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: vehicleId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (currentToastId) toast.dismiss(currentToastId);
          const newToastId = toast.error(`Error: ${errorData.error}`);
          setCurrentToastId(newToastId);
          return;
        }

        const data = await res.json();
        if (currentToastId) toast.dismiss(currentToastId);
        const newToastId = toast.success(data.message);
        setCurrentToastId(newToastId);
        router.refresh();
      } catch (err) {
        console.error("Error:", err);
        if (currentToastId) toast.dismiss(currentToastId);
        const newToastId = toast.error(
          "No se ha podido cambiar el estado del vehículo"
        );
        setCurrentToastId(newToastId);
      } finally {
        setLoadingId(null);
      }
    },
    [currentToastId, router]
  );

  const handleDelete = React.useCallback(
    async (vehicleId) => {
      setLoadingId(vehicleId);
      try {
        const res = await fetch("/api/vehicle/delete", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: vehicleId }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          if (currentToastId) toast.dismiss(currentToastId);
          const newToastId = toast.error(`Error: ${errorData.error}`);
          setCurrentToastId(newToastId);
          return;
        }

        const data = await res.json();
        const currentDate = new Date().toLocaleString();
        if (currentToastId) toast.dismiss(currentToastId);
        const newToastId = toast.success(`${data.message}\n${currentDate}`);
        setCurrentToastId(newToastId);
        router.refresh();
      } catch (err) {
        console.error("Error:", err);
        if (currentToastId) toast.dismiss(currentToastId);
        const newToastId = toast.error("No se ha podido eliminar el vehículo");
        setCurrentToastId(newToastId);
      } finally {
        setTimeout(() => setLoadingId(null), 2000);
      }
    },
    [currentToastId, router]
  );

  return React.useMemo(
    () => [
      {
        accessorKey: "status",
        headerText: "estado",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Estado
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const vehicle = row.original;
          return (
            <CellWithLoader isLoading={loadingId === vehicle.id}>
              <Badge
                variant="outline"
                className={`rounded-full ${
                  vehicle.status === "Activo"
                    ? "text-active hover:text-active hover:cursor-default"
                    : vehicle.status === "Inactivo"
                    ? "text-inactive hover:text-inactive hover:cursor-default"
                    : ""
                }`}
              >
                {vehicle.status}
              </Badge>
            </CellWithLoader>
          );
        },
      },
      {
        accessorKey: "brand",
        headerText: "marca",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Marca
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const vehicle = row.original;
          return <>{vehicle.brand}</>;
        },
      },
      {
        accessorKey: "model",
        headerText: "modelo",
        header: "Modelo",
        cell: ({ row }) => {
          const vehicle = row.original;
          return <>{vehicle.model}</>;
        },
      },
      {
        accessorKey: "versión",
        headerText: "versión",
        header: "Versión",
        cell: ({ row }) => {
          const vehicle = row.original;
          return <>{vehicle.version}</>;
        },
      },
      {
        accessorKey: "date",
        headerText: "fecha",
        header: "Fecha",
        cell: ({ row }) => {
          const vehicle = row.original;
          return (
            <>
              <span className="text-muted-foreground italic">
                {vehicle.date}
              </span>
            </>
          );
        },
      },
      {
        id: "actions",
        headerText: "acciones",
        cell: ({ row }) => {
          const vehicle = row.original;
          return (
            <ActionCell
              vehicle={vehicle}
              onChangeStatus={handleChangeStatus}
              onDelete={handleDelete}
              isLoading={loadingId === vehicle.id}
            />
          );
        },
      },
    ],
    [handleChangeStatus, handleDelete, loadingId]
  );
}

export function Columns({ children }) {
  const columns = useColumns();
  return children(columns);
}
