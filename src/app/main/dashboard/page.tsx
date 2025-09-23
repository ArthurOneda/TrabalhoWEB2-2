import { Card } from "@/app/components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Financeiro</h1>

      {/* Resumo Financeiro */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <h3 className="text-lg font-medium text-blue-800">Receitas</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">R$ 8.500,00</p>
          <p className="text-sm text-blue-600 mt-1">+12% em relação ao mês passado</p>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <h3 className="text-lg font-medium text-red-800">Despesas</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">R$ 6.200,00</p>
          <p className="text-sm text-red-600 mt-1">-5% em relação ao mês passado</p>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <h3 className="text-lg font-medium text-green-800">Saldo</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">R$ 2.300,00</p>
          <p className="text-sm text-green-600 mt-1">Lucro este mês</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Categorias */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Despesas por Categoria</h2>
          <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Gráfico de Pizza (Será implementado com Recharts)</p>
          </div>
        </div>

        {/* Cotações + Alertas */}
        <div className="space-y-6">
          {/* Cotações */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cotações</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-2 border-b">
                <span className="font-medium">Dólar (USD)</span>
                <span className="font-bold text-green-600">R$ 5,62</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Ibovespa</span>
                <span className="font-bold text-red-600">128.450 pts</span>
              </div>
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximos Vencimentos</h2>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                <p className="font-medium text-red-800">Fatura Cartão de Crédito</p>
                <p className="text-sm text-red-600">Vence em 2 dias</p>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                <p className="font-medium text-yellow-800">Conta de Luz</p>
                <p className="text-sm text-yellow-600">Vence em 5 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}