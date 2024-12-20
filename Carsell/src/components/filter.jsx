"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MultiSelectCombobox } from "@/components/multi-combobox";
import { MultiSelectGroupCombobox } from "@/components/multi-select-combobox";
import { MultiSelectButtonGroup } from "@/components/select-buttons";
import { BrandModelCombobox } from "@/components/brand-combobox";
import { TextAreaFilter } from "@/components/version-textarea";
import { SimpleCombobox } from "@/components/simple-combobox";
import { Trash2, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function VehicleFilter() {
  const [fuelTypes, setFuelTypes] = useState([]);
  const [brandModelSelection, setBrandModelSelection] = useState({
    brands: [],
    models: [],
  });
  const [bodyTypes, setBodyTypes] = useState([]);
  const [versions, setVersions] = useState([]);
  const [versionInput, setVersionInput] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [minPower, setMinPower] = useState("");
  const [maxPower, setMaxPower] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [labels, setLabels] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [minSeats, setMinSeats] = useState("");
  const [maxSeats, setMaxSeats] = useState("");
  const [minDoors, setMinDoors] = useState("");
  const [maxDoors, setMaxDoors] = useState("");
  const [minKilometers, setMinKilometers] = useState("");
  const [maxKilometers, setMaxKilometers] = useState("");
  const [colors, setColors] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [tractions, setTractions] = useState([]);
  const [features, setFeatures] = useState([]);
  const [minDisplacement, setMinDisplacement] = useState("");
  const [maxDisplacement, setMaxDisplacement] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch("/api/vehicle/filter");
        if (response.ok) {
          const data = await response.json();
          setVehicles(data);
        } else {
          throw new Error("Error al encontrar vehículos");
        }
      } catch (error) {
        console.error("Error al encontrar vehículos:", error);
        setError("Error desconocido al encontrar vehículos. Inténtalo de nuevo mas tarde.");
      }
    };

    fetchVehicles();

    const params = new URLSearchParams(window.location.search);
    const fuelTypesFromURL = params.get("fuelTypes");
    const brandsFromURL = params.get("brands");
    const modelsFromURL = params.get("models");
    const versionsFromURL = params.get("versions");
    const bodyTypesFromURL = params.get("bodyTypes");
    const minYearFromURL = params.get("minYear");
    const maxYearFromURL = params.get("maxYear");
    const minPowerFromURL = params.get("minPower");
    const maxPowerFromURL = params.get("maxPower");
    const minPriceFromURL = params.get("minPrice");
    const maxPriceFromURL = params.get("maxPrice");
    const labelsFromURL = params.get("labels");
    const provincesFromURL = params.get("provinces");
    const minSeatsFromURL = params.get("minSeats");
    const maxSeatsFromURL = params.get("maxSeats");
    const minDoorsFromURL = params.get("minDoors");
    const maxDoorsFromURL = params.get("maxDoors");
    const minKilometersFromURL = params.get("minKilometers");
    const maxKilometersFromURL = params.get("maxKilometers");
    const colorsFromURL = params.get("colors");
    const transmissionsFromURL = params.get("transmissions");
    const tractionsFromURL = params.get("tractions");
    const featuresFromURL = params.get("features");
    const minDisplacementFromURL = params.get("minDisplacement");
    const maxDisplacementFromURL = params.get("maxDisplacement");

    if (fuelTypesFromURL) setFuelTypes(fuelTypesFromURL.split(","));
    if (brandsFromURL || modelsFromURL) {
      setBrandModelSelection({
        brands: brandsFromURL ? brandsFromURL.split(",") : [],
        models: modelsFromURL ? modelsFromURL.split(",") : [],
      });
    }
    if (versionsFromURL) setVersions(versionsFromURL.split(","));
    if (bodyTypesFromURL) setBodyTypes(bodyTypesFromURL.split(","));
    if (minYearFromURL) setMinYear(minYearFromURL);
    if (maxYearFromURL) setMaxYear(maxYearFromURL);
    if (minPowerFromURL) setMinPower(minPowerFromURL);
    if (maxPowerFromURL) setMaxPower(maxPowerFromURL);
    if (minPriceFromURL) setMinPrice(minPriceFromURL);
    if (maxPriceFromURL) setMaxPrice(maxPriceFromURL);
    if (labelsFromURL) setLabels(labelsFromURL.split(","));
    if (provincesFromURL) setProvinces(provincesFromURL.split(","));
    if (minSeatsFromURL) setMinSeats(minSeatsFromURL);
    if (maxSeatsFromURL) setMaxSeats(maxSeatsFromURL);
    if (minDoorsFromURL) setMinDoors(minDoorsFromURL);
    if (maxDoorsFromURL) setMaxDoors(maxDoorsFromURL);
    if (minKilometersFromURL) setMinKilometers(minKilometersFromURL);
    if (maxKilometersFromURL) setMaxKilometers(maxKilometersFromURL);
    if (colorsFromURL) setColors(colorsFromURL.split(","));
    if (transmissionsFromURL) setTransmissions(transmissionsFromURL.split(","));
    if (tractionsFromURL) setTractions(tractionsFromURL.split(","));
    if (featuresFromURL) setFeatures(featuresFromURL.split(","));
    if (minDisplacementFromURL) setMinDisplacement(minDisplacementFromURL);
    if (maxDisplacementFromURL) setMaxDisplacement(maxDisplacementFromURL);
  }, []);

  const handleFilter = () => {
    if (!versionInput.trim()) {
      setVersions([]);
      localStorage.removeItem("versions");
      setVersionInput("");
    } else {
      const newVersions = versionInput
        .split(",")
        .map((version) => version.trim())
        .filter(Boolean);

      setVersions(newVersions); // Actualiza el estado de versiones
      localStorage.setItem("versions", JSON.stringify(newVersions)); // Guarda las versiones en localStorage

      // Actualiza el valor del textarea con las nuevas versiones seleccionadas
      setVersionInput(newVersions.join(", "));
    }
  };

  // Función para recuperar las versiones al cargar el componente
  useEffect(() => {
    const savedVersions = localStorage.getItem("versions");
    if (savedVersions) {
      const parsedVersions = JSON.parse(savedVersions);
      setVersions(parsedVersions);
      setVersionInput(parsedVersions.join(", ")); // Establece el valor del TextArea con las versiones
    }
  }, []);

  useEffect(() => {
    const filterVehicles = async () => {
      // Activar el loader antes de empezar el filtrado
      setIsLoading(true);

      // Simular un tiempo de carga para mostrar el loader durante un tiempo específico (500ms)
      setTimeout(() => {
        const filtered = vehicles.filter((vehicle) => {
          //Los vehiculos en borrador no se muestran
          if (vehicle.isDraft) return false;

          const fuelMatches =
            fuelTypes.length === 0 || fuelTypes.includes(vehicle.fuelType);

          const brandModelMatches =
            brandModelSelection.models.length === 0 ||
            (brandModelSelection.brands.includes(vehicle.brand) &&
              brandModelSelection.models.includes(vehicle.model));

          const versionMatches =
            versions.length === 0 || versions.includes(vehicle.version);

          const bodyMatches =
            bodyTypes.length === 0 || bodyTypes.includes(vehicle.bodyType);

          const minYearMatches =
            !minYear || vehicle.year >= parseInt(minYear, 10);
          const maxYearMatches =
            !maxYear || vehicle.year <= parseInt(maxYear, 10);

          const minPowerMatches =
            !minPower || vehicle.power >= parseInt(minPower, 10);
          const maxPowerMatches =
            !maxPower || vehicle.power <= parseInt(maxPower, 10);

          const minPriceMatches =
            !minPrice || vehicle.price >= parseInt(minPrice, 10);
          const maxPriceMatches =
            !maxPrice || vehicle.price <= parseInt(maxPrice, 10);

          const labelMatches =
            labels.length === 0 || labels.includes(vehicle.label);

          const provinceMatches =
            provinces.length === 0 || provinces.includes(vehicle.province);

          const minSeatsMatches =
            !minSeats || vehicle.seats >= parseInt(minSeats, 10);
          const maxSeatsMatches =
            !maxSeats || vehicle.seats <= parseInt(maxSeats, 10);

          const minDoorsMatches =
            !minDoors || vehicle.doors >= parseInt(minDoors, 10);
          const maxDoorsMatches =
            !maxDoors || vehicle.doors <= parseInt(maxDoors, 10);

          const minKilometersMatches =
            !minKilometers || vehicle.kilometers >= parseInt(minKilometers, 10);
          const maxKilometersMatches =
            !maxKilometers || vehicle.kilometers <= parseInt(maxKilometers, 10);

          const colorMatches =
            colors.length === 0 || colors.includes(vehicle.color);

          const transmissionMatches =
            transmissions.length === 0 ||
            transmissions.includes(vehicle.transmission);

          const tractionMatches =
            tractions.length === 0 || tractions.includes(vehicle.traction);

          const featuresMatches =
            features.length === 0 || features.includes(vehicle.features);

          const minDisplacementMatches =
            !minDisplacement ||
            vehicle.displacement >= parseInt(minDisplacement, 10);
          const maxDisplacementMatches =
            !maxDisplacement ||
            vehicle.displacement <= parseInt(maxDisplacement, 10);

          return (
            fuelMatches &&
            brandModelMatches &&
            versionMatches &&
            bodyMatches &&
            minYearMatches &&
            maxYearMatches &&
            minPowerMatches &&
            maxPowerMatches &&
            labelMatches &&
            provinceMatches &&
            minSeatsMatches &&
            maxSeatsMatches &&
            minDoorsMatches &&
            maxDoorsMatches &&
            minKilometersMatches &&
            maxKilometersMatches &&
            colorMatches &&
            transmissionMatches &&
            featuresMatches &&
            tractionMatches &&
            minDisplacementMatches &&
            maxDisplacementMatches &&
            minPriceMatches &&
            maxPriceMatches
          );
        });

        setFilteredVehicles(filtered);
        setIsLoading(false);
      }, 500);
    };

    filterVehicles();

    const params = new URLSearchParams();
    if (fuelTypes.length > 0) params.set("fuelTypes", fuelTypes.join(","));
    if (brandModelSelection.brands.length > 0)
      params.set("brands", brandModelSelection.brands.join(","));
    if (brandModelSelection.models.length > 0)
      params.set("models", brandModelSelection.models.join(","));
    if (versions.length > 0) params.set("versions", versions.join(","));
    if (bodyTypes.length > 0) params.set("bodyTypes", bodyTypes.join(","));
    if (labels.length > 0) params.set("labels", labels.join(","));
    if (provinces.length > 0) params.set("provinces", provinces.join(","));
    if (minYear) params.set("minYear", minYear);
    if (maxYear) params.set("maxYear", maxYear);
    if (minPower) params.set("minPower", minPower);
    if (maxPower) params.set("maxPower", maxPower);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minSeats) params.set("minSeats", minSeats);
    if (maxSeats) params.set("maxSeats", maxSeats);
    if (minDoors) params.set("minDoors", minDoors);
    if (maxDoors) params.set("maxDoors", maxDoors);
    if (minKilometers) params.set("minKilometers", minKilometers);
    if (maxKilometers) params.set("maxKilometers", maxKilometers);
    if (colors.length > 0) params.set("colors", colors.join(","));
    if (transmissions.length > 0)
      params.set("transmissions", transmissions.join(","));
    if (tractions.length > 0) params.set("tractions", tractions.join(","));
    if (features.length > 0) params.set("features", features.join(","));
    if (minDisplacement) params.set("minDisplacement", minDisplacement);
    if (maxDisplacement) params.set("maxDisplacement", maxDisplacement);
    router.push(`/filter?${params.toString()}`, { scroll: false });
  }, [
    vehicles,
    fuelTypes,
    brandModelSelection,
    versions,
    bodyTypes,
    minYear,
    maxYear,
    minPower,
    maxPower,
    minPrice,
    maxPrice,
    labels,
    provinces,
    minSeats,
    maxSeats,
    minDoors,
    maxDoors,
    minKilometers,
    maxKilometers,
    colors,
    transmissions,
    tractions,
    features,
    minDisplacement,
    maxDisplacement,
    router,
  ]);

  const handleClearFilters = () => {
    setFuelTypes([]);
    setBrandModelSelection({ brands: [], models: [] });
    setVersions([]);
    setBodyTypes([]);
    setMinYear("");
    setMaxYear("");
    setMinPower("");
    setMaxPower("");
    setMinPrice("");
    setMaxPrice("");
    setLabels([]);
    setProvinces([]);
    setMinSeats("");
    setMaxSeats("");
    setMinDoors("");
    setMaxDoors("");
    setMinKilometers("");
    setMaxKilometers("");
    setColors([]);
    setTransmissions([]);
    setTractions([]);
    setFeatures([]);
    setMinDisplacement("");
    setMaxDisplacement("");
    router.push("/filter", { scroll: false });
  };

  const handleRemoveFilter = (filterType, value) => {
    switch (filterType) {
      case "fuelType":
        setFuelTypes(fuelTypes.filter((type) => type !== value));
        break;
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
          // Filtrar el modelo que se ha seleccionado o deseleccionado
          const newModels = prev.models.filter((model) => model !== value);

          // Filtrar las marcas que están asociadas con los modelos seleccionados
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

      case "version":
        setVersions(versions.filter((type) => type !== value));
        break;

      case "bodyType":
        setBodyTypes(bodyTypes.filter((type) => type !== value));
        break;
      case "minYear":
        setMinYear("");
        break;
      case "maxYear":
        setMaxYear("");
        break;
      case "minPower":
        setMinPower("");
        break;
      case "maxPower":
        setMaxPower("");
        break;
      case "minPrice":
        setMinPrice("");
        break;
      case "maxPrice":
        setMaxPrice("");
        break;
      case "label":
        setLabels(labels.filter((type) => type !== value));
        break;
      case "province":
        setProvinces(provinces.filter((type) => type !== value));
        break;
      case "minSeats":
        setMinSeats("");
        break;
      case "maxSeats":
        setMaxSeats("");
        break;
      case "minDoors":
        setMinDoors("");
        break;
      case "maxDoors":
        setMaxDoors("");
        break;
      case "minKilometers":
        setMinKilometers("");
        break;
      case "maxKilometers":
        setMaxKilometers("");
        break;
      case "color":
        setColors(colors.filter((type) => type !== value));
        break;
      case "transmission":
        setTransmissions(transmissions.filter((type) => type !== value));
        break;
      case "traction":
        setTractions(tractions.filter((type) => type !== value));
        break;
      case "features":
        setFeatures(features.filter((type) => type !== value));
        break;
      case "minDisplacement":
        setMinDisplacement("");
        break;
      case "maxDisplacement":
        setMaxDisplacement("");
        break;
    }
  };

  const getFilteredCount = (filterType, value) => {
    return vehicles.filter((vehicle) => {
      if (vehicle.isDraft) return false;

      const fuelMatches =
        filterType === "fuelType"
          ? vehicle.fuelType === value
          : fuelTypes.length === 0 || fuelTypes.includes(vehicle.fuelType);

      const brandModelMatches =
        filterType === "brand"
          ? vehicle.brand === value
          : filterType === "model"
          ? vehicle.model === value
          : brandModelSelection.models.length === 0 ||
            (brandModelSelection.brands.includes(vehicle.brand) &&
              brandModelSelection.models.includes(vehicle.model));

      const versionMatches =
        versions.length === 0 || versions.includes(vehicle.version);

      const bodyMatches =
        bodyTypes.length === 0 || bodyTypes.includes(vehicle.bodyType);

      const minYearMatches = !minYear || vehicle.year >= parseInt(minYear, 10);
      const maxYearMatches = !maxYear || vehicle.year <= parseInt(maxYear, 10);

      const minPowerMatches =
        !minPower || vehicle.power >= parseInt(minPower, 10);
      const maxPowerMatches =
        !maxPower || vehicle.power <= parseInt(maxPower, 10);

      const minPriceMatches =
        !minPrice || vehicle.price >= parseInt(minPrice, 10);
      const maxPriceMatches =
        !maxPrice || vehicle.price <= parseInt(maxPrice, 10);

      const labelMatches =
        labels.length === 0 || labels.includes(vehicle.label);

      const provinceMatches =
        provinces.length === 0 || provinces.includes(vehicle.province);

      const minSeatsMatches =
        !minSeats || vehicle.seats >= parseInt(minSeats, 10);
      const maxSeatsMatches =
        !maxSeats || vehicle.seats <= parseInt(maxSeats, 10);

      const minDoorsMatches =
        !minDoors || vehicle.doors >= parseInt(minDoors, 10);
      const maxDoorsMatches =
        !maxDoors || vehicle.doors <= parseInt(maxDoors, 10);

      const minKilometersMatches =
        !minKilometers || vehicle.kilometers >= parseInt(minKilometers, 10);
      const maxKilometersMatches =
        !maxKilometers || vehicle.kilometers <= parseInt(maxKilometers, 10);

      const colorMatches =
        colors.length === 0 || colors.includes(vehicle.color);

      const transmissionMatches =
        transmissions.length === 0 ||
        transmissions.includes(vehicle.transmission);

      const tractionMatches =
        tractions.length === 0 || tractions.includes(vehicle.traction);

      const featuresMatches =
        filterType === "features"
          ? vehicle.features === value
          : features.length === 0 || features.includes(vehicle.features);

      const minDisplacementMatches =
        !minDisplacement ||
        vehicle.displacement >= parseInt(minDisplacement, 10);
      const maxDisplacementMatches =
        !maxDisplacement ||
        vehicle.displacement <= parseInt(maxDisplacement, 10);

      return (
        fuelMatches &&
        brandModelMatches &&
        versionMatches &&
        bodyMatches &&
        minYearMatches &&
        maxYearMatches &&
        minPowerMatches &&
        maxPowerMatches &&
        labelMatches &&
        provinceMatches &&
        minSeatsMatches &&
        maxSeatsMatches &&
        minDoorsMatches &&
        maxDoorsMatches &&
        minKilometersMatches &&
        maxKilometersMatches &&
        colorMatches &&
        transmissionMatches &&
        tractionMatches &&
        featuresMatches &&
        minDisplacementMatches &&
        maxDisplacementMatches &&
        minPriceMatches &&
        maxPriceMatches
      );
    }).length;
  };

  const uniqueFuelTypes = [
    ...new Set(vehicles.map((vehicle) => vehicle.fuelType)),
  ].map((fuel) => ({
    value: fuel,
    label: fuel,
    count: getFilteredCount("fuelType", fuel),
  }));

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

  const uniqueBodyTypes = [
    { value: "Berlina", label: "Berlina" },
    { value: "SUV", label: "SUV" },
    { value: "Familiar", label: "Familiar" },
    { value: "Coupé", label: "Coupé" },
    { value: "Monovolumen", label: "Monovolumen" },
    { value: "Cabrio", label: "Cabrio" },
    { value: "Pick Up", label: "Pick Up" },
  ];

  const currentYear = new Date().getFullYear();

  const yearOptions = Array.from(
    { length: currentYear - 1971 + 1 },
    (_, i) => 1971 + i
  ).map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  const filteredMinYearOptions = yearOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (maxYear && optionValue > parseInt(maxYear, 10)) return false;
    return true;
  });

  const filteredMaxYearOptions = yearOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (minYear && optionValue < parseInt(minYear, 10)) return false;
    return true;
  });

  const powerOptions = [
    ...Array.from({ length: (200 - 50) / 10 + 1 }, (_, i) => 50 + i * 10), // De 50 a 200 de 10 en 10
    ...Array.from(
      { length: (500 - 200) / 50 + 1 },
      (_, i) => 200 + i * 50
    ).filter((power) => power !== 200), // De 200 a 500 de 50 en 50, sin el 200
  ].map((power) => ({
    value: power.toString(),
    label: power.toString() + " cv",
  }));

  const filteredMinPowerOptions = powerOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (maxPower && optionValue > parseInt(maxPower, 10)) return false;
    return true;
  });

  const filteredMaxPowerOptions = powerOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (minPower && optionValue < parseInt(minPower, 10)) return false;
    return true;
  });

  const formatPrice = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(",") : arr[0] + " €";
  };

  const priceOptions = [
    ...Array.from({ length: 11 }, (_, i) => i * 1000),
    ...Array.from({ length: 23 }, (_, i) => (i + 3) * 5000),
  ].map((price) => ({
    value: price.toString(),
    label: formatPrice(price),
  }));

  const filteredMinPriceOptions = priceOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (maxPrice && optionValue > parseInt(maxPrice, 10)) return false;
    return true;
  });

  const filteredMaxPriceOptions = priceOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (minPrice && optionValue < parseInt(minPrice, 10)) return false;
    return true;
  });

  const seatOptions = [
    ...Array.from({ length: 9 - 2 + 1 }, (_, i) => 2 + i), // De 2 a 9 asientos
  ].map((seats) => ({
    value: seats.toString(),
    label: seats.toString() + " plazas",
  }));

  const filteredMinSeatsOptions = seatOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (maxSeats && optionValue > parseInt(maxSeats, 10)) return false;
    return true;
  });

  const filteredMaxSeatsOptions = seatOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (minSeats && optionValue < parseInt(minSeats, 10)) return false;
    return true;
  });

  const doorOptions = [
    ...Array.from({ length: 7 - 2 + 1 }, (_, i) => 2 + i), // De 2 a 9 asientos
  ].map((doors) => ({
    value: doors.toString(),
    label: doors.toString() + " puertas",
  }));

  const filteredMinDoorsOptions = doorOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (maxDoors && optionValue > parseInt(maxSeats, 10)) return false;
    return true;
  });

  const filteredMaxDoorsOptions = doorOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (minDoors && optionValue < parseInt(minSeats, 10)) return false;
    return true;
  });

  const formatKilometers = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(",") : arr[0] + " km";
  };

  const kilometersOptions = [
    ...Array.from({ length: 1 }, (_, i) => i * 2500 + 2500),
    ...Array.from({ length: 20 }, (_, i) => i * 5000 + 5000), // De 5,000 a 100,000 de 5,000 en 5,000
    ...Array.from({ length: 5 }, (_, i) => i * 20000 + 100000 + 20000), // De 120,000 a 200,000 de 20,000 en 20,000
  ].map((kilometers) => ({
    value: kilometers.toString(),
    label: formatKilometers(kilometers),
  }));

  const filteredMinKilometersOptions = kilometersOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (maxKilometers && optionValue > parseInt(maxKilometers, 10))
      return false;
    return true;
  });

  const filteredMaxKilometersOptions = kilometersOptions.filter((option) => {
    const optionValue = parseInt(option.value, 10);
    if (minKilometers && optionValue < parseInt(minKilometers, 10))
      return false;
    return true;
  });

  const formatDisplacement = (number) => {
    const exp = /(\d)(?=(\d{3})+(?!\d))/g;
    const rep = "$1.";
    let arr = number.toString().split(".");
    arr[0] = arr[0].replace(exp, rep);
    return arr[1] ? arr.join(",") : arr[0] + " cc";
  };

  const displacementOptions = [
    // De 1,000 a 2,600 en saltos de 200
    ...Array.from({ length: 8 }, (_, i) => i * 200 + 1000),
    ...Array.from({ length: 1 }, (_, i) => i * 400 + 2600),
    ...Array.from({ length: 9 }, (_, i) => i * 500 + 3000),
  ].map((displacement) => ({
    value: displacement.toString(),
    label: formatDisplacement(displacement),
  }));

  const filteredMinDisplacementOptions = displacementOptions.filter(
    (option) => {
      const optionValue = parseInt(option.value, 10);
      if (maxDisplacement && optionValue > parseInt(maxDisplacement, 10))
        return false;
      return true;
    }
  );

  const filteredMaxDisplacementOptions = displacementOptions.filter(
    (option) => {
      const optionValue = parseInt(option.value, 10);
      if (minDisplacement && optionValue < parseInt(minDisplacement, 10))
        return false;
      return true;
    }
  );

  const uniqueLabels = [
    { value: "Etiqueta CERO (azul)", label: "Etiqueta CERO" },
    { value: "Etiqueta ECO (azul/verde)", label: "Etiqueta ECO" },
    { value: "Etiqueta C (verde)", label: "Etiqueta C" },
    { value: "Etiqueta B (amarilla)", label: "Etiqueta B" },
    { value: "Sin etiqueta", label: "Sin etiqueta" },
  ];

  const uniqueProvinces = [
    {
      name: "Andalucía", // Nombre de la comunidad
      provinces: [
        { value: "Almería", label: "Almería" },
        { value: "Cadiz", label: "Cadiz" },
        { value: "Córdoba", label: "Córdoba" },
        { value: "Granada", label: "Granada" },
        { value: "Huelva", label: "Huelva" },
        { value: "Jaén", label: "Jaén" },
        { value: "Málaga", label: "Málaga" },
        { value: "Sevilla", label: "Sevilla" },
      ],
    },
    {
      name: "Aragón",
      provinces: [
        { value: "Huesca", label: "Huesca" },
        { value: "Teruel", label: "Teruel" },
        { value: "Zaragoza", label: "Zaragoza" },
      ],
    },
    {
      name: "Principado de Asturias",
      provinces: [{ value: "Asturias", label: "Asturias" }],
    },
    {
      name: "Illes Balears",
      provinces: [{ value: "Baleares", label: "Baleares" }],
    },

    {
      name: "Canarias",
      provinces: [
        { value: "Las Palmas", label: "Las Palmas" },
        { value: "Sta. C. Tenerife", label: "Sta. C. Tenerife" },
      ],
    },

    {
      name: "Cantabria",
      provinces: [{ value: "Cantabria", label: "Cantabria" }],
    },
    {
      name: "Castilla La Mancha",
      provinces: [
        { value: "Albacete", label: "Albacete" },
        { value: "Ciudad Real", label: "Ciudad Real" },
        { value: "Cuenca", label: "Cuenca" },
        { value: "Guadalajara", label: "Guadalajara" },
        { value: "Toledo", label: "Toledo" },
      ],
    },
    {
      name: "Castilla y León",
      provinces: [
        { value: "Ávila", label: "Ávila" },
        { value: "Burgos", label: "Burgos" },
        { value: "León", label: "León" },
        { value: "Palencia", label: "Palencia" },
        { value: "Salamanca", label: "Salamanca" },
        { value: "Segovia", label: "Segovia" },
        { value: "Valladolid", label: "Valladolid" },
        { value: "Zamora", label: "Zamora" },
      ],
    },

    {
      name: "Catalunya",
      provinces: [
        { value: "Barcelona", label: "Barcelona" },
        { value: "Girona", label: "Girona" },
        { value: "Lleida", label: "Lleida" },
        { value: "Tarragona", label: "Tarragona" },
      ],
    },
    {
      name: "Comunitat Valenciana",
      provinces: [
        { value: "Alicante", label: "Alicante" },
        { value: "Castellón", label: "Castellón" },
        { value: "Valencia", label: "Valencia" },
      ],
    },

    {
      name: "Extremadura",
      provinces: [
        { value: "Badajoz", label: "Badajoz" },
        { value: "Cáceres", label: "Cáceres" },
      ],
    },
    {
      name: "Galicia",
      provinces: [
        { value: "A Coruña", label: "A Coruña" },
        { value: "Lugo", label: "Lugo" },
        { value: "Ourense", label: "Ourense" },
        { value: "Pontevedra", label: "Pontevedra" },
      ],
    },
    {
      name: "Comunidad de Madrid",
      provinces: [{ value: "Madrid", label: "Madrid" }],
    },
    {
      name: "Región de Murcia",
      provinces: [{ value: "Murcia", label: "Murcia" }],
    },
    {
      name: "Comunidad Foral de Navarra",
      provinces: [{ value: "Navarra", label: "Navarra" }],
    },
    {
      name: "País Vasco",
      provinces: [
        { value: "Álava", label: "Álava" },
        { value: "Gipúzcua", label: "Gipúzcua" },
        { value: "Vizcaya", label: "Vizcaya" },
      ],
    },
    {
      name: "La Rioja",
      provinces: [{ value: "La Rioja", label: "La Rioja" }],
    },
    {
      name: "Ciudades Autónomas",
      provinces: [
        { value: "Ceuta", label: "Ceuta" },
        { value: "Melilla", label: "Melilla" },
      ],
    },
  ];

  const uniqueColors = [
    { value: "Amarillo", label: "" },
    { value: "Azul", label: "" },
    { value: "Beige", label: "" },
    { value: "Blanco", label: "" },
    { value: "Granate", label: "" },
    { value: "Gris/Plata", label: "" },
    { value: "Marrón", label: "" },
    { value: "Naranja", label: "" },
    { value: "Negro", label: "" },
    { value: "Rojo", label: "" },
    { value: "Rosa", label: "" },
    { value: "Verde", label: "" },
    { value: "Violeta/Lila", label: "" },
  ];

  const uniqueTransmissions = [
    { value: "Manual", label: "Manual" },
    { value: "Automático", label: "Automático" },
  ];

  const uniqueTractions = [
    { value: "Integral", label: "Integral (AWD, 4WD, 4x4)" },
    { value: "Delantera", label: "Delantera (FWD)" },
    { value: "Trasera", label: "Trasera (RWD)" },
  ];

  const uniqueFeatures = [
    { value: "Techo solar", label: "Techo solar" },
    { value: "Cuero", label: "Cuero" },
    { value: "Navegador", label: "Navegador" },
    { value: "ISOFIX", label: "ISOFIX" },
    { value: "Bola de remolque", label: "Bola de remolque" },
    { value: "Faros de xenon", label: "Faros de xenon" },
    { value: "Faros LED", label: "Faros LED" },
    { value: "Camara de aparcamiento", label: "Camara de aparcamiento" },
    { value: "Bluetooth", label: "Bluetooth" },
    { value: "Aire acondicionado", label: "Aire acondicionado" },
    { value: "Asientos calefactables", label: "Asientos calefactables" },
    {
      value: "Sensor de aparcamiento trasero",
      label: "Sensor de aparcamiento trasero",
    },
  ];

  return (
    <div>
      <div className="flex flex-col justify-center items-center md:justify-start md:items-start bg-background">
        <div className=" justify-start items-center mt-2 mb-2">
          {(fuelTypes.length > 0 ||
            brandModelSelection.models.length > 0 ||
            versions.length > 0 ||
            bodyTypes.length > 0 ||
            minYear ||
            maxYear ||
            minPower ||
            maxPower ||
            labels.length > 0 ||
            provinces.length > 0 ||
            minSeats ||
            maxSeats ||
            minDoors ||
            maxDoors ||
            minKilometers ||
            maxKilometers ||
            colors.length > 0 ||
            transmissions.length > 0 ||
            tractions.length > 0 ||
            features.length > 0 ||
            minDisplacement ||
            maxDisplacement ||
            maxPrice ||
            minPrice) && (
            <div className="md:w-full w-80">
              <div className="flex justify-between space-x-10 items-center py-2">
                <h2 className="font-semibold">Filtros aplicados:</h2>
                <Button
                  className="w-auto rounded-xl border-none font-semibold shadow-none"
                  variant="outline"
                  size="text-sm"
                  onClick={handleClearFilters}
                >
                  <Trash2 />
                  Limpiar filtros
                </Button>
              </div>

              <div className="w-full flex flex-wrap-reverse md:flex-wrap scroll gap-x-2 gap-y-2 py-4">
                {fuelTypes.map((fuel) => (
                  <Badge
                    key={fuel}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {fuel}
                    <button
                      onClick={() => handleRemoveFilter("fuelType", fuel)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
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

                {bodyTypes.map((body) => (
                  <Badge
                    key={body}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {body}
                    <button
                      onClick={() => handleRemoveFilter("bodyType", body)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {versions.map((version) => (
                  <Badge
                    key={version}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {version}
                    <button
                      onClick={() => handleRemoveFilter("version", version)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}

                {minYear && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minYear}
                    <button
                      onClick={() => handleRemoveFilter("minYear")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxYear && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxYear}
                    <button
                      onClick={() => handleRemoveFilter("maxYear")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {minPower && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minPower} cv
                    <button
                      onClick={() => handleRemoveFilter("minPower")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxPower && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxPower} cv
                    <button
                      onClick={() => handleRemoveFilter("maxPower")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {minPrice && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minPrice} €
                    <button
                      onClick={() => handleRemoveFilter("minPrice")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxPrice && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxPrice} €
                    <button
                      onClick={() => handleRemoveFilter("maxPrice")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {labels.map((label) => (
                  <Badge
                    key={label}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {label}
                    <button
                      onClick={() => handleRemoveFilter("label", label)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {provinces.map((province) => (
                  <Badge
                    key={province}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {province}
                    <button
                      onClick={() => handleRemoveFilter("province", province)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {minSeats && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minSeats} plazas
                    <button
                      onClick={() => handleRemoveFilter("minSeats")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxSeats && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxSeats} plazas
                    <button
                      onClick={() => handleRemoveFilter("maxSeats")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {minDoors && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minDoors} puertas
                    <button
                      onClick={() => handleRemoveFilter("minDoors")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxDoors && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxDoors} puertas
                    <button
                      onClick={() => handleRemoveFilter("maxDoors")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}

                {minKilometers && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minKilometers} km
                    <button
                      onClick={() => handleRemoveFilter("minKilometers")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxKilometers && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxKilometers} km
                    <button
                      onClick={() => handleRemoveFilter("maxKilometers")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {colors.map((color) => (
                  <Badge
                    key={color}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {color}
                    <button
                      onClick={() => handleRemoveFilter("color", color)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {transmissions.map((transmission) => (
                  <Badge
                    key={transmission}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {transmission}
                    <button
                      onClick={() =>
                        handleRemoveFilter("transmission", transmission)
                      }
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {tractions.map((traction) => (
                  <Badge
                    key={traction}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {traction}
                    <button
                      onClick={() => handleRemoveFilter("traction", traction)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {features.map((features) => (
                  <Badge
                    key={features}
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    {features}
                    <button
                      onClick={() => handleRemoveFilter("features", features)}
                      className="bg-transparent border-none ml-2 py-1"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {minDisplacement && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Desde {minDisplacement} cc
                    <button
                      onClick={() => handleRemoveFilter("minDisplacement")}
                      className="bg-transparent hover:bg-transparent py-1 ml-2"
                    >
                      <X className="text-xs w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {maxDisplacement && (
                  <Badge
                    className="flex items-center rounded-xl text-xs py-0"
                    variant="outline"
                  >
                    Hasta {maxDisplacement} cc
                    <button
                      onClick={() => handleRemoveFilter("maxDisplacement")}
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

        <div
          className={`w-[300px] rounded-xl flex  justify-center p-2 text-sm ${
            filteredVehicles.length === 0 ? "bg-red-700/60" : "bg-red-700"
          }`}
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : filteredVehicles.length === 0 ? (
            <span className="font-semibold truncate">
              No se han encontrado resultados
            </span>
          ) : (
            <span className="font-semibold truncate">
              Se han encontrado {filteredVehicles.length} resultados
            </span>
          )}
        </div>

        <Separator className="mt-4" />
      </div>
      <div className="space-y-6 mt-4 mb-4">
        <div>
          <h2 className="font-bold mb-2">Combustible</h2>
          <MultiSelectCombobox
            options={uniqueFuelTypes}
            selectedValues={fuelTypes}
            onSelect={setFuelTypes}
            placeholder="Selecciona el combustible"
            showCount={true}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Marca y Modelo</h2>
          <BrandModelCombobox
            options={brandModelOptions}
            selectedValues={brandModelSelection}
            onSelect={setBrandModelSelection}
            placeholder="Selecciona marca y modelo"
            showCount={true}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Versiones</h2>
          <TextAreaFilter
            value={versionInput}
            onChange={setVersionInput}
            onFilter={handleFilter}
            placeholder="Escribe las versiones que deseas filtrar (separadas por comas). EJ: M240i, M2 Competition..."
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Tipo de carroceria</h2>
          <MultiSelectButtonGroup
            options={uniqueBodyTypes}
            selectedValues={bodyTypes}
            onSelect={setBodyTypes}
          />
        </div>
        <div>
          <h2 className="font-bold mb-2">Año de fabricación</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinYearOptions}
              selectedValues={minYear ? [minYear] : []}
              onSelect={(value) => {
                if (
                  !minYear ||
                  (value && parseInt(value, 10) >= parseInt(minYear, 10))
                ) {
                  setMinYear(value || "");
                } else {
                  setMinYear(value || "");
                }
                if (maxYear && parseInt(value, 10) > parseInt(maxYear, 10)) {
                  setMaxYear("");
                }
              }}
              placeholder="¿Desde que año?"
            />
            <SimpleCombobox
              options={filteredMaxYearOptions}
              selectedValues={maxYear ? [maxYear] : []}
              onSelect={(value) => {
                if (
                  !maxYear ||
                  (value && parseInt(value, 10) >= parseInt(maxYear, 10))
                ) {
                  setMaxYear(value || "");
                } else {
                  setMaxYear(value || "");
                }
                if (minYear && parseInt(value, 10) < parseInt(minYear, 10)) {
                  setMinYear("");
                }
              }}
              placeholder="¿Hasta que año?"
              isMax={true}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Potencia</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinPowerOptions}
              selectedValues={minPower ? [minPower] : []}
              onSelect={(value) => {
                if (
                  !minPower ||
                  (value && parseInt(value, 10) >= parseInt(minPower, 10))
                ) {
                  setMinPower(value || "");
                } else {
                  setMinPower(value || "");
                }

                if (maxPower && parseInt(value, 10) > parseInt(maxPower, 10)) {
                  setMaxPower("");
                }
              }}
              placeholder="¿Desde qué potencia?"
            />
            <SimpleCombobox
              options={filteredMaxPowerOptions}
              selectedValues={maxPower ? [maxPower] : []}
              onSelect={(value) => {
                if (
                  !maxPower ||
                  (value && parseInt(value, 10) >= parseInt(maxPower, 10))
                ) {
                  setMaxPower(value || "");
                } else {
                  setMaxPower(value || "");
                }

                if (minPower && parseInt(value, 10) < parseInt(minPower, 10)) {
                  setMinPower("");
                }
              }}
              placeholder="¿Hasta qué potencia?"
              isMax={true}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Provincia</h2>
          <MultiSelectGroupCombobox
            options={uniqueProvinces}
            selectedValues={provinces}
            onSelect={setProvinces}
            placeholder="Selecciona una provincia"
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Precio</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinPriceOptions}
              selectedValues={minPrice ? [minPrice] : []}
              onSelect={(value) => {
                setMinPrice(value || "");
                if (maxPrice && parseInt(value, 10) > parseInt(maxPrice, 10)) {
                  setMaxPrice("");
                }
              }}
              placeholder="¿Desde qué precio?"
            />
            <SimpleCombobox
              options={filteredMaxPriceOptions}
              selectedValues={maxPrice ? [maxPrice] : []}
              onSelect={(value) => {
                setMaxPrice(value || "");
                if (minPrice && parseInt(value, 10) < parseInt(minPrice, 10)) {
                  setMinPrice("");
                }
              }}
              placeholder="¿Hasta qué precio?"
              isMax={true}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Número de plazas</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinSeatsOptions}
              selectedValues={minSeats ? [minSeats] : []}
              onSelect={(value) => {
                if (
                  !minSeats ||
                  (value && parseInt(value, 10) >= parseInt(minSeats, 10))
                ) {
                  setMinSeats(value || "");
                } else {
                  setMinSeats(value || "");
                }

                if (maxSeats && parseInt(value, 10) > parseInt(maxSeats, 10)) {
                  setMaxSeats("");
                }
              }}
              placeholder="¿Mínimo de plazas?"
            />
            <SimpleCombobox
              options={filteredMaxSeatsOptions}
              selectedValues={maxSeats ? [maxSeats] : []}
              onSelect={(value) => {
                if (
                  !maxSeats ||
                  (value && parseInt(value, 10) >= parseInt(maxSeats, 10))
                ) {
                  setMaxSeats(value || "");
                } else {
                  setMaxSeats(value || "");
                }

                if (minSeats && parseInt(value, 10) < parseInt(minSeats, 10)) {
                  setMinSeats("");
                }
              }}
              placeholder="¿Máximo de plazas?"
              isMax={true}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Número de puertas</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinDoorsOptions}
              selectedValues={minDoors ? [minDoors] : []}
              onSelect={(value) => {
                if (
                  !minDoors ||
                  (value && parseInt(value, 10) >= parseInt(minDoors, 10))
                ) {
                  setMinDoors(value || "");
                } else {
                  setMinDoors(value || "");
                }

                if (maxDoors && parseInt(value, 10) > parseInt(maxDoors, 10)) {
                  setMaxDoors("");
                }
              }}
              placeholder="¿Mínimo de puertas?"
            />
            <SimpleCombobox
              options={filteredMaxDoorsOptions}
              selectedValues={maxDoors ? [maxDoors] : []}
              onSelect={(value) => {
                if (
                  !maxDoors ||
                  (value && parseInt(value, 10) >= parseInt(maxDoors, 10))
                ) {
                  setMaxDoors(value || "");
                } else {
                  setMaxDoors(value || "");
                }

                if (minDoors && parseInt(value, 10) < parseInt(minDoors, 10)) {
                  setMinDoors("");
                }
              }}
              placeholder="¿Máximo de puertas?"
              isMax={true}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Kilómetros</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinKilometersOptions}
              selectedValues={minKilometers ? [minKilometers] : []}
              onSelect={(value) => {
                if (
                  !minKilometers ||
                  (value && parseInt(value, 10) >= parseInt(minKilometers, 10))
                ) {
                  setMinKilometers(value || "");
                } else {
                  setMinKilometers(value || "");
                }

                if (
                  maxKilometers &&
                  parseInt(value, 10) > parseInt(maxKilometers, 10)
                ) {
                  setMaxKilometers("");
                }
              }}
              placeholder="¿Mínimo de kilómetros?"
            />
            <SimpleCombobox
              options={filteredMaxKilometersOptions}
              selectedValues={maxKilometers ? [maxKilometers] : []}
              onSelect={(value) => {
                if (
                  !maxKilometers ||
                  (value && parseInt(value, 10) >= parseInt(maxKilometers, 10))
                ) {
                  setMaxKilometers(value || "");
                } else {
                  setMaxKilometers(value || "");
                }

                if (
                  minKilometers &&
                  parseInt(value, 10) < parseInt(minKilometers, 10)
                ) {
                  setMinKilometers("");
                }
              }}
              placeholder="¿Máximo de kilómetros?"
              isMax={true}
            />
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-2">Etiqueta medioambiental</h2>
          <MultiSelectButtonGroup
            options={uniqueLabels}
            selectedValues={labels}
            onSelect={setLabels}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Color</h2>
          <MultiSelectButtonGroup
            options={uniqueColors}
            selectedValues={colors}
            onSelect={setColors}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Cambio</h2>
          <MultiSelectButtonGroup
            options={uniqueTransmissions}
            selectedValues={transmissions}
            onSelect={setTransmissions}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Traccion</h2>
          <MultiSelectButtonGroup
            options={uniqueTractions}
            selectedValues={tractions}
            onSelect={setTractions}
          />
        </div>
        <div>
          <h2 className="font-bold mb-2">Equipamiento adicional</h2>
          <MultiSelectCombobox
            options={uniqueFeatures}
            selectedValues={features}
            onSelect={setFeatures}
            placeholder="Selecciona el equipamiento"
            showCount={false}
          />
        </div>

        <div>
          <h2 className="font-bold mb-2">Cilindrada</h2>
          <div className="space-y-2">
            <SimpleCombobox
              options={filteredMinDisplacementOptions}
              selectedValues={minDisplacement ? [minDisplacement] : []}
              onSelect={(value) => {
                if (
                  !minDisplacement ||
                  (value &&
                    parseInt(value, 10) >= parseInt(minDisplacement, 10))
                ) {
                  setMinDisplacement(value || "");
                } else {
                  setMinDisplacement(value || "");
                }

                if (
                  maxDisplacement &&
                  parseInt(value, 10) > parseInt(maxDisplacement, 10)
                ) {
                  setMaxDisplacement("");
                }
              }}
              placeholder="¿Desde qué cilindrada?"
            />
            <SimpleCombobox
              options={filteredMaxDisplacementOptions}
              selectedValues={maxDisplacement ? [maxDisplacement] : []}
              onSelect={(value) => {
                if (
                  !maxDisplacement ||
                  (value &&
                    parseInt(value, 10) >= parseInt(maxDisplacement, 10))
                ) {
                  setMaxDisplacement(value || "");
                } else {
                  setMaxDisplacement(value || "");
                }

                if (
                  minDisplacement &&
                  parseInt(value, 10) < parseInt(minDisplacement, 10)
                ) {
                  setMinDisplacement("");
                }
              }}
              placeholder="¿Hasta qué cilindrada?"
              isMax={true}
            />
          </div>
        </div>

        {error && <p className="text-red-700">{error}</p>}
      </div>

      <Separator />
    </div>
  );
}
