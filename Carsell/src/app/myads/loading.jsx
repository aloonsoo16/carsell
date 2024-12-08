import React from "react";
import { Skeleton } from "@/components/ui//skeleton";

export default function Loading() {
  return (
    <div className="flex flex-col h-full px-6 gap-y-6">
      <div className="lg:grid lg:grid-cols-1 lg:space-y-0 space-y-6 gap-4 px-6 py-4 lg:py-16">
        <div className="flex justify-between px-6 ">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex-grow px-6">
          <Skeleton className="h-[500px] w-full" />
        </div>
      </div>
    </div>
  );
}
