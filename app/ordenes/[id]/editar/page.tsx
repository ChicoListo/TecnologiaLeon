// app/ordenes/[id]/editar/page.tsx
'use client'; // Esta página es interactiva, necesita ser un Componente de Cliente

import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button'; // Asegúrate de que shadcn/ui está instalado
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input'; // Importa Input
import { Textarea } from '@/components/ui/textarea'; // Importa Textarea
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Importa Select
import { Label } from '@/components/ui/label'; // Importa Label
import { useParams } from 'next/navigation'; // Importa useParams

// Este type define la estructura de una orden
type Orden = {
    id: number | string; // El ID puede ser string o number dependiendo de Supabase
    nombre_cliente: string;
    telefono_cliente: string;
    tipo_equipo: string;
    marca_modelo: string;
    numero_serie_imei: string | null;
    problema_reportado: string;
    estado_reparacion: string;
    fotos_url?: string[]; // Opcional
};

export default function EditarOrdenPage() {
    const router = useRouter();
    const params = useParams(); // Obtenemos los params del hook
    const id = params.id as string; // Extraemos el ID y nos aseguramos que sea string

    const [orden, setOrden] = useState<Partial<Orden>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrden = async () => {
            if (!id) return; // Si no hay ID, salimos

            const { data, error } = await supabase
                .from('ordenes')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
                // Mapeamos los datos de Supabase a nuestro estado 'orden'
                // Asegurándonos de que los campos no nulos se manejen correctamente
                setOrden({
                    id: data.id,
                    nombre_cliente: data.nombre_cliente || '',
                    telefono_cliente: data.telefono_cliente || '',
                    tipo_equipo: data.tipo_equipo || '',
                    marca_modelo: data.marca_modelo || '',
                    numero_serie_imei: data.numero_serie_imei || '',
                    problema_reportado: data.problema_reportado || '',
                    estado_reparacion: data.estado_reparacion || 'Recibido',
                });
            } else if (error) {
                console.error("Error fetching orden:", error);
                alert("No se pudo cargar la orden.");
                router.push('/'); // Redirigir si hay error
            }
            setIsLoading(false);
        };

        fetchOrden();
    }, [id, router]); // Dependencias del useEffect

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setOrden(prev => ({ ...prev, [name]: value }));
    };

    // Manejo específico para el select de estado
    const handleSelectChange = (value: string) => {
        setOrden(prev => ({ ...prev, estado_reparacion: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Solo enviamos los campos que existen en nuestro estado 'orden'
        const updateData = { ...orden };
        // Asegurarnos de que campos como id no se sobrescriban accidentalmente si vinieran de otro lado
        delete updateData.id;
        if (!updateData.numero_serie_imei) delete updateData.numero_serie_imei;
        if (!updateData.fotos_url) delete updateData.fotos_url; // No editaremos fotos aquí aún

        const { error } = await supabase
            .from('ordenes')
            .update(updateData) // Enviamos solo los datos modificados
            .eq('id', id); // Condición: actualiza solo la orden con este ID

        if (error) {
            console.error("Error actualizando la orden:", error);
            alert(`Error actualizando la orden: ${error.message}`);
        } else {
            alert('Orden actualizada con éxito!');
            router.push(`/ordenes/${id}`); // Vuelve a la página de detalles de esta orden
        }
        setIsSubmitting(false);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p>Cargando datos de la orden...</p>
            </div>
        );
    }

    if (!orden || !orden.id) { // Si no hay orden (por ejemplo, si params.id era incorrecto)
        return (
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-3xl font-bold mb-6">Error al Cargar</h1>
                <p>No se pudo cargar la orden con el ID proporcionado.</p>
                <Link href="/" className="mt-4">
                    <Button variant="outline">&larr; Volver al Dashboard</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <CardTitle>Editando Orden #{orden.id}</CardTitle>
                    <CardDescription>Modifica los detalles de la reparación.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Sección Cliente */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nombre_cliente">Nombre Cliente</Label>
                                <Input id="nombre_cliente" name="nombre_cliente" value={orden.nombre_cliente || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="telefono_cliente">Teléfono Cliente</Label>
                                <Input id="telefono_cliente" name="telefono_cliente" value={orden.telefono_cliente || ''} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Sección Equipo */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="tipo_equipo">Tipo de Equipo</Label>
                                <Input id="tipo_equipo" name="tipo_equipo" value={orden.tipo_equipo || ''} onChange={handleChange} />
                            </div>
                            <div>
                                <Label htmlFor="marca_modelo">Marca y Modelo</Label>
                                <Input id="marca_modelo" name="marca_modelo" value={orden.marca_modelo || ''} onChange={handleChange} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="numero_serie_imei">IMEI / N° Serie</Label>
                            <Input id="numero_serie_imei" name="numero_serie_imei" value={orden.numero_serie_imei || ''} onChange={handleChange} />
                        </div>

                        {/* Sección Problema y Estado */}
                        <div>
                            <Label htmlFor="problema_reportado">Problema Reportado</Label>
                            <Textarea id="problema_reportado" name="problema_reportado" value={orden.problema_reportado || ''} onChange={handleChange} className="min-h-[100px]" />
                        </div>

                        <div>
                            <Label htmlFor="estado_reparacion">Estado de la Reparación</Label>
                            <Select name="estado_reparacion" onValueChange={handleSelectChange} defaultValue={orden.estado_reparacion}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Recibido">Recibido</SelectItem>
                                    <SelectItem value="En diagnóstico">En diagnóstico</SelectItem>
                                    <SelectItem value="Esperando repuesto">Esperando repuesto</SelectItem>
                                    <SelectItem value="En reparación">En reparación</SelectItem>
                                    <SelectItem value="Listo para entrega">Listo para entrega</SelectItem>
                                    <SelectItem value="Entregado">Entregado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Link href={`/ordenes/${id}`}>
                                <Button variant="outline" type="button">Cancelar</Button>
                            </Link>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}