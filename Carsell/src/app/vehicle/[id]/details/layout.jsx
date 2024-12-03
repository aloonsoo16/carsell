import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumb from "@/components/breadcrumb";

export default function EspecificLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-[auto,1fr] w-full h-screen flex-grow">
        <div className="border-r">
          <AppSidebar />
        </div>
        <div className="flex flex-col w-full overflow-auto">
          <header className="sticky top-0 z-50 border-b backdrop-blur-sm bg-background/60 w-full">
            <div className="flex h-16 items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <main className="flex-1 overflow-x-hidden w-full">
            <div className="p-4 lg:p-6">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
