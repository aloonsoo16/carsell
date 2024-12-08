"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ChevronRight, Loader2 } from "lucide-react";

const DynamicBreadcrumb = () => {
  const pathname = usePathname();
  const [breadcrumbLabel, setBreadcrumbLabel] = useState("");
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState(null);
  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");

  const capitalize = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const fetchVehicleData = useCallback(async (vehicleId, isEdit = false) => {
    try {
      const vehicleRes = await fetch(`/api/vehicleDetails/${vehicleId}`);
      if (!vehicleRes.ok) {
        const data = await vehicleRes.json();
        setMessage(data.error || "Error desconocido al obtener el vehículo");
        return;
      }

      const vehicleData = await vehicleRes.json();
      if (vehicleData.error) {
        setMessage(vehicleData.error);
      } else {
        setVehicle({
          brand: vehicleData.brand,
          model: vehicleData.model,
          version: vehicleData.version,
        });
        setBreadcrumbLabel(
          isEdit ? "Editar vehículo" : "Detalles del vehículo"
        );
      }
    } catch (error) {
      setMessage("Error al obtener los datos del vehículo");
    }
  }, []);

  const fetchUser = useCallback(async (userId) => {
    try {
      const userRes = await fetch(`/api/userDetails/${userId}`);
      if (!userRes.ok) {
        const data = await userRes.json();
        setMessage(data.error || "Error desconocido al obtener el usuario");
        return;
      }

      const user = await userRes.json();
      if (user.error) {
        setMessage(user.error);
      } else {
        const capitalizedUsername = capitalize(user.username);
        setUsername(capitalizedUsername);
        setBreadcrumbLabel(`Anuncios de ${capitalizedUsername}`);
      }
    } catch (error) {
      setMessage("Error al obtener los detalles del usuario");
    }
  }, []);

  const getCustomLabel = (path) => {
    const customLabels = {
      "/home": "Todos los vehículos",
      "/vehicle": "Anuncios",
      "/favorites": "Mis vehículos favoritos",
      "/filter": "Filtrar vehículos",
      "/myads": "Gestiona tus anuncios",
      "/new": "Publicar un anuncio",
    };

    const pathWithoutFirstSegment = "/" + path.split("/").slice(1).join("/");

    return (
      customLabels[pathWithoutFirstSegment] ||
      pathWithoutFirstSegment.split("-").join(" ").toLowerCase()
    );
  };

  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);

    if (pathSegments[0] === "vehicle" && pathSegments.length >= 2) {
      const vehicleId = pathSegments[1];

      if (pathSegments[2] === "details") {
        fetchVehicleData(vehicleId);
      } else if (pathSegments[2] === "edit") {
        fetchVehicleData(vehicleId, true);
      }
    } else if (pathSegments[0] === "vehicles" && pathSegments.length === 2) {
      const userId = pathSegments[1];
      fetchUser(userId);
    } else {
      setBreadcrumbLabel(getCustomLabel(pathname));
    }

    setLoading(false);
  }, [pathname, fetchUser, fetchVehicleData]);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="font-bold text-xs md:text-sm">
            Carsell
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathname !== "/" && (
          <>
            <BreadcrumbSeparator>
              <ChevronRight className="h-4 w-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              {loading ? (
                <BreadcrumbPage>
                  <span className="font-semibold text-xs md:text-sm">
                    Cargando...
                  </span>
                </BreadcrumbPage>
              ) : message ? (
                <BreadcrumbPage className="font-semibold">
                  {message}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbPage className="font-semibold text-xs md:text-sm flex flex-wrap mr-2">
                  {vehicle
                    ? `${breadcrumbLabel}: ${vehicle.brand} ${vehicle.model} ${vehicle.version}`
                    : username
                    ? breadcrumbLabel
                    : breadcrumbLabel || (
                        <span className="font-semibold text-xs md:text-sm">
                          Cargando...
                        </span>
                      )}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DynamicBreadcrumb;
