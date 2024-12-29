import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumb from "@/components/breadcrumb";

export default function EspecificLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="grid grid-cols-[auto,1fr] w-full flex-grow">
        <div className="border-r">
          <AppSidebar />
        </div>
        <div className="flex flex-col w-full">
          <header className="sticky top-0 border-b backdrop-blur-sm bg-background/60 z-50">
            <div className="flex h-16 items-center px-4 ">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="p-4">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
