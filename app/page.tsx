// app/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Esta página es un Componente de Servidor, se ejecuta en el servidor.
export default async function DashboardPage() {

  // 1. Obtener los datos directamente desde la base de datos
  const { data: ordenes, error } = await supabase
    .from('ordenes')
    .select('*') // Selecciona todas las columnas
    .order('created_at', { ascending: false }); // Muestra las más nuevas primero

  if (error) {
    return <p className="text-red-500">Error al cargar las órdenes: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard de Reparaciones</h1>
        <Link href="/nueva-orden" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          + Crear Nueva Orden
        </Link>
      </div>

      {/* 2. Mostrar los datos en una tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-2 px-4">Orden #</th>
              <th className="py-2 px-4">Cliente</th>
              <th className="py-2 px-4">Equipo</th>
              <th className="py-2 px-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id} className="border-t text-black text-center hover:bg-gray-100">
                <td className="py-2 px-4">{orden.id}</td>
                <td className="py-2 px-4">{orden.nombre_cliente}</td>
                <td className="py-2 px-4">{orden.marca_modelo}</td>
                <td className="py-2 px-4">
                  <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs">
                    {orden.estado_reparacion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}