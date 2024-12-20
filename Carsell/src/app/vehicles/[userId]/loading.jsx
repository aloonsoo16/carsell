import React from "react";
import CardSkeleton from "@/components/card-skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen px-4 md:px-6 py-4 md:py-2">
      <div className="lg:grid md:grid-cols-2 xl:grid-cols-3 lg:space-y-0 space-y-6 gap-4">
        {/* Mostrar los Skeletons mientras se cargan los vehículos */}
        {Array.from({ length: 6 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}
