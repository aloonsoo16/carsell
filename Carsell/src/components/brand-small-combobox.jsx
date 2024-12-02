"use client";

import * as React from "react";
import {
  CaretSortIcon,
  CheckIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

export function BrandModelSmallCombobox({
  options,
  selectedValues = { models: [], brands: [], versions: [] },
  onSelect,
  placeholder,
  showCount = true,
}) {
  const [open, setOpen] = React.useState(false);
  const [expandedBrand, setExpandedBrand] = React.useState(null);
  const [expandedModel, setExpandedModel] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleSelect = (type, brand, model, version) => {
    const newSelectedValues = { ...selectedValues };

    if (type === "brand") {
      // Si la marca ya está seleccionada, quitamos la selección
      if (newSelectedValues.brands.includes(brand)) {
        newSelectedValues.brands = newSelectedValues.brands.filter(
          (b) => b !== brand
        );
        // También quitamos la selección de todos los modelos de esa marca
        newSelectedValues.models = newSelectedValues.models.filter(
          (m) => !Object.keys(options[brand].models).includes(m)
        );
        // Y quitamos la selección de todas las versiones de esos modelos
        newSelectedValues.versions = newSelectedValues.versions.filter(
          (v) =>
            !Object.values(options[brand].models).some((model) =>
              Object.keys(model.versions).includes(v)
            )
        );
      } else {
        // Si no estaba seleccionada, la seleccionamos
        newSelectedValues.brands.push(brand);
        const models = Object.keys(options[brand].models);
        newSelectedValues.models.push(...models);
        models.forEach((model) => {
          const versions = Object.keys(options[brand].models[model].versions);
          newSelectedValues.versions.push(...versions);
        });
      }
    }

    if (type === "model") {
      // Si el modelo está seleccionado, quitamos la selecicción
      if (newSelectedValues.models.includes(model)) {
        newSelectedValues.models = newSelectedValues.models.filter(
          (m) => m !== model
        );
        // También quitamos la selección de las versiones de ese modelo
        newSelectedValues.versions = newSelectedValues.versions.filter(
          (v) => !Object.keys(options[brand].models[model].versions).includes(v)
        );
      } else {
        // Si el modelo no estaba seleccionado, lo seleccionamos
        newSelectedValues.models.push(model);
        const versions = Object.keys(options[brand].models[model].versions);
        newSelectedValues.versions.push(...versions);

        // Al seleccionar el modelo, aseguramos que la marca también esté seleccionada
        if (!newSelectedValues.brands.includes(brand)) {
          newSelectedValues.brands.push(brand);
        }
      }

      // Si ya no quedan modelos o versiones para esta marca, eliminamos la marca
      if (
        !newSelectedValues.models.some((m) =>
          Object.keys(options[brand].models).includes(m)
        )
      ) {
        newSelectedValues.brands = newSelectedValues.brands.filter(
          (b) => b !== brand
        );
      }
    }

    if (type === "version") {
      // Si la versión ya está seleccionada, quitamos la selección
      if (newSelectedValues.versions.includes(version)) {
        newSelectedValues.versions = newSelectedValues.versions.filter(
          (v) => v !== version
        );
      } else {
        // Si la versión no estaba seleccionada, la seleccionamos
        newSelectedValues.versions.push(version);

        // Al seleccionar una versión, aseguramos que el modelo y la marca también estén seleccionados
        const associatedModel = Object.entries(options).find(
          ([b, { models }]) =>
            Object.entries(models).some(([m, { versions }]) =>
              Object.keys(versions).includes(version)
            )
        );

        if (associatedModel) {
          const [brand, { models }] = associatedModel;
          const model = Object.keys(models).find((m) =>
            Object.keys(models[m].versions).includes(version)
          );

          // Aseguramos que el modelo y la marca también estén seleccionados
          if (!newSelectedValues.models.includes(model)) {
            newSelectedValues.models.push(model);
          }
          if (!newSelectedValues.brands.includes(brand)) {
            newSelectedValues.brands.push(brand);
          }
        }
      }

      // Si ya no quedan versiones para este modelo, eliminamos la selección del modelo
      const modelVersions = Object.keys(options[brand].models[model].versions);
      if (!newSelectedValues.versions.some((v) => modelVersions.includes(v))) {
        newSelectedValues.models = newSelectedValues.models.filter(
          (m) => m !== model
        );
      }

      // Si ya no quedan versiones para esta marca, eliminamos la selección de la marca
      if (
        !newSelectedValues.versions.some((v) =>
          Object.values(options[brand].models).some((model) =>
            Object.keys(model.versions).includes(v)
          )
        )
      ) {
        newSelectedValues.brands = newSelectedValues.brands.filter(
          (b) => b !== brand
        );
      }
    }

    // Después de cada cambio, actualizamos el estado
    onSelect(newSelectedValues);
  };

  const toggleExpansion = (type, value) => {
    if (type === "brand") {
      setExpandedBrand(expandedBrand === value ? null : value);
      setExpandedModel(null); // Cerrar los modelos al cambiar de marca
    } else if (type === "model") {
      setExpandedModel(expandedModel === value ? null : value);
    }
  };

  const handleSelectAllModels = (brand) => {
    const newSelectedValues = { ...selectedValues };
    const models = Object.keys(options[brand].models);
    const versions = models
      .map((model) => Object.keys(options[brand].models[model].versions))
      .flat();

    // Primero eliminamos todos los modelos y versiones seleccionados previamente
    newSelectedValues.models = newSelectedValues.models.filter(
      (model) => !models.includes(model)
    );
    newSelectedValues.versions = newSelectedValues.versions.filter(
      (version) => !versions.includes(version)
    );

    // Ahora seleccionamos todos los modelos de la marca
    newSelectedValues.models.push(...models);

    // Seleccionamos todas las versiones de la marca, si aún no están seleccionadas
    newSelectedValues.versions.push(
      ...versions.filter(
        (version) => !newSelectedValues.versions.includes(version)
      )
    );

    // Asegurarnos de que la marca esté seleccionada
    if (!newSelectedValues.brands.includes(brand)) {
      newSelectedValues.brands.push(brand); // Añadimos la marca al filtro de marcas
    }

    // Actualizamos el estado con los nuevos valores seleccionados
    onSelect(newSelectedValues);
  };

  const isAllModelsSelected = (brand) => {
    const models = Object.keys(options[brand].models);
    return models.every((model) => selectedValues.models.includes(model));
  };

  const handleDeselectAllModels = (brand) => {
    const newSelectedValues = { ...selectedValues };
    const models = Object.keys(options[brand].models);
    const versions = models
      .map((model) => Object.keys(options[brand].models[model].versions))
      .flat();

    // Eliminamos todos los modelos y versiones de la marca
    newSelectedValues.models = newSelectedValues.models.filter(
      (m) => !models.includes(m)
    );
    newSelectedValues.versions = newSelectedValues.versions.filter(
      (v) => !versions.includes(v)
    );

    // También eliminamos la marca si no tiene modelos ni versiones seleccionadas
    if (!newSelectedValues.models.some((m) => models.includes(m))) {
      newSelectedValues.brands = newSelectedValues.brands.filter(
        (b) => b !== brand
      );
    }

    // Actualizamos el estado
    onSelect(newSelectedValues);
  };

  const getDisplayText = () => {
    const { brands, models, versions } = selectedValues;

    // Si no hay marcas, modelos ni versiones seleccionadas, mostrar el placeholder
    if (brands.length === 0 && models.length === 0 && versions.length === 0) {
      return placeholder; // Si no hay nada seleccionado, muestra el placeholder
    }

    // Iteramos sobre las marcas seleccionadas
    const displayText = brands
      .map((brand) => {
        // Verificar que la marca esté en options antes de acceder a sus modelos
        const brandData = options[brand];
        if (!brandData) {
          return null; // Si no existe la marca, simplemente retornamos null
        }
        const brandModels = brandData.models;
        const brandModelKeys = Object.keys(brandModels);

        // Verificamos si todos los modelos de la marca están seleccionados
        const allModelsSelected = brandModelKeys.every((model) =>
          models.includes(model)
        );

        // Analizamos las versiones seleccionadas por modelo
        const modelTexts = brandModelKeys
          .filter((model) => models.includes(model)) // Solo los modelos seleccionados
          .map((model) => {
            const modelVersions = Object.keys(brandModels[model].versions);

            // Filtrar versiones seleccionadas para este modelo
            const selectedModelVersions = modelVersions.filter((version) =>
              versions.includes(version)
            );

            // Caso 1: Todas las versiones del modelo están seleccionadas
            if (selectedModelVersions.length === modelVersions.length) {
              return model; // Mostrar solo el modelo
            }

            // Caso 2: Algunas versiones están seleccionadas
            if (selectedModelVersions.length > 0) {
              return `${model} (${selectedModelVersions.join(", ")})`; // Mostrar modelo con versiones seleccionadas
            }

            return null; // No se seleccionó nada para este modelo
          })
          .filter(Boolean); // Eliminar modelos no seleccionados

        // Caso 1: Si todos los modelos y versiones están seleccionados, mostrar solo la marca
        const allVersionsSelected =
          allModelsSelected &&
          brandModelKeys.every((model) => {
            const modelVersions = Object.keys(brandModels[model].versions);
            return modelVersions.every((version) => versions.includes(version));
          });

        if (allModelsSelected && allVersionsSelected) {
          return brand;
        }

        // Caso 2: Si hay modelos o versiones específicos, mostrarlos
        if (modelTexts.length > 0) {
          return `${brand}: ${modelTexts.join(", ")}`;
        }

        return brand; // Por defecto, solo mostrar la marca
      })
      .join(" | "); // Combinar las marcas con "; " si hay varias

    // Si no hay texto generado, retorna el placeholder
    return displayText || placeholder;
  };

  const CommandContent = () => (
    <Command>
      <CommandInput placeholder={`${placeholder}...`} className="h-9" />
      <CommandList>
        <CommandEmpty>No se encontraron opciones.</CommandEmpty>
        <CommandGroup>
          {Object.entries(options).map(([brand, { count, models }]) => (
            <React.Fragment key={brand}>
              <CommandItem
                value={brand}
                onSelect={() => toggleExpansion("brand", brand)}
                className="flex justify-between items-center cursor-pointer"
              >
                <span>
                  {brand}
                  {showCount && count ? ` (${count})` : " (0)"}
                </span>
                <ChevronRightIcon
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedBrand === brand && "transform rotate-90"
                  )}
                />
              </CommandItem>
              {expandedBrand === brand && (
                <CommandItem
                  value={`Select all ${brand} models`}
                  onSelect={() =>
                    isAllModelsSelected(brand)
                      ? handleDeselectAllModels(brand)
                      : handleSelectAllModels(brand)
                  }
                  className="ml-4 flex justify-between items-center"
                >
                  <span>
                    {isAllModelsSelected(brand)
                      ? "Desmarcar todos los modelos"
                      : "Seleccionar todos los modelos"}
                  </span>
                  <CheckIcon
                    className={cn(
                      "h-4 w-4", // Tamaño básico del ícono
                      isAllModelsSelected(brand) ? "opacity-100" : "opacity-0" // Controla la visibilidad
                    )}
                  />
                </CommandItem>
              )}
              {expandedBrand === brand &&
                Object.entries(models).map(([model, { count, versions }]) => (
                  <div key={model} className="ml-4 border-l pl-2">
                    <CommandItem
                      value={`${brand} ${model}`}
                      onSelect={() => handleSelect("model", brand, model)}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {model}
                        {showCount && count ? ` (${count})` : " (0)"}
                      </span>
                      <CheckIcon
                        className={cn(
                          "h-4 w-4",
                          selectedValues.models.includes(model)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>

                    {selectedValues.models.includes(model) && (
                      <div className="ml-4 border-l pl-2">
                        {Object.keys(versions).map((version) => (
                          <CommandItem
                            key={version}
                            value={version}
                            onSelect={() =>
                              handleSelect("version", brand, model, version)
                            }
                            className="flex justify-between items-center"
                          >
                            <span className="text-muted-foreground text-sm">
                              {version}
                            </span>
                            <CheckIcon
                              className={cn(
                                "h-4 w-4 text-teal-custom",
                                selectedValues.versions.includes(version)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </React.Fragment>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[250px] justify-between text-muted-foreground rounded-full"
          >
            <p className="truncate">{getDisplayText()}</p>
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[100dvh] max-h-[100dvh]">
          <SheetHeader>
            <SheetTitle>{placeholder}</SheetTitle>
            <SheetDescription>
              Selecciona las opciones que desees.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 h-full">
            <CommandContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between text-muted-foreground rounded-full"
        >
          <p className="truncate">{getDisplayText()}</p>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <CommandContent />
      </PopoverContent>
    </Popover>
  );
}
