// app/page.tsx
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q;

  let supabaseQuery = supabase
    .from('ordenes')
    .select('*')
    .order('created_at', { ascending: false });

  // Si hay una consulta de búsqueda, añadimos el filtro
  if (query) {
    supabaseQuery = supabaseQuery.or(
      `nombre_cliente.ilike.%${query}%,marca_modelo.ilike.%${query}%,numero_serie_imei.ilike.%${query}%`
    );
  }

  const { data: ordenes, error } = await supabaseQuery;

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

      {/* Formulario de Búsqueda */}
      <div className="mb-4">
        <form method="GET" action="/">
          <input
            type="search"
            name="q"
            defaultValue={query || ''}
            placeholder="Buscar por cliente, modelo, IMEI..."
            className="w-full p-2 border rounded text-black"
          />
        </form>
      </div>

      {/* El resto de la página es igual... */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-800 text-white">
            {/* ... encabezados de la tabla ... */}
          </thead>
          <tbody>
            {ordenes && ordenes.length > 0 ? (
              ordenes.map((orden) => (
                // Ahora el <tr> es el elemento principal, no el <Link>
                <tr key={orden.id} className="border-t text-black text-center hover:bg-gray-100">
                  <td className="py-2 px-4">
                    {/* Ponemos el Link dentro de la celda. Ya no necesitamos legacyBehavior */}
                    <Link href={`/ordenes/${orden.id}`} className="text-blue-600 font-medium hover:underline">
                      #{orden.id}
                    </Link>
                  </td>
                  <td className="py-2 px-4">{orden.nombre_cliente}</td>
                  <td className="py-2 px-4">{orden.marca_modelo}</td>
                  <td className="py-2 px-4">
                    <span className="bg-yellow-200 text-yellow-800 py-1 px-3 rounded-full text-xs">
                      {orden.estado_reparacion}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-black">
                  {query ? `No se encontraron resultados para "${query}"` : 'No hay órdenes registradas.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}