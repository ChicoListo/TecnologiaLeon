// app/ordenes/[id]/page.tsx (versión mejorada con shadcn/ui)
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function OrdenDetallesPage({ params }: { params: { id: string } }) {
    const { data: orden, error } = await supabase.from('ordenes').select('*').eq('id', params.id).single();

    if (error || !orden) return <p className="text-red-500">Error: No se pudo encontrar la orden.</p>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center">
                        <div>
                            <CardTitle className="text-2xl md:text-3xl">Orden de Reparación #{orden.id}</CardTitle>
                            <CardDescription>Detalles completos del cliente y el equipo.</CardDescription>
                        </div>
                        <Link href={`/ordenes/${orden.id}/editar`} className="mt-4 md:mt-0">
                            <Button>Editar Orden</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Información del Cliente</h3>
                            <p><strong className="text-muted-foreground">Cliente:</strong> {orden.nombre_cliente}</p>
                            <p><strong className="text-muted-foreground">Teléfono:</strong> {orden.telefono_cliente}</p>
                            <hr />
                            <h3 className="text-lg font-semibold text-foreground">Información del Equipo</h3>
                            <p><strong className="text-muted-foreground">Equipo:</strong> {orden.tipo_equipo}</p>
                            <p><strong className="text-muted-foreground">Marca y Modelo:</strong> {orden.marca_modelo}</p>
                            <p><strong className="text-muted-foreground">IMEI / N° Serie:</strong> {orden.numero_serie_imei}</p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Estado de la Reparación</h3>
                            <div>
                                <strong className="text-muted-foreground">Estado: </strong>
                                <span className="ml-2 bg-primary/20 text-primary-foreground py-1 px-3 rounded-full text-sm">
                                    {orden.estado_reparacion}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <p className="font-semibold text-muted-foreground">Problema Reportado:</p>
                                <p className="bg-muted p-3 rounded-md text-sm">{orden.problema_reportado}</p>
                            </div>
                            <p><strong className="text-muted-foreground">Accesorios:</strong> {orden.accesorios_entregados || 'Ninguno'}</p>
                        </div>
                    </div>
                    {orden.fotos_url && orden.fotos_url.length > 0 && (
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-foreground mb-4">Fotos Adjuntas</h3>
                            <div className="flex flex-wrap gap-4">
                                {orden.fotos_url.map((url: string, index: number) => (
                                    <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                                        <img src={url} alt={`Foto ${index + 1}`} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border hover:scale-105 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <div className="mt-6">
                <Link href="/">
                    <Button variant="outline">&larr; Volver al Dashboard</Button>
                </Link>
            </div>
        </div>
    );
}git add.