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
import { useIsMobile } from "@/hooks/use-mobile";

const MemoizedCommandItem = React.memo(
  ({ value, onSelect, children, ...props }) => (
    <CommandItem value={value} onSelect={onSelect} {...props}>
      {children}
    </CommandItem>
  )
);

// Agregar un display name explícito
MemoizedCommandItem.displayName = "MemoizedCommandItem";

export function BrandModelCombobox({
  options,
  selectedValues = { models: [], brands: [] },
  onSelect,
  placeholder,
  showCount = true,
}) {
  const [open, setOpen] = React.useState(false);
  const [expandedBrand, setExpandedBrand] = React.useState(null);
  const isMobile = useIsMobile();

  const handleSelect = React.useCallback(
    (type, brand, model) => {
      onSelect((prevSelectedValues) => {
        const newSelectedValues = { ...prevSelectedValues };

        if (type === "brand") {
          if (newSelectedValues.brands.includes(brand)) {
            newSelectedValues.brands = newSelectedValues.brands.filter(
              (b) => b !== brand
            );
            newSelectedValues.models = newSelectedValues.models.filter(
              (m) => !Object.keys(options[brand].models).includes(m)
            );
          } else {
            newSelectedValues.brands.push(brand);
            const models = Object.keys(options[brand].models);
            newSelectedValues.models.push(...models);
          }
        }

        if (type === "model") {
          if (newSelectedValues.models.includes(model)) {
            newSelectedValues.models = newSelectedValues.models.filter(
              (m) => m !== model
            );
          } else {
            newSelectedValues.models.push(model);
            if (!newSelectedValues.brands.includes(brand)) {
              newSelectedValues.brands.push(brand);
            }
          }

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

        return newSelectedValues;
      });
    },
    [options, onSelect]
  );

  const toggleExpansion = React.useCallback((brand) => {
    setExpandedBrand((prev) => (prev === brand ? null : brand));
  }, []);

  const handleSelectAllModels = React.useCallback(
    (brand) => {
      onSelect((prevSelectedValues) => {
        const newSelectedValues = { ...prevSelectedValues };
        const models = Object.keys(options[brand].models);

        newSelectedValues.models = [
          ...new Set([...newSelectedValues.models, ...models]),
        ];

        if (!newSelectedValues.brands.includes(brand)) {
          newSelectedValues.brands.push(brand);
        }

        return newSelectedValues;
      });
    },
    [onSelect, options]
  );

  const handleDeselectAllModels = React.useCallback(
    (brand) => {
      onSelect((prevSelectedValues) => {
        const newSelectedValues = { ...prevSelectedValues };
        const models = Object.keys(options[brand].models);

        newSelectedValues.models = newSelectedValues.models.filter(
          (model) => !models.includes(model)
        );

        newSelectedValues.brands = newSelectedValues.brands.filter(
          (b) => b !== brand
        );

        return newSelectedValues;
      });
    },
    [onSelect, options]
  );

  const isAllModelsSelected = React.useCallback(
    (brand) => {
      const models = Object.keys(options[brand].models);
      return models.every((model) => selectedValues.models.includes(model));
    },
    [options, selectedValues.models]
  );

  const getDisplayText = React.useMemo(() => {
    const { brands, models } = selectedValues;

    if (brands.length === 0 && models.length === 0) {
      return placeholder; // placeholder utilizado aquí
    }

    const displayText = brands
      .map((brand) => {
        const brandData = options[brand];
        if (!brandData) return null;

        const modelsSelected = Object.keys(brandData.models).filter((model) =>
          models.includes(model)
        );

        if (modelsSelected.length === Object.keys(brandData.models).length) {
          return brand;
        }

        return `${brand}: ${modelsSelected.join(", ")}`;
      })
      .filter(Boolean)
      .join(" | ");

    return displayText || placeholder; // placeholder utilizado aquí también
  }, [selectedValues, options, placeholder]); // Asegúrate de incluir placeholder como dependencia

  const CommandContent = React.useMemo(
    () => (
      <Command>
        <CommandInput placeholder={`${placeholder}...`} className="h-9" />
        <CommandList>
          <CommandEmpty>No se encontraron resultados.</CommandEmpty>
          <CommandGroup>
            {Object.entries(options).map(([brand, { count, models }]) => (
              <React.Fragment key={brand}>
                <MemoizedCommandItem
                  value={brand}
                  onSelect={() => toggleExpansion(brand)}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <span>
                    {brand} {showCount && `(${count})`}
                  </span>
                  <ChevronRightIcon
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedBrand === brand && "transform rotate-90"
                    )}
                  />
                </MemoizedCommandItem>
                {expandedBrand === brand && (
                  <>
                    <MemoizedCommandItem
                      value={`Select all ${brand} models`}
                      onSelect={() =>
                        isAllModelsSelected(brand)
                          ? handleDeselectAllModels(brand)
                          : handleSelectAllModels(brand)
                      }
                      className="ml-4 flex justify-between items-center cursor-pointer"
                    >
                      <span>
                        {isAllModelsSelected(brand)
                          ? "Desmarcar todos los modelos"
                          : "Seleccionar todos los modelos"}
                      </span>
                      <CheckIcon
                        className={cn(
                          "h-4 w-4",
                          isAllModelsSelected(brand)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </MemoizedCommandItem>
                    {Object.keys(models).map((model) => (
                      <div key={model} className="ml-4 border-l pl-2">
                        <MemoizedCommandItem
                          value={`${brand} ${model}`}
                          onSelect={() => handleSelect("model", brand, model)}
                          className="flex justify-between items-center cursor-pointer"
                        >
                          <span>{model}</span>
                          <CheckIcon
                            className={cn(
                              "h-4 w-4",
                              selectedValues.models.includes(model)
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </MemoizedCommandItem>
                      </div>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    [
      options,
      expandedBrand,
      showCount,
      handleSelect,
      selectedValues.models,
      toggleExpansion,
      handleSelectAllModels,
      handleDeselectAllModels,
      isAllModelsSelected,
      placeholder,
    ]
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[300px] justify-between text-muted-foreground"
          >
            <span className="truncate">{getDisplayText}</span>
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
          <div className="mt-4 h-full">{CommandContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[300px] justify-between text-muted-foreground"
        >
          <span className="truncate">{getDisplayText}</span>
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        {CommandContent}
      </PopoverContent>
    </Popover>
  );
}
