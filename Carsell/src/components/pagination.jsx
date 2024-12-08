"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationComponent({ currentPage, totalPages }) {
  const renderPaginationItems = () => {
    const items = [];

    // Siempre mostrar la primera página
    if (totalPages > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            href="?page=1"
            isActive={currentPage === 1}
            size="icon"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Mostrar puntos suspensivos si es necesario antes de la página actual
    if (currentPage > 3) {
      items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    // Mostrar páginas adyacentes y las primeras páginas si es necesario
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={`?page=${i}`}
            isActive={currentPage === i}
            size="icon"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Mostrar puntos suspensivos si es necesario después de la página actual
    if (currentPage < totalPages - 2) {
      items.push(<PaginationEllipsis key="ellipsis-end" />);
    }

    // Siempre mostrar la última página en la paginación
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={`?page=${totalPages}`}
            isActive={currentPage === totalPages}
            size="icon"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div>
      {/* Componente de Paginación */}
      <Pagination className="flex flex-wrap p-2">
        <PaginationContent className="flex flex-wrap max-w-full max-h-12">
          <PaginationItem className="flex-shrink-0">
            <PaginationPrevious
              href={currentPage > 1 ? `?page=${currentPage - 1}` : undefined}
              disabled={currentPage === 1}
              className={`text-hidden${
                currentPage === 1 ? "hover:bg-inherit cursor-not-allowed" : ""
              }`}
            />
          </PaginationItem>

          {renderPaginationItems()}
          <PaginationItem className="m-0">
            <PaginationNext
              href={
                currentPage < totalPages
                  ? `?page=${currentPage + 1}`
                  : undefined
              }
              disabled={currentPage === totalPages}
              className={`${
                currentPage === totalPages
                  ? "hover:bg-inherit cursor-not-allowed"
                  : ""
              }`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
