import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function TextAreaFilter({
  value,
  onChange,
  onFilter,
  placeholder,
  className,
}) {
  const handleClick = () => {
    onFilter();
  };

  return (
    <div className="flex flex-col justify-center items-center md:justify-start md:items-start">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={value ? "" : placeholder}
        className={`w-[300px] min-h-[80px] p-2 border rounded-md text-sm flex ${className}`}
      />
      <Button onClick={handleClick} className="mt-2 w-[300px]">
        Filtrar
      </Button>
    </div>
  );
}
