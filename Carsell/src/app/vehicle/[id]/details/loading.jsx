import React from "react";
import CardSkeleton from "@/components/card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 px-4 pt-4 xl:px-10">
      {/* Contenedor principal */}
      <div className="flex flex-col w-full xl:w-3/4 gap-y-6">
        <CardSkeleton />
        <Skeleton className="h-full" />
      </div>
      <div className="flex flex-col w-full xl:w-1/4 gap-y-6">
        <div className="relative w-full hidden xl:block overflow-y-auto h-[775px]">
          <Skeleton className="h-full" />
        </div>
        <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-40" />
          ))}
        </div>
      </div>
    </div>
  );
}
