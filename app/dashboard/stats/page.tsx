export const dynamic = "force-dynamic"

import { supabase } from "@/lib/supabase-admin"
import StatsChart from "@/components/StatsChart"

type Kpis = {
  total_readers: number
  total_subscriptions: number
  expected_books_per_user: number
  total_income: number
  expected_income_per_user: number
  average_income_per_subscription: number
  repurchase_rate: number
  total_paid_books: number
  total_free_books: number
}

type MonthlyRow = {
  month: string
  new_readers: number
  returning_readers: number
  total_subscriptions: number
}

export default async function StatsPage() {
  // KPIs globales
  const { data: kpiData, error: kpiError } = await supabase
    .from("app_kpis")
    .select("*")
    .single()

  // KPIs mensuales
  const { data: monthlyData, error: monthlyError } = await supabase
    .from("monthly_kpis")
    .select("*")
    .order("month", { ascending: true })

  if (kpiError) return <p className="text-red-500">Error loading stats</p>
  if (!kpiData) return <p>No data</p>

  const stats: Kpis = kpiData

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 Stats</h1>

      {/* KPIs globales */}
      <table className="w-full border text-sm mb-10">
        <tbody>
          <tr><td className="p-2 font-medium">Total readers</td><td className="p-2">{stats.total_readers}</td></tr>
          <tr><td className="p-2 font-medium">Total subscriptions</td><td className="p-2">{stats.total_subscriptions}</td></tr>
          <tr><td className="p-2 font-medium">Expected books per user</td><td className="p-2">{stats.expected_books_per_user.toFixed(2)}</td></tr>
          <tr><td className="p-2 font-medium">Expected income per user</td><td className="p-2">${stats.expected_income_per_user.toFixed(2)}</td></tr>
          <tr><td className="p-2 font-medium">Avg. income per subscription</td><td className="p-2">${stats.average_income_per_subscription.toFixed(2)}</td></tr>
          <tr><td className="p-2 font-medium">Re-purchase rate</td><td className="p-2">{(stats.repurchase_rate * 100).toFixed(0)}%</td></tr>
          <tr><td className="p-2 font-medium">Books with price</td><td className="p-2">{stats.total_paid_books}</td></tr>
          <tr><td className="p-2 font-medium">Books for free</td><td className="p-2">{stats.total_free_books}</td></tr>
        </tbody>
      </table>

      {/* KPIs mensuales */}
      <h2 className="text-xl font-semibold mb-4">📅 Monthly Metrics</h2>

      {monthlyError ? (
        <p className="text-red-500">Error loading monthly metrics</p>
      ) : (
        <>
          <table className="w-full border text-sm mb-6">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="text-left p-2 border-b">Month</th>
                <th className="text-left p-2 border-b">New Readers</th>
                <th className="text-left p-2 border-b">Returning</th>
                <th className="text-left p-2 border-b">Subscriptions</th>
              </tr>
            </thead>
            <tbody>
              {(monthlyData || []).map((row: MonthlyRow) => (
                <tr key={row.month} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="p-2 border-b">{row.month}</td>
                  <td className="p-2 border-b">{row.new_readers}</td>
                  <td className="p-2 border-b">{row.returning_readers}</td>
                  <td className="p-2 border-b">{row.total_subscriptions}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Gráfico de barras (componente cliente) */}
          <StatsChart data={monthlyData || []} />
        </>
      )}
    </div>
  )
}
