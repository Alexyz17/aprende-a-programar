import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/react-avanzado', title: 'Hooks avanzados', free: true },
    { id: '/lecciones/react-avanzado#context', title: 'Context y estado global', free: true },
    { id: '/lecciones/react-avanzado#query', title: 'React Query — server state', free: true },
    { id: '/lecciones/react-avanzado#zustand', title: 'Zustand — client state', free: true },
    { id: '/lecciones/react-avanzado#rsc', title: 'Server Components', free: true },
    { id: '/lecciones/react-avanzado#optimizacion', title: 'Optimización y rendimiento', free: true },
    { id: '/lecciones/react-avanzado#patrones', title: 'Patrones avanzados', free: true },
    { id: '/lecciones/react-avanzado#testing', title: 'Testing con Vitest', free: true },
];

export default function ReactAvanzado() {
    return (
        <LessonLayout
            title="React avanzado"
            description="Hooks avanzados, React Query, Zustand, Server Components y optimización para apps React en producción."
            duration="5h 00min"
            lessons={26}
            level="Avanzado"
            premium={false}
            modules={modules}
            activeModule="/lecciones/react-avanzado"
            allUnlocked={true}
            category="Frontend"
        >
            <Head>
                <title>React avanzado — Aprende a Programar</title>
                <meta name="description" content="Curso completo de React avanzado: hooks, React Query, Zustand, Server Components y testing." />
            </Head>

            <h1>React avanzado</h1>

            <blockquote>
                Dominar React significa saber cuándo NO usar un hook, separar el estado del servidor del cliente, y construir componentes mantenibles. Este curso cubre los patrones y herramientas que usan los equipos profesionales en 2026.
            </blockquote>

            {/* ── 1. Hooks avanzados ── */}
            <h2 id="hooks">Hooks avanzados</h2>
            <pre><code>{`// useCallback — estabilizar referencias de funciones
const handleSubmit = useCallback(async (datos: FormData) => {
    await api.enviar(datos);
}, []); // sin dependencias = referencia estable

// useMemo — calcular valores costosos
const estadisticas = useMemo(() => ({
    total: ventas.length,
    suma: ventas.reduce((acc, v) => acc + v.monto, 0),
    promedio: ventas.length ? ventas.reduce((a, v) => a + v.monto, 0) / ventas.length : 0,
    maximo: Math.max(...ventas.map(v => v.monto)),
}), [ventas]); // recalcula solo cuando cambia ventas

// ❌ Anti-patrón: memo en todo
// La mayoría de los cálculos son tan rápidos que el overhead de memo > el costo del cálculo
// Solo usa useMemo/useCallback cuando tengas un problema real de rendimiento medido

// useRef — acceso al DOM y valores mutables sin re-render
function VideoPlayer({ src }: { src: string }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const reproduccionesRef = useRef(0); // no provoca re-render al cambiar

    const reproducir = () => {
        videoRef.current?.play();
        reproduccionesRef.current++;
    };

    return <video ref={videoRef} src={src} />;
}

// useId — IDs únicos y estables para accesibilidad
function Campo({ label, tipo = 'text' }: { label: string; tipo?: string }) {
    const id = useId();
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <input id={id} type={tipo} />
        </div>
    );
}

// useTransition — marcar actualizaciones como no urgentes
function Buscador() {
    const [busqueda, setBusqueda] = useState('');
    const [resultados, setResultados] = useState<string[]>([]);
    const [isPending, startTransition] = useTransition();

    function handleChange(valor: string) {
        setBusqueda(valor);  // urgente: actualizar el input
        startTransition(() => {
            // no urgente: el filtrado puede esperar si hay interacción
            setResultados(datos.filter(d => d.includes(valor)));
        });
    }

    return (
        <>
            <input value={busqueda} onChange={e => handleChange(e.target.value)} />
            {isPending && <span>Filtrando...</span>}
            <ul>{resultados.map(r => <li key={r}>{r}</li>)}</ul>
        </>
    );
}`}</code></pre>

            {/* ── 2. Context ── */}
            <h2 id="context">Context — cuándo y cómo</h2>
            <pre><code>{`// Patrón completo: Context + Provider + custom hook
type TemaContextType = {
    tema: 'oscuro' | 'claro';
    toggleTema: () => void;
};

const TemaContext = createContext<TemaContextType | null>(null);

export function TemaProvider({ children }: { children: React.ReactNode }) {
    const [tema, setTema] = useLocalStorage<'oscuro' | 'claro'>('tema', 'oscuro');

    const toggleTema = useCallback(() => {
        setTema(t => t === 'oscuro' ? 'claro' : 'oscuro');
    }, [setTema]);

    // Aplicar clase al documento
    useEffect(() => {
        document.documentElement.classList.toggle('dark', tema === 'oscuro');
    }, [tema]);

    return (
        <TemaContext.Provider value={{ tema, toggleTema }}>
            {children}
        </TemaContext.Provider>
    );
}

export function useTema() {
    const ctx = useContext(TemaContext);
    if (!ctx) throw new Error('useTema debe usarse dentro de <TemaProvider>');
    return ctx;
}

// Cuándo NO usar Context:
// - Para datos del servidor (usa React Query)
// - Para estado local de un componente (usa useState)
// - Si solo necesitas prop drilling de 1-2 niveles (pasa las props)
// Context es para: tema, idioma, usuario autenticado, preferencias globales`}</code></pre>

            {/* ── 3. React Query ── */}
            <h2 id="query">React Query — estado del servidor</h2>
            <pre><code>{`import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query básica con tipado
const { data: usuarios, isLoading, error } = useQuery({
    queryKey: ['usuarios'],
    queryFn: (): Promise<Usuario[]> => api.getUsuarios(),
    staleTime: 5 * 60 * 1000,   // datos frescos por 5 minutos
    gcTime: 10 * 60 * 1000,     // en caché 10 minutos tras desmontar
});

// Query con parámetros — se refetch cuando cambia la queryKey
const { data: usuario } = useQuery({
    queryKey: ['usuarios', usuarioId],
    queryFn: () => api.getUsuario(usuarioId),
    enabled: !!usuarioId,  // solo ejecutar si hay ID
});

// Mutations — crear, actualizar, eliminar
const queryClient = useQueryClient();

const crearUsuario = useMutation({
    mutationFn: (datos: CrearUsuarioDTO) => api.crearUsuario(datos),
    onSuccess: (nuevoUsuario) => {
        // Actualización optimista: añadir a la caché sin esperar
        queryClient.setQueryData<Usuario[]>(['usuarios'], (prev = []) => [
            ...prev, nuevoUsuario
        ]);
        // Invalidar para refetch en segundo plano
        queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
    onError: (error) => {
        toast.error('Error al crear usuario: ' + error.message);
    },
});

// Uso en el componente
function FormularioUsuario() {
    const { mutate, isPending } = crearUsuario;

    return (
        <button
            onClick={() => mutate({ nombre: 'Ana', email: 'ana@test.com' })}
            disabled={isPending}
        >
            {isPending ? 'Creando...' : 'Crear usuario'}
        </button>
    );
}

// Infinite queries — scroll infinito
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['posts', filtros],
    queryFn: ({ pageParam = 1 }) => api.getPosts({ pagina: pageParam, ...filtros }),
    getNextPageParam: (ultima) => ultima.siguiente ?? undefined,
    initialPageParam: 1,
});
const posts = data?.pages.flatMap(p => p.datos) ?? [];`}</code></pre>

            {/* ── 4. Zustand ── */}
            <h2 id="zustand">Zustand — estado del cliente</h2>
            <pre><code>{`import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// Store tipado con immer para mutaciones inmutables legibles
interface CarritoStore {
    items: ItemCarrito[];
    añadir: (producto: Producto, cantidad?: number) => void;
    quitar: (productoId: string) => void;
    actualizar: (productoId: string, cantidad: number) => void;
    vaciar: () => void;
    total: () => number;
    cantidad: () => number;
}

const useCarritoStore = create<CarritoStore>()(
    devtools(
        persist(
            immer((set, get) => ({
                items: [],

                añadir: (producto, cantidad = 1) => set(state => {
                    const existente = state.items.find(i => i.productoId === producto.id);
                    if (existente) {
                        existente.cantidad += cantidad;
                    } else {
                        state.items.push({ productoId: producto.id, producto, cantidad });
                    }
                }),

                quitar: (productoId) => set(state => {
                    state.items = state.items.filter(i => i.productoId !== productoId);
                }),

                actualizar: (productoId, cantidad) => set(state => {
                    const item = state.items.find(i => i.productoId === productoId);
                    if (item) item.cantidad = cantidad;
                }),

                vaciar: () => set(state => { state.items = []; }),

                total: () => get().items.reduce((acc, i) => acc + i.producto.precio * i.cantidad, 0),
                cantidad: () => get().items.reduce((acc, i) => acc + i.cantidad, 0),
            })),
            { name: 'carrito-storage' }  // persiste en localStorage
        )
    )
);

// Uso — solo subscribe a lo que necesitas
function ContadorCarrito() {
    const cantidad = useCarritoStore(s => s.cantidad());  // solo re-renderiza si cambia cantidad
    return <span>{cantidad}</span>;
}`}</code></pre>

            {/* ── 5. RSC ── */}
            <h2 id="rsc">Server Components — cuándo usarlos</h2>
            <pre><code>{`// React Server Components (Next.js App Router)
// Se ejecutan en el servidor — sin JavaScript en el cliente

// ✅ Perfecto para Server Components:
// - Fetching de datos (directamente a la BD)
// - Componentes estáticos o que no necesitan interactividad
// - Layouts y páginas

// Server Component (por defecto en app/)
async function PaginaProductos() {
    // Fetch directo — sin useEffect, sin useState
    const productos = await db.query('SELECT * FROM productos WHERE activo = true');

    return (
        <main>
            <h1>Productos</h1>
            <ListaProductos productos={productos} />  {/* puede ser server o client */}
            <FiltrosInteractivos />  {/* debe ser client si tiene estado */}
        </main>
    );
}

// Client Component — solo cuando necesitas:
// - Estado (useState, useReducer)
// - Efectos (useEffect)
// - Event handlers (onClick, onChange)
// - APIs del navegador (localStorage, window)
'use client';

function FiltrosInteractivos() {
    const [categoria, setCategoria] = useState('todos');
    return (
        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
            {/* opciones */}
        </select>
    );
}

// Streaming con Suspense — enviar HTML parcial antes de tener todos los datos
async function Dashboard() {
    return (
        <div>
            <Suspense fallback={<Skeleton />}>
                <Estadisticas />  {/* tarda más — se envía cuando esté lista */}
            </Suspense>
            <Suspense fallback={<ListaSkeleton />}>
                <UltimasVentas />
            </Suspense>
        </div>
    );
}`}</code></pre>

            {/* ── 6. Optimización ── */}
            <h2 id="optimizacion">Optimización y rendimiento</h2>
            <pre><code>{`// React.memo — solo re-renderiza si cambian las props
const TarjetaProducto = React.memo(function TarjetaProducto({ producto, onAñadir }) {
    return (
        <div>
            <h3>{producto.nombre}</h3>
            <button onClick={() => onAñadir(producto)}>Añadir</button>
        </div>
    );
}, (prevProps, nextProps) => {
    // Comparación personalizada (opcional)
    return prevProps.producto.id === nextProps.producto.id;
});

// Diagnóstico con React Profiler
import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
    if (actualDuration > 16) {  // más de un frame a 60fps
        console.warn(\`\${id} tardó \${actualDuration}ms en \${phase}\`);
    }
}

<Profiler id="ListaProductos" onRender={onRender}>
    <ListaProductos />
</Profiler>

// Code splitting — cargar componentes bajo demanda
const EditorRico = lazy(() => import('./EditorRico'));

function Articulo({ modoEdicion }) {
    return (
        <Suspense fallback={<div>Cargando editor...</div>}>
            {modoEdicion && <EditorRico />}
        </Suspense>
    );
}

// Virtualización — renderizar solo lo visible
import { useVirtualizer } from '@tanstack/react-virtual';

function ListaVirtual({ items }) {
    const parentRef = useRef(null);
    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 60,
    });

    return (
        <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
            <div style={{ height: virtualizer.getTotalSize() }}>
                {virtualizer.getVirtualItems().map(item => (
                    <div key={item.key}
                        style={{ transform: \`translateY(\${item.start}px)\`, position: 'absolute' }}>
                        <FilaItem item={items[item.index]} />
                    </div>
                ))}
            </div>
        </div>
    );
}`}</code></pre>

            {/* ── 7. Patrones ── */}
            <h2 id="patrones">Patrones avanzados de componentes</h2>
            <pre><code>{`// Compound Components — API declarativa con estado compartido
const TabsContext = createContext<{ activo: string; setActivo: (id: string) => void } | null>(null);

function Tabs({ children, defecto }: { children: React.ReactNode; defecto: string }) {
    const [activo, setActivo] = useState(defecto);
    return <TabsContext.Provider value={{ activo, setActivo }}>{children}</TabsContext.Provider>;
}

Tabs.Lista = function TabsLista({ children }: { children: React.ReactNode }) {
    return <div role="tablist" className="flex gap-2">{children}</div>;
};

Tabs.Tab = function Tab({ id, children }: { id: string; children: React.ReactNode }) {
    const { activo, setActivo } = useContext(TabsContext)!;
    return (
        <button role="tab" aria-selected={activo === id} onClick={() => setActivo(id)}>
            {children}
        </button>
    );
};

Tabs.Panel = function Panel({ id, children }: { id: string; children: React.ReactNode }) {
    const { activo } = useContext(TabsContext)!;
    return activo === id ? <div role="tabpanel">{children}</div> : null;
};

// Uso declarativo
<Tabs defecto="general">
    <Tabs.Lista>
        <Tabs.Tab id="general">General</Tabs.Tab>
        <Tabs.Tab id="avanzado">Avanzado</Tabs.Tab>
    </Tabs.Lista>
    <Tabs.Panel id="general"><ConfigGeneral /></Tabs.Panel>
    <Tabs.Panel id="avanzado"><ConfigAvanzado /></Tabs.Panel>
</Tabs>`}</code></pre>

            {/* ── 8. Testing ── */}
            <h2 id="testing">Testing con Vitest y Testing Library</h2>
            <pre><code>{`import { render, screen, userEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FormularioLogin } from './FormularioLogin';

function renderConProviders(ui: React.ReactElement) {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={qc}>
            {ui}
        </QueryClientProvider>
    );
}

describe('FormularioLogin', () => {
    it('muestra errores de validación con campos vacíos', async () => {
        const user = userEvent.setup();
        renderConProviders(<FormularioLogin onExito={vi.fn()} />);

        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
    });

    it('llama a onExito con credenciales correctas', async () => {
        const onExito = vi.fn();
        const user = userEvent.setup();
        renderConProviders(<FormularioLogin onExito={onExito} />);

        await user.type(screen.getByLabelText(/email/i), 'test@test.com');
        await user.type(screen.getByLabelText(/contraseña/i), 'secret123');
        await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

        expect(onExito).toHaveBeenCalledOnce();
    });
});`}</code></pre>

            <h2>Proyecto final</h2>
            <p>
                Construirás una aplicación completa de gestión de proyectos con: autenticación (Context + React Query), tablero Kanban con drag-and-drop (Zustand), búsqueda debounced, scroll infinito y tests de integración. Stack: React + TypeScript + React Query + Zustand + Tailwind.
            </p>
        </LessonLayout>
    );
}
