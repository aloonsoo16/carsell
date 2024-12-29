"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrandModelSmallCombobox } from "@/components/brand-small-combobox";
import { Trash2, X, Loader2 } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export default function SimpleFilter() {
  const [brandModelSelection, setBrandModelSelection] = useState({
    brands: [],
    models: [],
  });
  const [minKilometers, setMinKilometers] = useState("");
  const [maxKilometers, setMaxKilometers] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicle/filter");
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          throw new Error("Failed to fetch vehicles");
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        setError("Failed to fetch vehicles. Please try again later.");
      }
    };

    fetchVehicles();

    const params = new URLSearchParams(window.location.search);

    const brandsFromURL = params.get("brands");
    const modelsFromURL = params.get("models");
    const minKilometersFromURL = params.get("minKilometers");
    const maxKilometersFromURL = params.get("maxKilometers");
    const stateFromURL = params.get("state");

    if (brandsFromURL || modelsFromURL) {
      setBrandModelSelection({
        brands: brandsFromURL ? brandsFromURL.split(",") : [],
        models: modelsFromURL ? modelsFromURL.split(",") : [],
      });
    }

    if (minKilometersFromURL) setMinKilometers(minKilometersFromURL);
    if (maxKilometersFromURL) setMaxKilometers(maxKilometersFromURL);
    if (stateFromURL) setSelectedState(stateFromURL);
  }, []);

  useEffect(() => {
    const filterVehicles = async () => {
      setIsLoading(true);

      setTimeout(() => {
        const filtered = vehicles.filter((vehicle) => {
          if (vehicle.isDraft) return false;

          const brandModelMatches =
            brandModelSelection.models.length === 0 ||
            (brandModelSelection.brands.includes(vehicle.brand) &&
              brandModelSelection.models.includes(vehicle.model));

          const minKilometersMatches =
            !minKilometers || vehicle.kilometers >= parseInt(minKilometers, 10);
          const maxKilometersMatches =
            !maxKilometers || vehicle.kilometers <= parseInt(maxKilometers, 10);

          return (
            brandModelMatches && minKilometersMatches && maxKilometersMatches
          );
        });

        setFilteredVehicles(filtered);
        setIsLoading(false);
      }, 500);
    };

    filterVehicles();
  }, [vehicles, brandModelSelection, minKilometers, maxKilometers]);

  useEffect(() => {
    if (isRedirecting) {
      const params = new URLSearchParams();

      if (brandModelSelection.brands.length > 0)
        params.set("brands", brandModelSelection.brands.join(","));
      if (brandModelSelection.models.length > 0)
        params.set("models", brandModelSelection.models.join(","));
      if (minKilometers) params.set("minKilometers", minKilometers);
      if (maxKilometers) params.set("maxKilometers", maxKilometers);
      if (selectedState) params.set("state", selectedState);

      // Redirige con todos los parámetros pasados
      router.push(`/filter?${params.toString()}`);
    }
  }, [
    isRedirecting,
    brandModelSelection,
    minKilometers,
    maxKilometers,
    selectedState,
    router,
  ]);

  const handleClearFilters = () => {
    setBrandModelSelection({ brands: [], models: [] });
    setMinKilometers("");
    setMaxKilometers("");
    setSelectedState("");
  };

  const handleRemoveFilter = (filterType, value) => {
    switch (filterType) {
      case "brand":
        setBrandModelSelection((prev) => {
          const modelsToRemove = Object.keys(
            brandModelOptions[value]?.models || {}
          );

          return {
            brands: prev.brands.filter((brand) => brand !== value),
            models: prev.models.filter(
              (model) => !modelsToRemove.includes(model)
            ),
          };
        });
        break;
      case "model":
        setBrandModelSelection((prev) => {
          const newModels = prev.models.filter((model) => model !== value);

          const newBrands = Object.keys(brandModelOptions).filter((brand) =>
            Object.keys(brandModelOptions[brand].models).some((model) =>
              newModels.includes(model)
            )
          );
          return {
            brands: newBrands,
            models: newModels,
          };
        });
        break;
      case "state":
        setMinKilometers("");
        setMaxKilometers("");
        setSelectedState("");
        break;
    }
  };

  const getFilteredCount = (filterType, value) => {
    return vehicles.filter((vehicle) => {
      if (vehicle.isDraft) return false;

      const brandModelMatches =
        filterType === "brand"
          ? vehicle.brand === value
          : filterType === "model"
          ? vehicle.model === value
          : brandModelSelection.models.length === 0 ||
            (brandModelSelection.brands.includes(vehicle.brand) &&
              brandModelSelection.models.includes(vehicle.model));

      const minKilometersMatches =
        !minKilometers || vehicle.kilometers >= parseInt(minKilometers, 10);
      const maxKilometersMatches =
        !maxKilometers || vehicle.kilometers <= parseInt(maxKilometers, 10);

      return brandModelMatches && minKilometersMatches && maxKilometersMatches;
    }).length;
  };

  const brandModelOptions = {};
  vehicles.forEach((vehicle) => {
    if (!brandModelOptions[vehicle.brand]) {
      brandModelOptions[vehicle.brand] = {
        count: getFilteredCount("brand", vehicle.brand),
        models: {
          [vehicle.model]: {
            count: getFilteredCount("model", vehicle.model),
          },
        },
      };
    } else {
      if (!brandModelOptions[vehicle.brand].models[vehicle.model]) {
        brandModelOptions[vehicle.brand].models[vehicle.model] = {
          count: getFilteredCount("model", vehicle.model),
        };
      }
    }
  });

  const handleShowResults = () => {
    setIsRedirecting(true);
  };

  const handleStateSelection = (state) => {
    if (selectedState === state) {
      setSelectedState("");
      setMinKilometers("");
      setMaxKilometers("");
    } else {
      setSelectedState(state);
      switch (state) {
        case "Nuevo":
          setMinKilometers("0");
          setMaxKilometers("2500");
          break;
        case "Seminuevo":
          setMinKilometers("2501");
          setMaxKilometers("5000");
          break;
        case "km 0":
          setMinKilometers("0");
          setMaxKilometers("100");
          break;
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center md:justify-start md:items-start mb-0">
        <div className="justify-start w-full items-center">
          {(brandModelSelection.models.length > 0 || selectedState) && (
            <div className="w-full pb-4">
              <div className="flex justify-between space-x-10 items-center py-2">
                <h2 className="font-semibold">Filtros aplicados:</h2>
                <Button
                  className="w-auto rounded-xl border-none font-semibold shadow-none bg-transparent hover:bg-transparent"
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <Trash2 />
                  Limpiar filtros
                </Button>
              </div>

              <div className="w-full flex flex-wrap-reverse md:flex-wrap scroll gap-x-2 gap-y-4 ">
                {Object.keys(brandModelOptions).map((brand) => {
                  const allModelsSelected = Object.keys(
                    brandModelOptions[brand].models
                  ).every((model) =>
                    brandModelSelection.models.includes(model)
                  );

                  if (allModelsSelected) {
                    // Si todos los modelos están seleccionados, un solo badge para la marca
                    return (
                      <Badge
                        key={brand}
                        className="flex items-center rounded-xl text-xs py-0"
                        variant="outline"
                      >
                        {brand}
                        <span className="ml-2 text-muted-foreground text-xs">
                          (Todos)
                        </span>
                        <button
                          onClick={() => handleRemoveFilter("brand", brand)}
                          className="bg-transparent hover:bg-transparent py-1 ml-2"
                        >
                          <X className="text-xs w-3 h-3" />
                        </button>
                      </Badge>
                    );
                  } else {
                    return Object.keys(brandModelOptions[brand].models)
                      .filter((model) =>
                        brandModelSelection.models.includes(model)
                      )
                      .map((model) => (
                        <Badge
                          key={`${brand}-${model}`}
                          className="flex items-center rounded-xl text-xs py-0"
                          variant="outline"
                        >
                          {brand}
                          <span className="ml-2 text-muted-foreground text-xs">
                            {`(${model})`}
                          </span>

                          <button
                            onClick={() => handleRemoveFilter("model", model)}
                            className="bg-transparent hover:bg-transparent py-1 ml-2"
                          >
                            <X className="text-xs w-3 h-3" />
                          </button>
                        </Badge>
                      ));
                  }
                })}
                {selectedState && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0 border-zinc-800"
                    variant="outline"
                  >
                    {selectedState}
                    <button
                      onClick={() => handleRemoveFilter("state", selectedState)}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        <Button
          onClick={handleShowResults}
          className={`w-full rounded-xl flex justify-center p-2  font-bold text-primary ${
            filteredVehicles.length === 0
              ? "bg-red-700"
              : "bg-red-700 hover:bg-red-900"
          }`}
          disabled={isLoading || isRedirecting || filteredVehicles.length === 0}
        >
          {isLoading || isRedirecting ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : filteredVehicles.length === 0 ? (
            <span className="truncate">No se han encontrado resultados</span>
          ) : (
            <span className="truncate">
              Se han encontrado {filteredVehicles.length} resultados
            </span>
          )}
        </Button>
      </div>
      <div className="pt-4 mb-4 flex gap-4 flex-wrap mt-2">
        <div>
          <h2 className="font-bold mb-2">Marca y Modelo</h2>
          <BrandModelSmallCombobox
            options={brandModelOptions}
            selectedValues={brandModelSelection}
            onSelect={setBrandModelSelection}
            placeholder="Selecciona la marca y modelo"
            showCount={true}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Estado</h2>
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-full"
              variant={selectedState === "Nuevo" ? "default" : "secondary"}
              onClick={() => handleStateSelection("Nuevo")}
            >
              Nuevo
            </Button>
            <Button
              className="rounded-full"
              variant={selectedState === "Seminuevo" ? "default" : "secondary"}
              onClick={() => handleStateSelection("Seminuevo")}
            >
              Seminuevo
            </Button>
            <Button
              className="rounded-full"
              variant={selectedState === "km 0" ? "default" : "secondary"}
              onClick={() => handleStateSelection("km 0")}
            >
              km 0
            </Button>
          </div>
        </div>
        <div className="flex items-end">
          <Button
            variant="ghost"
            onClick={handleShowResults}
            className="w-full rounded-full flex justify-center p-2  font-bold text-primary hover:bg-inherit hover:scale-105"
            disabled={isRedirecting}
          >
            <div className="flex w-full gap-1 justify-center items-center">
              <span className="truncate">Más filtros</span>
              <span>
                <ArrowUpRight size={12} />
              </span>
            </div>
          </Button>
        </div>
        {error && <p className="text-red-700">{error}</p>}
      </div>
    </div>
  );
}
