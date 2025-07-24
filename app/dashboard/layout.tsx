import { DocsSidebarNav } from "@/components/sidebar-nav"
import { dashboardNavItems } from "@/lib/sidebar-items"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("min-h-screen flex bg-white dark:bg-black font-sans antialiased text-black dark:text-white")}>
      <aside className="w-64 border-r border-gray-200 dark:border-gray-800 px-4 py-6">
        <h2 className="text-2xl font-semibold mb-6">Neoliteral</h2>
        <DocsSidebarNav items={dashboardNavItems} />
      </aside>
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
