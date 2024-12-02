"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Minimize2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import vehicleData from "@/json/vehicle-data.json";
import { useIsMobile } from "@/hooks/use-mobile";

const formFields = [
  {
    name: "brand",
    label: "Marca",
    type: "select",
    options: ["Audi", "BMW"],
    placeholder: "Selecciona una marca",
    error: "Debes seleccionar una marca",
  },
  {
    name: "model",
    label: "Modelo",
    type: "select",
    placeholder: "Selecciona un modelo",
    error: "Debes seleccionar un modelo",
  },
  {
    name: "bodyType",
    label: "Tipo de carrocería",
    type: "select",
    placeholder: "Selecciona un tipo de carrocería",
    error: "Debes seleccionar un tipo de carrocería",
  },
  {
    name: "doors",
    label: "Número de puertas",
    type: "select",
    placeholder: "Indica el número de puertas",
    error: "Debes indicar el número de puertas",
  },
  {
    name: "seats",
    label: "Número de asientos",
    type: "select",
    placeholder: "Indica el número de asientos",
    error: "Debes indicar el número de asientos",
  },
  {
    name: "fuelType",
    label: "Combustible",
    type: "select",
    placeholder: "Selecciona el tipo de combustible",
    error: "Debes seleccionar el tipo de combustible",
  },
  {
    name: "year",
    label: "Año de fabricacion",
    type: "select",
    placeholder: "Selecciona el año de fabricación del vehículo",
    error: "Debes seleccionar el año de fabricación",
  },
  {
    name: "version",
    label: "Versión",
    type: "select",
    placeholder: "Selecciona una versión",
    error: "Debes seleccionar una versión",
  },
  {
    name: "displacement",
    label: "Cilindrada (cc)",
    type: "select",
    placeholder: "Indica la cilindrada",
    error: "Debes indicar la cilindrada",
  },
  {
    name: "power",
    label: "Potencia (cv)",
    type: "select",
    placeholder: "Indica la potencia",
    error: "Debes indicar la potencia",
  },
  {
    name: "traction",
    label: "Tracción",
    type: "select",
    placeholder: "Selecciona una tracción",
    error: "Debes seleccionar una tracción",
  },
  {
    name: "price",
    label: "Precio",
    type: "number",
    placeholder: "Indica el precio",
    error: "Debes indicar el precio",
  },
  {
    name: "province",
    label: "Provincia",
    type: "select",
    options: {
      Andalucía: [
        "Almería",
        "Cadiz",
        "Córdoba",
        "Granada",
        "Huelva",
        "Jaén",
        "Málaga",
        "Sevilla",
      ],
      Aragón: ["Huesca", "Teruel", "Zaragoza"],
      "Principado de Asturias": ["Asturias"],
      "Illes Balears": ["Baleares"],
      Canarias: ["Las Palmas", "Sta. C. Tenerife"],
      Cantabria: ["Cantabria"],
      "Castilla La Mancha": [
        "Albacete",
        "Ciudad Real",
        "Cuenca",
        "Guadalajara",
        "Toledo",
      ],
      "Castilla y León": [
        "Ávila",
        "Burgos",
        "León",
        "Palencia",
        "Salamanca",
        "Segovia",
        "Valladolid",
        "Zamora",
      ],
      Catalunya: ["Barcelona", "Girona", "Lleida", "Tarragona"],
      "Comunitat Valenciana": ["Alicante", "Castellón", "Valencia"],
      Extremadura: ["Badajoz", "Cáceres"],
      Galicia: ["A Coruña", "Lugo", "Ourense", "Pontevedra"],
      "Comunidad de Madrid": ["Madrid"],
      "Región de Murcia": ["Murcia"],
      "Comunidad Foral de Navarra": ["Navarra"],
      "País Vasco": ["Álava", "Gipúzcua", "Vizcaya"],
      "La Rioja": ["La Rioja"],
      "Ciudades Autónomas": ["Ceuta", "Melilla"],
    },
    placeholder: "Selecciona una provincia",
    error: "Debes seleccionar una provincia",
  },
  {
    name: "kilometers",
    label: "Kilómetros",
    type: "number",
    placeholder: "Indica los kilómetros",
    error: "Debes indicar los kilómetros",
  },

  {
    name: "color",
    label: "Color",
    type: "select",
    options: [
      "Amarillo",
      "Azul",
      "Beige",
      "Blanco",
      "Granate",
      "Gris/Plata",
      "Marrón",
      "Naranja",
      "Negro",
      "Rojo",
      "Rosa",
      "Verde",
      "Violeta/Lila",
    ],
    placeholder: "Selecciona un color",
    error: "Debes seleccionar un color",
  },
  {
    name: "transmission",
    label: "Cambio",
    type: "button",
    options: ["Manual", "Automático"],
    placeholder: "Selecciona un tipo de cambio",
    error: "Debes seleccionar un tipo de cambio",
  },
  {
    name: "label",
    label: "Etiqueta",
    type: "select",
    options: [
      "Etiqueta CERO (azul)",
      "Etiqueta ECO (azul/verde)",
      "Etiqueta C (verde)",
      "Etiqueta B (amarilla)",
      "Sin etiqueta",
    ],
    placeholder: "Selecciona una etiqueta",
    error: "Debes seleccionar una etiqueta",
  },
  {
    name: "features",
    label: "Equipamiento adicional",
    type: "select",
    options: [
      "Techo solar",
      "Cuero",
      "Navegador",
      "ISOFIX",
      "Bola de remolque",
      "Faros de xenon",
      "Faros de LED",
      "Cámara de aparcamiento",
      "Bluetooth",
      "Aire acondicionado",
      "Asientos calefactables",
      "Sensor de aparcamiento trasero",
    ],
    placeholder: "Selecciona equipamiento adicional",
  },

  {
    name: "comment",
    label: "Comentario",
    type: "text",
    placeholder:
      "¿Ha pasado la última ITV?. ¿En que estado se encuentra? ¿Eres el único propietario?",
    required: false,
  },
];

export default function NewVehicle({ vehicle }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [currentToastId, setCurrentToastId] = useState(null);
  const [message, setMessage] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(vehicle?.brand || "");
  const [selectedModel, setSelectedModel] = useState(vehicle?.model || "");
  const [selectedVersion, setSelectedVersion] = useState(
    vehicle?.version || ""
  );
  const [selectedBodyType, setSelectedBodyType] = useState(
    vehicle?.bodyType || ""
  );
  const [selectedFuelType, setSelectedFuelType] = useState(
    vehicle?.fuelType || ""
  );
  const [selectedYear, setSelectedYear] = useState(vehicle?.year || "");
  const [selectedTransmission, setSelectedTransmission] = useState(
    vehicle?.transmission || ""
  );
  const [selectedLabel, setSelectedLabel] = useState(vehicle?.label || "");
  const [selectedDoors, setSelectedDoors] = useState(vehicle?.doors || "");
  const [selectedDisplacement, setSelectedDisplacement] = useState(
    vehicle?.displacement || ""
  );
  const [selectedTraction, setSelectedTraction] = useState(
    vehicle?.traction || ""
  );
  const [selectedColor, setSelectedColor] = useState(vehicle?.color || "");
  const [selectedPower, setSelectedPower] = useState(vehicle?.power || "");
  const [selectedSeats, setSelectedSeats] = useState(vehicle?.seats || "");
  const [selectedProvince, setSelectedProvince] = useState(
    vehicle?.province || ""
  );
  const [selectedFeatures, setSelectedFeatures] = useState(
    Array.isArray(vehicle?.features) ? vehicle.features : []
  );

  const [inputValues, setInputValues] = useState({});
  const isEditing = Boolean(vehicle);
  const isMobile = useIsMobile();

  const {
    models,
    bodyTypes,
    doorsNumber,
    seatsNumber,
    fuelTypes,
    years,
    versions,
    displacements,
    tractions,
    powers,
  } = vehicleData;

  const handleBrandChange = (value) => {
    setSelectedBrand(value);
    setSelectedModel("");
    setSelectedVersion("");
    setSelectedBodyType("");
    setSelectedFuelType("");
    setSelectedYear("");
    setSelectedDoors("");
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedPower("");
    setSelectedSeats("");
  };

  const handleModelChange = (value) => {
    setSelectedModel(value);
    setSelectedVersion("");
    setSelectedBodyType("");
    setSelectedFuelType("");
    setSelectedYear("");
    setSelectedDoors("");
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedPower("");
    setSelectedSeats("");
  };

  const handleBodyTypeChange = (value) => {
    setSelectedBodyType(value);
    setSelectedFuelType("");
    setSelectedYear("");
    setSelectedVersion("");
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedPower("");
    setSelectedSeats("");
    setSelectedDoors("");
  };

  const handleFuelTypeChange = (value) => {
    setSelectedFuelType(value);
    setSelectedYear("");
    setSelectedVersion("");
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedPower("");
  };

  const handleYearChange = (value) => {
    setSelectedYear(value);
    setSelectedVersion("");
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedPower("");
  };

  const handleVersionChange = (value) => {
    setSelectedVersion(value);
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedPower("");
  };

  const handleTransmissionChange = (value) => {
    setSelectedTransmission(value);
  };

  const handleLabelChange = (value) => {
    setSelectedLabel(value);
  };

  const handleDoorsChange = (value) => {
    setSelectedDoors(value);
  };

  const handleDisplacementChange = (value) => {
    setSelectedDisplacement(value);
  };

  const handleTractionChange = (value) => {
    setSelectedTraction(value);
  };

  const handleColorChange = (value) => {
    setSelectedColor(value);
  };

  const handlePowerChange = (value) => {
    setSelectedPower(value);
  };

  const handleSeatsChange = (value) => {
    setSelectedSeats(value);
  };

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
  };

  const handleFeaturesChange = (feature) => {
    setSelectedFeatures((prevSelected) => {
      // Verifica que prevSelected sea un array
      if (!Array.isArray(prevSelected)) {
        prevSelected = [];
      }

      if (prevSelected.includes(feature)) {
        // Si la opción ya está seleccionada, deseleccionarla
        return prevSelected.filter((item) => item !== feature);
      } else {
        // Si la opción no está seleccionada, agregarla al array
        return [...prevSelected, feature];
      }
    });
  };

  //Si solo hay una opcion para seleccionar se selecciona automaticamente (teniendo en cuenta las respectivas selecciones de las que depende cada respectivo campo )

  useEffect(() => {
    if (selectedBrand) {
      const availableModels = models[selectedBrand] || [];
      if (availableModels.length === 1) {
        setSelectedModel(availableModels[0]);
      }
    }
  }, [selectedBrand, models]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      const availableBodyTypes =
        bodyTypes[selectedBrand]?.[selectedModel] || [];
      if (availableBodyTypes.length === 1) {
        setSelectedBodyType(availableBodyTypes[0]);
      }
    }
  }, [selectedBrand, selectedModel, bodyTypes]);

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedBodyType) {
      const availableDoors =
        doorsNumber[selectedBrand]?.[selectedModel]?.[selectedBodyType] || [];
      if (availableDoors.length === 1) {
        setSelectedDoors(availableDoors[0]);
      }
    }
  }, [selectedBrand, selectedModel, selectedBodyType, doorsNumber]);

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedBodyType) {
      const availableSeats =
        seatsNumber[selectedBrand]?.[selectedModel]?.[selectedBodyType] || [];
      if (availableSeats.length === 1) {
        setSelectedSeats(availableSeats[0]);
      }
    }
  }, [selectedBrand, selectedModel, selectedBodyType, seatsNumber]);

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedBodyType && selectedDoors) {
      const availableFuelTypes =
        fuelTypes[selectedBrand]?.[selectedModel]?.[selectedBodyType]?.[
          selectedDoors
        ] || [];
      if (availableFuelTypes.length === 1) {
        setSelectedFuelType(availableFuelTypes[0]);
      }
    }
  }, [
    selectedBrand,
    selectedModel,
    selectedBodyType,
    selectedDoors,
    fuelTypes,
  ]);

  useEffect(() => {
    if (
      selectedBrand &&
      selectedModel &&
      selectedBodyType &&
      selectedDoors &&
      selectedFuelType
    ) {
      const availableYears =
        years[selectedBrand]?.[selectedModel]?.[selectedBodyType]?.[
          selectedDoors
        ]?.[selectedFuelType] || [];
      if (availableYears.length === 1) {
        setSelectedYear(availableYears[0]);
      }
    }
  }, [
    selectedBrand,
    selectedModel,
    selectedBodyType,
    selectedDoors,
    selectedFuelType,
    years,
  ]);

  useEffect(() => {
    if (
      selectedBrand &&
      selectedModel &&
      selectedBodyType &&
      selectedDoors &&
      selectedFuelType &&
      selectedYear
    ) {
      const availableVersions =
        versions[selectedBrand]?.[selectedModel]?.[selectedBodyType]?.[
          selectedDoors
        ]?.[selectedFuelType]?.[selectedYear] || [];
      if (availableVersions.length === 1) {
        setSelectedVersion(availableVersions[0]);
      }
    }
  }, [
    selectedBrand,
    selectedModel,
    selectedBodyType,
    selectedDoors,
    selectedFuelType,
    selectedYear,
    versions,
  ]);

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedVersion) {
      const availableDisplacements =
        displacements[selectedBrand]?.[selectedModel]?.[selectedVersion] || [];
      if (availableDisplacements.length === 1) {
        setSelectedDisplacement(availableDisplacements[0]);
      }
    }
  }, [selectedBrand, selectedModel, selectedVersion, displacements]);

  useEffect(() => {
    if (
      selectedBrand &&
      selectedModel &&
      selectedFuelType &&
      selectedYear &&
      selectedVersion
    ) {
      const availablePowers =
        powers[selectedBrand]?.[selectedModel]?.[selectedBodyType]?.[
          selectedDoors
        ]?.[selectedFuelType]?.[selectedYear]?.[selectedVersion] || [];
      if (availablePowers.length === 1) {
        setSelectedPower(availablePowers[0]);
      }
    }
  }, [
    selectedBrand,
    selectedModel,
    selectedBodyType,
    selectedDoors,
    selectedFuelType,
    selectedYear,
    selectedVersion,
    powers,
  ]);

  useEffect(() => {
    if (selectedBrand && selectedModel && selectedVersion) {
      const availableTractions =
        tractions[selectedBrand]?.[selectedModel]?.[selectedVersion] || [];
      if (availableTractions.length === 1) {
        setSelectedTraction(availableTractions[0]);
      }
    }
  }, [selectedBrand, selectedModel, selectedVersion, tractions]);

  useEffect(() => {
    if (vehicle) {
      setInputValues({
        price: vehicle.price || "",
        kilometers: vehicle.kilometers || "",
        comment: vehicle.comment || "",
        color: vehicle.color || "",
      });
    }
  }, [vehicle]);

  useEffect(() => {
    if (vehicle?.features) {
      const featuresArray =
        typeof vehicle.features === "string"
          ? vehicle.features.split(", ")
          : vehicle.features;
      setSelectedFeatures(featuresArray);
    }
  }, [vehicle]);

  const resetFilters = () => {
    setSelectedBrand("");
    setSelectedModel("");
    setSelectedVersion("");
    setSelectedBodyType("");
    setSelectedFuelType("");
    setSelectedYear("");
    setSelectedTransmission("");
    setSelectedLabel("");
    setSelectedDoors("");
    setSelectedDisplacement("");
    setSelectedTraction("");
    setSelectedColor("");
    setSelectedPower("");
    setSelectedSeats("");
    setSelectedProvince("");
    setSelectedFeatures("");
    setInputValues({});
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.target);
    const newFieldErrors = {};

    // Verificar que campos son nrequeridos para incluirlos en el toast con los missingfields
    formFields.forEach(({ name, error, required }) => {
      const value = formData.get(name);
      if (
        (required && !value) ||
        (name === "brand" && !isEditing && !selectedBrand) ||
        (name === "model" && !selectedModel) ||
        (name === "bodyType" && !selectedBodyType) ||
        (name === "doors" && !selectedDoors) ||
        (name === "fuelType" && !selectedFuelType) ||
        (name === "year" && !selectedYear) ||
        (name === "version" && !selectedVersion) ||
        (name === "displacement" && !selectedDisplacement) ||
        (name === "power" && !selectedPower) ||
        (name === "traction" && !selectedTraction) ||
        (name === "color" && !selectedColor) ||
        (name === "label" && !selectedLabel) ||
        (name === "seats" && !selectedSeats) ||
        (name === "province" && !selectedProvince) ||
        (name === "transmission" && !selectedTransmission) ||
        (name === "kilometers" &&
          (!value || isNaN(Number(value)) || Number(value) <= 0)) ||
        (name === "price" &&
          (!value || isNaN(Number(value)) || Number(value) <= 0))
      ) {
        newFieldErrors[name] = error;
      }
    });

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);

      const missingFields = Object.keys(newFieldErrors)
        .map((field) => {
          const fieldConfig = formFields.find((f) => f.name === field);
          return fieldConfig ? ` - ${fieldConfig.label}` : ` - ${field}`;
        })
        .filter(Boolean)
        .join("\n");

      if (currentToastId) {
        toast.dismiss(currentToastId);
      }
      const newToastId = toast(
        `Faltan por rellenar los siguientes campos:\n${missingFields}`,
        {
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "10px",
            height: "auto",
          },
          duration: Infinity,
          action: {
            label: (
              <div className="flex items-center justify-between gap-x-2 ">
                <Minimize2 className="h-4 w-4" />
                Cerrar
              </div>
            ),
            style: {
              marginTop: "10px",
              color: "#ffffff",
              backgroundColor: "#ff0000",
              border: "none",
              cursor: "pointer",
            },
          },
        }
      );

      setCurrentToastId(newToastId);
      setLoading(false);
      return;
    }

    try {
      const method = vehicle ? "PUT" : "POST";
      const featuresString = selectedFeatures.join(", ");

      formData.set("features", featuresString);

      const body = vehicle
        ? new URLSearchParams({
            ...Object.fromEntries(formData),
            id: vehicle.id,
          })
        : formData;

      const res = await fetch(`/api/vehicle/${vehicle ? "edit" : "create"}`, {
        method,
        body,
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error);

        if (currentToastId) {
          toast.dismiss(currentToastId);
        }

        const newToastId = toast(`Error: ${errorData.error}`);
        setCurrentToastId(newToastId);
        setLoading(false);
        return;
      }

      const result = await res.json();
      setMessage(result.message);

      if (currentToastId) {
        toast.dismiss(currentToastId);
      }

      if (!vehicle) {
        const newToastId = toast.success(result.message, {});
        setCurrentToastId(newToastId);

        router.push("/myads");
      } else {
        const newToastId = toast.success(result.message, {});
        setCurrentToastId(newToastId);
        const formDataObj = Object.fromEntries(formData);
        const isEdited = Object.keys(formDataObj).some((key) => {
          return formDataObj[key] !== vehicle[key];
        });

        if (isEdited) {
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Error:", err);
      if (currentToastId) {
        toast.dismiss(currentToastId);
      }
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentToastId) {
        toast.dismiss(currentToastId);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentToastId]);

  return (
    <form onSubmit={onSubmit} className="w-full">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {vehicle ? "Editar Vehículo" : "Vender Vehículo"}
          </CardTitle>
          <CardDescription>
            {vehicle
              ? "Edita la información de tu vehículo debajo. La marca del vehículo no puede ser editada. Si lo consideras necesario, crea un nuevo anuncio."
              : "Si quieres vender un vehículo, rellena este formulario. Por el momento solo se pueden publicar anuncios de las marcas Audi y BMW, con algunos modelos disponibles."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:grid md:grid-flow-row-dense md:grid-cols-3 gap-4">
            {formFields.map(({ name, label, type, options }) => {
              if (name === "brand") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label htmlFor={name}>{label}</Label>
                    {isEditing && (
                      <input type="hidden" name="brand" value={selectedBrand} />
                    )}
                    <Select
                      name={name}
                      value={selectedBrand}
                      onValueChange={handleBrandChange}
                      disabled={isEditing}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate text-muted-foreground">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.sort().map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "model") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedModel}
                      onValueChange={handleModelChange}
                      disabled={!selectedBrand}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {(models[selectedBrand] || []).map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "bodyType") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedBodyType}
                      onValueChange={handleBodyTypeChange}
                      disabled={!selectedModel}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {bodyTypes[selectedBrand] &&
                        bodyTypes[selectedBrand][selectedModel]
                          ? bodyTypes[selectedBrand][selectedModel].map(
                              (bodyType) => (
                                <SelectItem key={bodyType} value={bodyType}>
                                  {bodyType}
                                </SelectItem>
                              )
                            )
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "doors") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={String(selectedDoors)}
                      onValueChange={handleDoorsChange}
                      disabled={!selectedBodyType}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {doorsNumber[selectedBrand] &&
                        doorsNumber[selectedBrand][selectedModel] &&
                        doorsNumber[selectedBrand][selectedModel][
                          selectedBodyType
                        ]
                          ? doorsNumber[selectedBrand][selectedModel][
                              selectedBodyType
                            ].map((doors) => (
                              <SelectItem
                                key={String(doors)}
                                value={String(doors)}
                              >
                                {doors}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "seats") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={String(selectedSeats)}
                      onValueChange={handleSeatsChange}
                      disabled={!selectedBodyType}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {seatsNumber[selectedBrand] &&
                        seatsNumber[selectedBrand][selectedModel] &&
                        seatsNumber[selectedBrand][selectedModel][
                          selectedBodyType
                        ]
                          ? seatsNumber[selectedBrand][selectedModel][
                              selectedBodyType
                            ].map((seat) => (
                              <SelectItem
                                key={String(seat)}
                                value={String(seat)}
                              >
                                {seat}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "fuelType") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedFuelType}
                      onValueChange={handleFuelTypeChange}
                      disabled={!selectedSeats}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {fuelTypes[selectedBrand] &&
                        fuelTypes[selectedBrand][selectedModel] &&
                        fuelTypes[selectedBrand][selectedModel][
                          selectedBodyType
                        ] &&
                        fuelTypes[selectedBrand][selectedModel][
                          selectedBodyType
                        ][selectedDoors]
                          ? fuelTypes[selectedBrand][selectedModel][
                              selectedBodyType
                            ][selectedDoors].map((fuelType) => (
                              <SelectItem
                                key={String(fuelType)}
                                value={String(fuelType)}
                              >
                                {fuelType}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "year") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={String(selectedYear)}
                      onValueChange={handleYearChange}
                      disabled={!selectedFuelType}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {years[selectedBrand] &&
                        years[selectedBrand][selectedModel] &&
                        years[selectedBrand][selectedModel][selectedBodyType] &&
                        years[selectedBrand][selectedModel][selectedBodyType][
                          selectedDoors
                        ] &&
                        years[selectedBrand][selectedModel][selectedBodyType][
                          selectedDoors
                        ][selectedFuelType]
                          ? years[selectedBrand][selectedModel][
                              selectedBodyType
                            ][selectedDoors][selectedFuelType].map((year) => (
                              <SelectItem
                                key={String(year)}
                                value={String(year)}
                              >
                                {year}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "version") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedVersion}
                      onValueChange={handleVersionChange}
                      disabled={!selectedYear}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {/* Filtrar por marca, modelo, combustible y año */}
                        {versions[selectedBrand] &&
                        versions[selectedBrand][selectedModel] &&
                        versions[selectedBrand][selectedModel][
                          selectedBodyType
                        ] &&
                        versions[selectedBrand][selectedModel][
                          selectedBodyType
                        ][selectedDoors] &&
                        versions[selectedBrand][selectedModel][
                          selectedBodyType
                        ][selectedDoors][selectedFuelType] &&
                        versions[selectedBrand][selectedModel][
                          selectedBodyType
                        ][selectedDoors][selectedFuelType] &&
                        versions[selectedBrand][selectedModel][
                          selectedBodyType
                        ][selectedDoors][selectedFuelType][selectedYear]
                          ? versions[selectedBrand][selectedModel][
                              selectedBodyType
                            ][selectedDoors][selectedFuelType][
                              selectedYear
                            ].map((version) => (
                              <SelectItem key={version} value={version}>
                                {version}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "displacement") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={String(selectedDisplacement)}
                      onValueChange={handleDisplacementChange}
                      disabled={!selectedVersion}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {/* Filtrar por marca, modelo, combustible, año y versión */}
                        {displacements[selectedBrand] &&
                        displacements[selectedBrand][selectedModel] &&
                        displacements[selectedBrand][selectedModel][
                          selectedVersion
                        ]
                          ? displacements[selectedBrand][selectedModel][
                              selectedVersion
                            ].map((displacement) => (
                              <SelectItem
                                key={String(displacement)}
                                value={String(displacement)}
                              >
                                {String(displacement)}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "power") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={String(selectedPower)}
                      onValueChange={handlePowerChange}
                      disabled={
                        !selectedYear ||
                        !selectedFuelType ||
                        !selectedVersion ||
                        !selectedDisplacement
                      }
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {/* Filtrar por marca, modelo, combustible, año y versión */}
                        {powers[selectedBrand] &&
                        powers[selectedBrand][selectedModel] &&
                        powers[selectedBrand][selectedModel][
                          selectedBodyType
                        ] &&
                        powers[selectedBrand][selectedModel][selectedBodyType][
                          selectedDoors
                        ] &&
                        powers[selectedBrand][selectedModel][selectedBodyType][
                          selectedDoors
                        ][selectedFuelType] &&
                        powers[selectedBrand][selectedModel][selectedBodyType][
                          selectedDoors
                        ][selectedFuelType][selectedYear] &&
                        powers[selectedBrand][selectedModel][selectedBodyType][
                          selectedDoors
                        ][selectedFuelType][selectedYear][selectedVersion]
                          ? powers[selectedBrand][selectedModel][
                              selectedBodyType
                            ][selectedDoors][selectedFuelType][selectedYear][
                              selectedVersion
                            ].map((power) => (
                              <SelectItem
                                key={String(power)}
                                value={String(power)}
                              >
                                {power}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "traction") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedTraction}
                      onValueChange={handleTractionChange}
                      disabled={!selectedPower}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {/* Filtrar por marca, modelo, combustible, año y versión */}
                        {tractions[selectedBrand] &&
                        tractions[selectedBrand][selectedModel] &&
                        tractions[selectedBrand][selectedModel][selectedVersion]
                          ? tractions[selectedBrand][selectedModel][
                              selectedVersion
                            ].map((traction) => (
                              <SelectItem key={traction} value={traction}>
                                {traction}
                              </SelectItem>
                            ))
                          : null}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "province") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedProvince}
                      onValueChange={handleProvinceChange}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate text-muted-foreground">
                              {fieldErrors[name] ||
                                formFields.find((field) => field.name === name)
                                  ?.placeholder}
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(options)
                          .sort() // Ordenar las comunidades autónomas alfabéticamente
                          .map((community) => (
                            <SelectGroup key={community}>
                              <SelectLabel className="bg-secondary rounded mt-1 mb-1">
                                {community}
                              </SelectLabel>
                              {options[community]
                                .sort() // Ordenar las provincias dentro de su respectiva comunidad
                                .map((province) => (
                                  <SelectItem key={province} value={province}>
                                    {province}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "color") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedColor}
                      onValueChange={handleColorChange}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate text-muted-foreground">
                              {
                                formFields.find((field) => field.name === name)
                                  ?.placeholder
                              }
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "transmission") {
                return (
                  <div
                    key={name}
                    className="flex flex-col col-span-1 space-y-1.5"
                  >
                    <Label htmlFor={name}>{label}</Label>
                    <div className="flex flex-wrap gap-2 justify-start">
                      {options.sort().map((transmission) => (
                        <Button
                          key={transmission}
                          type="button"
                          variant="outline"
                          onClick={() => handleTransmissionChange(transmission)}
                          className={`px-4 py-2 rounded-md truncate w-full lg:w-auto ${
                            selectedTransmission === transmission
                              ? "bg-secondary rounded-full"
                              : ""
                          }`}
                        >
                          {transmission}
                        </Button>
                      ))}
                    </div>
                    <input
                      type="hidden"
                      name="transmission"
                      value={selectedTransmission}
                    />
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "label") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Select
                      name={name}
                      value={selectedLabel}
                      onValueChange={handleLabelChange}
                    >
                      <SelectTrigger id={name}>
                        <SelectValue
                          placeholder={
                            <p className="truncate text-muted-foreground">
                              {fieldErrors[name] ||
                                formFields.find((field) => field.name === name)
                                  ?.placeholder}
                            </p>
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((label) => (
                          <SelectItem key={label} value={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }

              if (name === "features") {
                const CommandContent = () => (
                  <Command>
                    <CommandInput
                      placeholder={`${
                        formFields.find((field) => field.name === name)
                          ?.placeholder
                      }...`}
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option}
                            value={option}
                            onSelect={() => handleFeaturesChange(option)}
                            className="flex justify-between items-center"
                          >
                            <span>{option}</span>
                            <CheckIcon
                              className={cn(
                                "h-4 w-4",
                                selectedFeatures.includes(option)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                );

                return isMobile ? (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between w-full",
                            selectedFeatures?.length > 0
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          <p className="truncate">
                            {selectedFeatures.length > 0
                              ? selectedFeatures.join(", ")
                              : fieldErrors[name] ||
                                formFields.find((field) => field.name === name)
                                  ?.placeholder}
                          </p>
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent
                        side="bottom"
                        className="h-[100dvh] max-h-[100dvh]"
                      >
                        <SheetHeader>
                          <SheetTitle>{label}</SheetTitle>
                          <SheetDescription>
                            Selecciona las opciones que desees.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-4 h-full">
                          <CommandContent />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                ) : (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Popover open={open} onOpenChange={setOpen} modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between w-full",
                            selectedFeatures?.length > 0
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          <p className="truncate">
                            {selectedFeatures.length > 0
                              ? selectedFeatures.join(", ")
                              : fieldErrors[name] ||
                                formFields.find((field) => field.name === name)
                                  ?.placeholder}
                          </p>
                          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-0">
                        <CommandContent />
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              }

              if (name === "comment") {
                return (
                  <div
                    key={name}
                    className="flex flex-col col-span-3 space-y-1.5 "
                  >
                    <Label htmlFor={name}>{label}</Label>
                    <Textarea
                      className="text-sm"
                      name={name}
                      id={name}
                      type={type}
                      placeholder={
                        formFields.find((field) => field.name === name)
                          ?.placeholder
                      }
                      value={inputValues[name] || ""}
                      onChange={(e) =>
                        setInputValues((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                    />
                    <i className="text-sm text-muted-foreground">
                      Tu mensaje se mostrará en el anuncio. Puedes dejar este
                      comentario vacío
                    </i>
                  </div>
                );
              }

              if (name === "kilometers" || name === "price") {
                return (
                  <div key={name} className="flex flex-col space-y-1.5">
                    <Label className="truncate" htmlFor={name}>
                      {label}
                    </Label>
                    <Input
                      className="truncate"
                      name={name}
                      id={name}
                      type={type}
                      placeholder={
                        formFields.find((field) => field.name === name)
                          ?.placeholder
                      }
                      value={inputValues[name] || ""}
                      onChange={(e) =>
                        setInputValues((prev) => ({
                          ...prev,
                          [name]: e.target.value,
                        }))
                      }
                    />
                    {fieldErrors[name] && (
                      <p className="text-xs text-red-500">
                        {fieldErrors[name]}
                      </p>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-between">
          <div className="flex w-full flex-col xl:flex-row xl:w-full xl:justify-between justify-center gap-2 ">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            {!isEditing && (
              <Button variant="outline" type="button" onClick={resetFilters}>
                Eliminar todos los datos
              </Button>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : vehicle ? (
                "Actualizar"
              ) : (
                "Crear"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
