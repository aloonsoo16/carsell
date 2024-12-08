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

export function BrandModelSmallCombobox({
  options,
  selectedValues = { models: [], brands: [] },
  onSelect,
  placeholder,
  showCount = true,
}) {
  const [open, setOpen] = React.useState(false);
  const [expandedBrand, setExpandedBrand] = React.useState(null);
  const isMobile = useIsMobile();

  const handleSelect = (type, brand, model) => {
    const newSelectedValues = { ...selectedValues };

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

    onSelect(newSelectedValues);
  };

  const toggleExpansion = (type, value) => {
    if (type === "brand") {
      setExpandedBrand(expandedBrand === value ? null : value);
    }
  };

  const handleSelectAllModels = (brand) => {
    const newSelectedValues = { ...selectedValues };
    const models = Object.keys(options[brand].models);

    newSelectedValues.models = newSelectedValues.models.filter(
      (model) => !models.includes(model)
    );

    newSelectedValues.models.push(...models);

    if (!newSelectedValues.brands.includes(brand)) {
      newSelectedValues.brands.push(brand);
    }

    onSelect(newSelectedValues);
  };

  const isAllModelsSelected = (brand) => {
    const models = Object.keys(options[brand].models);
    return models.every((model) => selectedValues.models.includes(model));
  };

  const handleDeselectAllModels = (brand) => {
    const newSelectedValues = { ...selectedValues };
    const models = Object.keys(options[brand].models);

    newSelectedValues.models = newSelectedValues.models.filter(
      (m) => !models.includes(m)
    );

    if (!newSelectedValues.models.some((m) => models.includes(m))) {
      newSelectedValues.brands = newSelectedValues.brands.filter(
        (b) => b !== brand
      );
    }

    onSelect(newSelectedValues);
  };

  const getDisplayText = () => {
    const { brands, models } = selectedValues;

    if (brands.length === 0 && models.length === 0) {
      return placeholder;
    }

    const displayText = brands
      .map((brand) => {
        const brandData = options[brand];
        if (!brandData) {
          return null;
        }
        const brandModels = brandData.models;
        const brandModelKeys = Object.keys(brandModels);

        const allModelsSelected = brandModelKeys.every((model) =>
          models.includes(model)
        );

        const modelTexts = brandModelKeys
          .filter((model) => models.includes(model))
          .map((model) => model);

        if (allModelsSelected) {
          return brand;
        }

        if (modelTexts.length > 0) {
          return `${brand}: ${modelTexts.join(", ")}`;
        }

        return brand;
      })
      .filter(Boolean)
      .join(" | ");

    return displayText || placeholder;
  };

  const CommandContent = () => (
    <Command>
      <CommandInput placeholder={`${placeholder}...`} className="h-9" />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        <CommandGroup className="hover:cursor-not-alloweds">
          {Object.entries(options).map(([brand, { count, models }]) => (
            <React.Fragment key={brand}>
              <CommandItem
                value={brand}
                onSelect={() => toggleExpansion("brand", brand)}
                className="flex justify-between items-center cursor-default"
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
                      "h-4 w-4",
                      isAllModelsSelected(brand) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              )}
              {expandedBrand === brand &&
                Object.entries(models).map(([model, { count }]) => (
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
