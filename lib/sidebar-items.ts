// lib/sidebar-items.ts
import { SidebarNavItem } from "@/types"

export const dashboardNavItems: SidebarNavItem[] = [
  {
    title: "Dashboard",
    items: [
      {
        title: "Books",
        href: "/dashboard/books",
      },
      {
        title: "Users",
        href: "/dashboard/users",
      },
      {
        title: "Stats",
        href: "/dashboard/stats",
      },
    ],
  },
]
