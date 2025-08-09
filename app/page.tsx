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
                <Link legacyBehavior key={orden.id} href={`/ordenes/${orden.id}`} passHref>
                  {/* ... contenido de la fila de la tabla ... */}
                </Link>
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