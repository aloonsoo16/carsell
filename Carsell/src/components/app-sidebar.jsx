import { NavLinks } from "@/lib/nav-links";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User, ChevronsUpDown, Car } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserFooter from "@/components/user-footer";
import LoginFooter from "@/components/login-footer";

export async function AppSidebar() {
  const session = await getServerSession(authOptions);
  const data = {
    user: {
      name: session?.user?.name || "Iniciar sesión",
      email: session?.user?.email || "Para acceso total",
    },
    navMain: [
      {
        title: "Explorar vehículos",
        icon: "CarFront",
        items: [
          { title: "Todos los vehículos", url: "/home" },
          { title: "Vehículos seminuevos", url: "/filter?minKilometers=5000" },
          { title: "Vehículos nuevos", url: "/filter?maxKilometers=2500" }, 
        ],
      },
      {
        title: "Anuncios",
        icon: "Megaphone",
        items: [
          { title: "Publicar un anuncio", url: "/new" }, 
          { title: "Mis anuncios", url: "/myads" }, 
        ],
      },
      {
        title: "Favoritos",
        icon: "Heart",
        items: [{ title: "Mis vehiculos favoritos", url: "/favorites" }],
      },
      {
        title: "Filtrador de vehículos",
        icon: "Search",
        items: [{ title: "Aplicar filtros", url: "/filter", sheet: true }],
      },
    ],
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="justify-center flex px-2 pt-4 pb-2">
        <div className="inline-flex items-center justify-center bg-gradient-to-r from-secondary/80 to-transparent rounded-lg p-1">
          <Car size={28} />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Acciones</SidebarGroupLabel>
          <NavLinks navMain={data.navMain} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage alt={data.user.name} src="" />
                    <AvatarFallback className="rounded-lg">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {data.user.name}
                    </span>
                    <span className="truncate text-xs">{data.user.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage alt={data.user.name} src="" />
                      <AvatarFallback className="rounded-lg">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {data.user.name}
                      </span>
                      <span className="truncate text-xs">
                        {data.user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                {session ? (
                  <>
                    <UserFooter />
                  </>
                ) : (
                  <LoginFooter />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
