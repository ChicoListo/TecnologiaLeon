// app/nueva-orden/page.tsx
'use client'; // Esto es un Componente de Cliente

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function NuevaOrdenPage() {
    const [nombreCliente, setNombreCliente] = useState('');
    const [telefonoCliente, setTelefonoCliente] = useState('');
    const [tipoEquipo, setTipoEquipo] = useState('');
    const [marcaModelo, setMarcaModelo] = useState('');
    const [problemaReportado, setProblemaReportado] = useState('');
    const [fotos, setFotos] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFotos(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // 1. Subir imágenes a Supabase Storage
            const uploadedImageUrls: string[] = [];
            for (const file of fotos) {
                const filePath = `public/${Date.now()}-${file.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('fotos-equipos')
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('fotos-equipos')
                    .getPublicUrl(uploadData.path);

                uploadedImageUrls.push(urlData.publicUrl);
            }

            // 2. Insertar la orden en la tabla `ordenes` de PostgreSQL
            const { error: insertError } = await supabase.from('ordenes').insert([
                {
                    nombre_cliente: nombreCliente,
                    telefono_cliente: telefonoCliente,
                    tipo_equipo: tipoEquipo,
                    marca_modelo: marcaModelo,
                    problema_reportado: problemaReportado,
                    fotos_url: uploadedImageUrls,
                    estado_reparacion: 'Recibido', // Estado inicial
                },
            ]);

            if (insertError) throw insertError;

            alert('Orden creada con éxito!');
            router.push('/'); // Redirige al dashboard
        } catch (error: any) {
            console.error('Error creando la orden:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Crear Nueva Orden de Reparación</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">Nombre Cliente</label>
                    <input type="text" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} required className="w-full p-2 border rounded text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Teléfono Cliente</label>
                    <input type="text" value={telefonoCliente} onChange={(e) => setTelefonoCliente(e.target.value)} required className="w-full p-2 border rounded text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Tipo de Equipo</label>
                    <input type="text" value={tipoEquipo} onChange={(e) => setTipoEquipo(e.target.value)} required className="w-full p-2 border rounded text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Marca y Modelo</label>
                    <input type="text" value={marcaModelo} onChange={(e) => setMarcaModelo(e.target.value)} required className="w-full p-2 border rounded text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Problema Reportado</label>
                    <textarea value={problemaReportado} onChange={(e) => setProblemaReportado(e.target.value)} required className="w-full p-2 border rounded text-black" />
                </div>
                <div>
                    <label className="block text-sm font-medium">Fotos del Equipo</label>
                    <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:bg-gray-400">
                    {isSubmitting ? 'Guardando...' : 'Crear Orden'}
                </button>
            </form>
        </div>
    );
}