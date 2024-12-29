"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { ChevronRight, Heart, Megaphone, Search, CarFront } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const iconMap = {
  Heart,
  Megaphone,
  CarFront,
  Search,
};

export function NavLinks({ navMain }) {
  const pathname = usePathname();
  const [activeItems, setActiveItems] = useState([]);
  const [collapsibles, setCollapsibles] = useState({});
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const savedCollapsibles = localStorage.getItem("navCollapsibles");
    if (savedCollapsibles) {
      setCollapsibles(JSON.parse(savedCollapsibles));
    } else {
      const initialCollapsibles = navMain.reduce(
        (acc, item) => ({ ...acc, [item.title]: true }),
        {}
      );
      setCollapsibles(initialCollapsibles);
      localStorage.setItem(
        "navCollapsibles",
        JSON.stringify(initialCollapsibles)
      );
    }
  }, [navMain]);

  useEffect(() => {
    const updatedItems = navMain.map((item) => ({
      ...item,
      isActive:
        item.url === pathname ||
        item.items?.some((subItem) => subItem.url === pathname),
      items: item.items?.map((subItem) => ({
        ...subItem,
        isActive: subItem.url === pathname,
      })),
    }));
    setActiveItems(updatedItems);
    setLoading(false);
  }, [pathname, navMain]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("navCollapsibles", JSON.stringify(collapsibles));
    }
  }, [collapsibles, isClient]);

  const toggleCollapsible = (itemTitle) => {
    setCollapsibles((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="space-y-2">
          <Skeleton className="h-8" />
          <Skeleton className="h-4  " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-8 " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-8 " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-4  " />
          <Skeleton className="h-4" />
        </div>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {activeItems.map((item) => {
        const Icon = iconMap[item.icon];
        const isOpen = collapsibles[item.title] !== false;

        return (
          <SidebarMenuItem key={item.title}>
            <Collapsible
              open={isOpen}
              onOpenChange={() => toggleCollapsible(item.title)}
              className="group/collapsible"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.title}</span>
                  <ChevronRight
                    className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={subItem.isActive}
                        className="flex items-center cursor-pointer text-muted-foreground"
                      >
                        <Link href={subItem.url} className="flex items-center">
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
