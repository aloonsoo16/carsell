"use client";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
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

export function MultiSelectGroupCombobox({
  options, // Las opciones estarán agrupadas por comunidades con sus respesctivas provincias
  selectedValues,
  onSelect,
  placeholder,
}) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (value) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onSelect(newSelectedValues);
  };

  const getDisplayText = () => {
    return selectedValues.length > 0
      ? selectedValues
          .map((value) => {
            const option = options
              .flatMap((community) =>
                community.provinces.map((province) =>
                  province.value === value ? province : null
                )
              )
              .filter(Boolean)[0];
            return option ? option.label : "";
          })
          .join(", ")
      : placeholder;
  };

  const CommandContent = () => (
    <Command>
      <CommandInput placeholder={`${placeholder}...`} className="h-9" />
      <CommandList>
        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
        {options.map((community) => (
          <CommandGroup key={community.name}>
            <span className="text-sm font-bold bg-muted p-1 w-full flex rounded-sm mb-2 mt-1">
              {community.name}
            </span>
            {community.provinces.map((province) => (
              <CommandItem
                key={province.value}
                value={province.value}
                onSelect={() => handleSelect(province.value)}
                className="flex justify-between items-center"
              >
                <span>{province.label}</span>
                <CheckIcon
                  className={cn(
                    "h-4 w-4",
                    selectedValues.includes(province.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
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
            className="w-[300px] justify-between text-muted-foreground"
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
          className="w-[300px] justify-between text-muted-foreground"
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
