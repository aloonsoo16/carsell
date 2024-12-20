"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

import { Github } from "lucide-react";

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
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(""); // Estado para el error de "Contraseñas no coinciden"
  const isMobile = useIsMobile();

  const onSubmit = handleSubmit(async (data) => {
    setServerError(""); // Limpiar el mensaje de error al enviar el formulario
    setPasswordMatchError(""); // Limpiar el error de contraseña al enviar el formulario

    // Verificar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      setPasswordMatchError("Las contraseñas no coinciden");
      return; // Evitar el envío del formulario si no coinciden
    }

    setLoading(true);

    // Enviar datos de registro al servidor
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      // Al registro exitoso, hacer el login automáticamente
      const loginRes = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        setServerError("Inicio de sesión fallido después del registro");
      } else {
        router.push("/home"); // Redirigir al dashboard si sale todo bien
        router.refresh(); // Refrescar la página si sale todo bien
      }
    } else {
      const result = await res.json();
      setServerError(result.message);
    }

    setLoading(false);
  });

  if (isMobile) {
    return (
      <div className="flex h-screen w-full overflow-hidde">
        <div className="w-full flex flex-col justify-start">
          <div className="w-full pt-6 px-2 flex justify-start items-center">
            <Link href="/auth/login" passHref>
              <Button
                variant="outline"
                className="ml-auto border-none shadow-none bg-inherit"
              >
                Iniciar sesion
              </Button>
            </Link>
            <Link href="/home" passHref>
              <Button
                variant="outline"
                className="ml-auto border-none shadow-none bg-inherit"
              >
                Acceder sin registrase
              </Button>
            </Link>
          </div>
          <div className="flex flex-grow items-center justify-center">
            <Card className="mx-auto max-w-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Registrarse</CardTitle>
                <CardDescription>
                  Regístrate para obtener acceso completo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSubmit}>
                  {/* Mostrar mensaje de error del servidor */}
                  {serverError && (
                    <p className="border border-secondary text-red-500 px-2 py-1 text-sm rounded-full mb-6">
                      {serverError}
                    </p>
                  )}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="username">Nombre de usuario:</Label>
                      <Input
                        type="text"
                        {...register("username", {
                          required: {
                            value: true,
                            message: "Nombre de usuario requerido",
                          },
                        })}
                        placeholder="usuario123"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs">
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email:</Label>
                      <Input
                        type="email"
                        {...register("email", {
                          required: {
                            value: true,
                            message: "Email requerido",
                          },
                        })}
                        placeholder="usuario1@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="password">Contraseña:</Label>
                      <Input
                        type="password"
                        {...register("password", {
                          required: {
                            value: true,
                            message: "Se requiere una contraseña",
                          },
                        })}
                        placeholder="********"
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">
                        Confirmar contraseña:
                      </Label>
                      <Input
                        type="password"
                        {...register("confirmPassword", {
                          required: {
                            value: true,
                            message: "Debes confirmar la contraseña ",
                          },
                        })}
                        placeholder="********"
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-xs">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                      {/* Mostrar el error de contraseñas no coincidentes */}
                      {passwordMatchError && (
                        <p className="text-red-500 text-xs">
                          {passwordMatchError}
                        </p>
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
                        "Registrarse"
                      )}
                    </Button>

                    <div className="flex items-center my-1">
                      <hr className="flex-grow border-gray-400" />
                      <span className="px-2 text-sm text-gray-400">
                        O CONTINÚA CON
                      </span>
                      <hr className="flex-grow border-gray-400" />
                    </div>

                    <Button variant="outline" className="w-full" disabled>
                      <Github className="mr-2" />
                      GitHub
                    </Button>

                    <div className="mt-4 text-center text-sm">
                      ¿Ya tienes una cuenta?
                      <Link href="/auth/login" className="underline ml-1">
                        Iniciar sesión
                      </Link>
                    </div>
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
    <div className="flex h-screen w-full overflow-hidden px-10 md:px-0">
      {/* Sección izquierda */}
      <div className="w-1/2 flex flex-col justify-start">
        {/* Contenedor verde en la parte superior */}
        <div className="w-full p-4 flex justify-start items-center">
          <Link href="/auth/login" passHref>
            <Button
              variant="outline"
              className="ml-auto border-none shadow-none bg-inherit"
            >
              Iniciar sesion
            </Button>
          </Link>
          <Link href="/home" passHref>
            <Button
              variant="outline"
              className="ml-auto border-none shadow-none bg-inherit"
            >
              Acceder sin registrarse
            </Button>
          </Link>
        </div>
        {/* Contenedor para centrar el formulario */}
        <div className="flex flex-grow items-center justify-center">
          <Card className="mx-auto max-w-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Registrarse</CardTitle>
              <CardDescription>
                Regístrate para obtener acceso completo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit}>
                {/* Mostrar mensaje de error del servidor */}
                {serverError && (
                  <p className="border border-secondary text-red-500 px-2 py-1 text-sm rounded-full mb-6">
                    {serverError}
                  </p>
                )}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Nombre de usuario:</Label>
                    <Input
                      type="text"
                      {...register("username", {
                        required: {
                          value: true,
                          message: "Nombre de usuario requerido",
                        },
                      })}
                      placeholder="usuario123"
                    />
                    {errors.username && (
                      <p className="text-red-500 text-xs">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email:</Label>
                    <Input
                      type="email"
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Email requerido",
                        },
                      })}
                      placeholder="usuario1@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Contraseña:</Label>
                    <Input
                      type="password"
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Se requiere una contraseña",
                        },
                      })}
                      placeholder="********"
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar contraseña:
                    </Label>
                    <Input
                      type="password"
                      {...register("confirmPassword", {
                        required: {
                          value: true,
                          message: "Debes confirmar la contraseña ",
                        },
                      })}
                      placeholder="********"
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    {/* Mostrar el error de contraseñas no coincidentes */}
                    {passwordMatchError && (
                      <p className="text-red-500 text-xs">
                        {passwordMatchError}
                      </p>
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
                      "Registrarse"
                    )}
                  </Button>

                  <div className="flex items-center my-1">
                    <hr className="flex-grow border-gray-400" />
                    <span className="px-2 text-sm text-gray-400">
                      O CONTINÚA CON
                    </span>
                    <hr className="flex-grow border-gray-400" />
                  </div>

                  <Button variant="outline" className="w-full" disabled>
                    <Github className="mr-2" />
                    GitHub
                  </Button>

                  <div className="mt-4 text-center text-sm">
                    ¿Ya tienes una cuenta?
                    <Link href="/auth/login" className="underline ml-1">
                      Iniciar sesión
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="w-1/2 flex flex-col p-8 justify-between md:bg-black">
        <div className="w-full p-4 gap-x-2 flex items-center justify-end">
          <span className="text-white font-semibold text-2xl">
            Bienvenido a Carsell
          </span>
        </div>

        {/* Contenedor inferior con texto */}
        <div className="w-full p-4 gap-y-2 flex  flex-col items-start order-2">
          <span className="text-white font-semibold">
            &quot;Este proyecto ha sido creado con la finalidad de interactuar
            con la aplicación, no para vender vehículos reales.&quot;
          </span>
          <span className="text-white font-semibold mt-1 text-sm">
            Hecho con ❤️ por Alonso
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
