// app/ordenes/[id]/editar/page.tsx
'use client'; // Esta página es interactiva, necesita ser un Componente de Cliente

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Este type define la estructura de una orden
type Orden = {
    nombre_cliente: string;
    telefono_cliente: string;
    tipo_equipo: string;
    marca_modelo: string;
    numero_serie_imei: string | null;
    problema_reportado: string;
    estado_reparacion: string;
};

export default function EditarOrdenPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [orden, setOrden] = useState<Partial<Orden>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrden = async () => {
            const { data, error } = await supabase
                .from('ordenes')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setOrden(data);
            }
            setIsLoading(false);
        };

        fetchOrden();
    }, [params.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrden(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase
            .from('ordenes')
            .update(orden)
            .eq('id', params.id);

        if (error) {
            alert(`Error actualizando la orden: ${error.message}`);
        } else {
            alert('Orden actualizada con éxito!');
            router.push(`/ordenes/${params.id}`); // Vuelve a la página de detalles
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return <p>Cargando datos de la orden...</p>;
    }

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Editando Orden #{params.id}</h1>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
                {/* Añade todos los campos del formulario como en 'nueva-orden' pero con 'value={orden.campo || ''}' */}
                <div>
                    <label className="block text-sm font-medium text-white">Nombre Cliente</label>
                    <input type="text" name="nombre_cliente" value={orden.nombre_cliente || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Teléfono</label>
                    <input type="text" name="telefono_cliente" value={orden.telefono_cliente || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Marca y Modelo</label>
                    <input type="text" name="marca_modelo" value={orden.marca_modelo || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Problema Reportado</label>
                    <textarea name="problema_reportado" value={orden.problema_reportado || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-white">Estado de la Reparación</label>
                    <select name="estado_reparacion" value={orden.estado_reparacion || ''} onChange={handleChange} className="w-full p-2 border rounded">
                        <option value="Recibido">Recibido</option>
                        <option value="En diagnóstico">En diagnóstico</option>
                        <option value="Esperando repuesto">Esperando repuesto</option>
                        <option value="En reparación">En reparación</option>
                        <option value="Listo para entrega">Listo para entrega</option>
                        <option value="Entregado">Entregado</option>
                    </select>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                    {isSubmitting ? 'Guardando cambios...' : 'Guardar Cambios'}
                </button>
            </form>
        </div>
    );
}