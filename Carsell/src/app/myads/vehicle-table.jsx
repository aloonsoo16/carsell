"use client";

import React from "react";
import { DataTable } from "./data-table";
import { Columns } from "./columns";

export default function VehicleTable({ initialData }) {
  return (
    <Columns>
      {(columns) => <DataTable columns={columns} data={initialData} />}
    </Columns>
  );
}
