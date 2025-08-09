// app/ordenes/[id]/editar/page.tsx
'use client';

import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Link from 'next/link'; // <--- ¡AQUÍ ESTÁ LA LÍNEA AÑADIDA!

// (El resto del código es idéntico al que ya tenías)
// ...
type Orden = {
    id: number | string;
    nombre_cliente: string;
    telefono_cliente: string;
    tipo_equipo: string;
    marca_modelo: string;
    numero_serie_imei: string | null;
    problema_reportado: string;
    estado_reparacion: string;
    fotos_url?: string[];
};

export default function EditarOrdenPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [orden, setOrden] = useState<Partial<Orden>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrden = async () => {
            if (!id) return;

            const { data, error } = await supabase
                .from('ordenes')
                .select('*')
                .eq('id', id)
                .single();

            if (data) {
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
                router.push('/');
            }
            setIsLoading(false);
        };

        fetchOrden();
    }, [id, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setOrden(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (value: string) => {
        setOrden(prev => ({ ...prev, estado_reparacion: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const updateData = { ...orden };
        delete updateData.id;
        if (!updateData.numero_serie_imei) delete updateData.numero_serie_imei;
        if (!updateData.fotos_url) delete updateData.fotos_url;

        const { error } = await supabase
            .from('ordenes')
            .update(updateData)
            .eq('id', id);

        if (error) {
            console.error("Error actualizando la orden:", error);
            alert(`Error actualizando la orden: ${error.message}`);
        } else {
            alert('Orden actualizada con éxito!');
            router.push(`/ordenes/${id}`);
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

    if (!orden || !orden.id) {
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
                        <div>
                            <Label htmlFor="problema_reportado">Problema Reportado</Label>
                            <Textarea id="problema_reportado" name="problema_reportado" value={orden.problema_reportado || ''} onChange={handleChange} className="min-h-[100px]" />
                        </div>
                        <div>
                            <Label htmlFor="estado_reparacion">Estado de la Reparación</Label>
                            <Select name="estado_reparacion" onValueChange={handleSelectChange} value={orden.estado_reparacion}>
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