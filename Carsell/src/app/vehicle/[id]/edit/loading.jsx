import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col lg:flex-row h-full px-6 py-4 lg:py-16 gap-y-6">
      <div className="w-full lg:w-2/4 flex flex-col px-8 justify-between order-1 lg:order-2 gap-4">
        <Skeleton className="h-full" />
        <Skeleton className="h-full" />
      </div>
      <Skeleton className="flex flex-col justify-center items-center  lg:w-2/4 order-2 lg:order-1 w-full h-[700px]" />
    </div>
  );
}


