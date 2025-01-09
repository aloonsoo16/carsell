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

export default function PaginationComponent({
  currentPage,
  totalPages,
  filters = {},
}) {
  // Función para construir la URL de cada enlace de paginación con los filtros actuales
  const buildPageUrl = (page) => {
    const params = new URLSearchParams(filters);
    params.set("page", page); // Establecer el número de página en los parámetros de URL
    return `?${params.toString()}`;
  };

  const renderPaginationItems = () => {
    const items = [];

    // Siempre mostrar la primera página
    if (totalPages > 0) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            href={buildPageUrl(1)}
            isActive={currentPage === 1}
            size="icon"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Mostrar puntos suspensivos si hay más de 3 páginas y la página actual no es la última
    if (totalPages > 3 && currentPage > 2) {
      items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    // Mostrar las páginas adyacentes
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href={buildPageUrl(i)}
            isActive={currentPage === i}
            size="icon"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Mostrar puntos suspensivos si hay más de 3 páginas y la página actual no es la primera
    if (totalPages > 3 && currentPage < totalPages - 1) {
      items.push(<PaginationEllipsis key="ellipsis-end" />);
    }

    // Siempre mostrar la última página en la paginación
    if (totalPages > 1) {
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href={buildPageUrl(totalPages)}
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
    <div className="flex flex-col h-full p-4">
      {/* Componente de Paginación */}
      <Pagination>
        <PaginationContent>
          {/* Botón para ir a la página anterior */}
          <PaginationItem>
            <PaginationPrevious
              href={currentPage > 1 ? buildPageUrl(currentPage - 1) : undefined}
              disabled={currentPage === 1}
              className={`${
                currentPage === 1 ? "hover:bg-inherit cursor-not-allowed" : ""
              }`}
            />
          </PaginationItem>

          {/* Renderizar los elementos de paginación */}
          {renderPaginationItems()}

          {/* Botón para ir a la página siguiente */}
          <PaginationItem>
            <PaginationNext
              href={
                currentPage < totalPages
                  ? buildPageUrl(currentPage + 1)
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
