'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { Card, CardBody, CardHeader } from '@heroui/react'

// Mock data for charts
const salesData = [
  { month: 'Jan', products: 45, revenue: 4500 },
  { month: 'Fev', products: 52, revenue: 5200 },
  { month: 'Mar', products: 48, revenue: 4800 },
  { month: 'Abr', products: 61, revenue: 6100 },
  { month: 'Mai', products: 55, revenue: 5500 },
  { month: 'Jun', products: 67, revenue: 6700 },
]

const categoryData = [
  { name: 'Eletrônicos', value: 35, color: '#0070F3' },
  { name: 'Roupas', value: 25, color: '#7C3AED' },
  { name: 'Casa', value: 20, color: '#F59E0B' },
  { name: 'Esportes', value: 20, color: '#EF4444' },
]

const statusData = [
  { month: 'Jan', active: 85, inactive: 15 },
  { month: 'Fev', active: 88, inactive: 12 },
  { month: 'Mar', active: 82, inactive: 18 },
  { month: 'Abr', active: 90, inactive: 10 },
  { month: 'Mai', active: 87, inactive: 13 },
  { month: 'Jun', active: 92, inactive: 8 },
]

export default function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Produtos por Mês */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Produtos Criados por Mês</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="products" fill="#0070F3" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Line Chart - Revenue */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Receita por Mês (R$)</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#7C3AED"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Pie Chart - Categories */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Produtos por Categoria</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) =>
                  `${name} ${value}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      {/* Area Chart - Status */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Status dos Produtos (%)</h3>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="active" stackId="a" fill="#10B981" />
              <Bar dataKey="inactive" stackId="a" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  )
}