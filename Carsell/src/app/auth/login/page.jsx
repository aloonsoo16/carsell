"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import Link from "next/link";
import { CarFront, Github } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar la contraseña
  const isMobile = useIsMobile();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/home");
      router.refresh();
    }
  });

  if (isMobile) {
    return (
      <div className="flex h-screen w-full overflow-hidden ">
        {/* Sección derecha con el formulario de inicio de sesión */}
        <div className="w-full flex flex-col justify-start ">
          {/* Contenedor verde en la parte superior */}
          <div className="w-full flex justify-between items-center">
            <div className="w-full pt-6 px-2 flex justify-end items-center">
              <Link href="/auth/register" passHref>
                <Button
                  variant="outline"
                  className="ml-auto border-none shadow-none bg-inherit"
                >
                  Registrarse
                </Button>
              </Link>
              <Link href="/home" passHref>
                <Button
                  variant="outline"
                  className="ml-auto border-none shadow-none bg-inherit"
                >
                  Acceder sin iniciar sesión
                </Button>
              </Link>
            </div>
          </div>

          {/* Contenedor para centrar el formulario */}
          <div className="flex flex-grow items-center justify-center">
            <Card className="mx-auto max-w-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
                <CardDescription>
                  Introduce tu email y contraseña para acceder a tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit}>
                  {error && (
                    <p className="border border-secondary text-red-500 px-2 py-1 text-sm rounded-full mb-6">
                      {error}
                    </p>
                  )}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email:</Label>
                      <Input
                        type="email"
                        {...register("email", {
                          required: {
                            value: true,
                            message: "Se requiere un email",
                          },
                        })}
                        placeholder="m@example.com"
                      />
                      {errors.email && (
                        <span className="text-red-500 text-xs">
                          {errors.email.message}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password">Contraseña:</Label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"} // Cambiar el tipo según si esta visible o no
                        {...register("password", {
                          required: {
                            value: true,
                            message: "Se requiere una contraseña",
                          },
                        })}
                        placeholder="******"
                      />
                      {errors.password && (
                        <span className="text-red-500 text-xs">
                          {errors.password.message}
                        </span>
                      )}
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading} // Deshabilitar el botón mientras está cargando
                    >
                      {loading ? (
                        <Loader2 className="animate-spin" /> // Muestra el ícono de carga
                      ) : (
                        "Iniciar sesión"
                      )}
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <Github className="mr-2" />
                      Iniciar sesión con Github
                    </Button>
                  </div>
                  <div className="mt-4 text-center text-sm">
                    ¿No tienes una cuenta?
                    <Link href="/auth/register" className="underline ml-1">
                      Regístrate
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sección izquierda */}
      <div className="w-1/2 flex flex-col p-8 justify-between bg-black">
        {/* Contenedor superior con el icono y texto alineados a la izquierda */}
        <div className="w-full p-4 gap-x-2 flex items-center">
          <span className="text-white font-semibold text-2xl">
            Bienvenido a Carsell
          </span>
          {/* Título más grande */}
        </div>

        {/* Contenedor inferior con texto */}
        <div className="w-full p-4 gap-y-2 flex flex-col items-start">
          <span className="text-white font-semibold">
            &quot;Este proyecto ha sido creado con la finalidad de interactuar
            con la aplicación, no para vender vehículos reales.&quot;
          </span>
          <span className="text-white font-semibold mt-1 text-sm">
            Hecho con ❤️ por Alonso
          </span>
        </div>
      </div>

      {/* Sección derecha con el formulario de inicio de sesión */}
      <div className="w-1/2 flex flex-col justify-start">
        {/* Contenedor verde en la parte superior */}
        <div className="w-full p-4 flex justify-between items-center">
          <div className="w-full p-4 flex justify-end items-center">
            <Link href="/auth/register" passHref>
              <Button
                variant="outline"
                className="ml-auto border-none shadow-none bg-inherit"
              >
                Registrarse
              </Button>
            </Link>
            <Link href="/home" passHref>
              <Button
                variant="outline"
                className="ml-auto border-none shadow-none bg-inherit"
              >
                Acceder sin iniciar sesión
              </Button>
            </Link>
          </div>
        </div>

        {/* Contenedor para centrar el formulario */}
        <div className="flex flex-grow items-center justify-center">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
              <CardDescription>
                Introduce tu email y contraseña para acceder a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                {error && (
                  <p className="border border-secondary text-red-500 px-2 py-1 text-sm rounded-full mb-6">
                    {error}
                  </p>
                )}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email:</Label>
                    <Input
                      type="email"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Se requiere un email",
                        },
                      })}
                      placeholder="m@example.com"
                    />
                    {errors.email && (
                      <span className="text-red-500 text-xs">
                        {errors.email.message}
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Contraseña:</Label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Se requiere una contraseña",
                        },
                      })}
                      placeholder="******"
                    />
                    {errors.password && (
                      <span className="text-red-500 text-xs">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                  <Button variant="outline" className="w-full" disabled>
                    <Github className="mr-2" />
                    Iniciar sesión con Github
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  ¿No tienes una cuenta?
                  <Link href="/auth/register" className="underline ml-1">
                    Regístrate
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
