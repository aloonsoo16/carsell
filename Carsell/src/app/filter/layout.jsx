import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import DynamicBreadcrumb from "@/components/breadcrumb";
import { SheetProvider } from "@/context/sheet-provider";
import OpenFilterButton from "@/components/filter-button";

export default function EspecificLayout({ children }) {
  return (
    <SheetProvider>
      <SidebarProvider>
        <div className="grid grid-cols-[auto,1fr] w-full flex-grow">
          <div className="border-r">
            <AppSidebar />
          </div>
          <div className="flex flex-col w-full">
            <header className="sticky top-0 border-b backdrop-blur-sm bg-background/60 z-50">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="flex items-center">
                  <SidebarTrigger />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <DynamicBreadcrumb />
                </div>
                <div className="flex items-center">
                  <OpenFilterButton />
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-auto">
              <div className="p-4">{children}</div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </SheetProvider>
  );
}
