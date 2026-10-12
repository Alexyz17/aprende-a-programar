# Diseño de microservicios

> Una arquitectura de microservicios divide una aplicación en servicios pequeños e independientes que se despliegan por separado. Resuelve problemas reales de equipos y sistemas grandes, pero añade una complejidad enorme. En este curso aprenderás a decidir si los necesitas, a dividirlos bien y a resolver la comunicación, los datos y la operación.

## Monolito frente a microservicios

Un **monolito** es una única aplicación desplegable con todo dentro: usuarios, catálogo, pedidos, pagos.

```text
┌────────────── Monolito ──────────────┐
│ Usuarios · Catálogo · Pedidos · Pagos │──── Base de datos
└──────────────────────────────────────┘

┌─────────┐ ┌──────────┐ ┌─────────┐ ┌───────┐
│Usuarios │ │ Catálogo │ │ Pedidos │ │ Pagos │   Microservicios
└────┬────┘ └────┬─────┘ └────┬────┘ └───┬───┘
    BD         BD           BD          BD       (cada uno con sus datos)
```

| | Monolito | Microservicios |
| --- | --- | --- |
| Desarrollo inicial | Rápido | Lento |
| Despliegue | Todo junto | Cada servicio por separado |
| Escalado | Toda la aplicación | Solo lo que lo necesita |
| Fallos | Un error puede tumbarlo todo | Aislados (si se diseña bien) |
| Equipos | Se pisan al crecer mucho | Autonomía por servicio |
| Consultas entre módulos | Una llamada a función o un JOIN | Llamadas por red, consistencia eventual |
| Operación | Sencilla | Requiere CI/CD, observabilidad, orquestación |

> **Importante:** la mayoría de proyectos deberían empezar como un **monolito modular**: una sola aplicación, pero con módulos bien separados y con límites claros. Si algún día hace falta, esos módulos se extraen como servicios con mucho menos dolor. Muchas empresas que migraron a microservicios demasiado pronto han acabado volviendo atrás.

Señales de que los microservicios pueden compensar:

- Varios equipos que se bloquean entre sí al desplegar.
- Partes del sistema con necesidades de escala o de tecnología muy distintas.
- Requisitos de disponibilidad en los que un fallo en una zona no puede afectar a las demás.

## Dividir bien: dominios y contextos

El error más caro es dividir mal. Si para cualquier funcionalidad tienes que cambiar cinco servicios a la vez, has construido un **monolito distribuido**: lo peor de ambos mundos.

El **diseño guiado por el dominio** (DDD) propone dividir por **capacidades de negocio**, no por capas técnicas:

- Mal: "servicio de base de datos", "servicio de validación", "servicio de frontend".
- Bien: "Catálogo", "Pedidos", "Pagos", "Envíos", "Notificaciones".

Cada servicio corresponde a un **contexto delimitado** (*bounded context*): una zona del negocio con su propio lenguaje y su propio modelo. "Producto" no significa lo mismo para Catálogo (descripción, fotos, categorías) que para Envíos (peso, dimensiones) o para Facturación (precio, impuestos). Cada servicio guarda solo lo que necesita.

Criterios para un buen servicio:

- **Alta cohesión**: lo que cambia junto, vive junto.
- **Bajo acoplamiento**: se puede cambiar y desplegar sin coordinar con otros.
- **Dueño claro**: un equipo responsable.
- **Datos propios**: nadie más accede a su base de datos.

## Una base de datos por servicio

Cada servicio es dueño de sus datos y los expone **solo** a través de su API o de eventos. Si dos servicios comparten tablas, cualquier cambio de esquema los rompe a ambos.

Consecuencias que hay que asumir:

- **No hay JOIN entre servicios.** Para mostrar un pedido con el nombre del cliente, o se llama a otro servicio o se guarda una copia del dato que hace falta.
- **No hay transacciones globales.** Se usa la **consistencia eventual** y las sagas (lo veremos más adelante).
- **Duplicar datos es normal**: Pedidos puede guardar el nombre y la dirección del cliente en el momento de la compra.

## Comunicación síncrona

El servicio A llama a B y espera la respuesta: REST/HTTP o gRPC.

```text
Cliente ──▶ Pedidos ──HTTP──▶ Catálogo (¿hay stock?)
                     └─HTTP──▶ Pagos (cobrar)
```

Es sencillo de entender, pero crea **acoplamiento temporal**: si Pagos está caído o lento, Pedidos también falla. Con cadenas largas de llamadas, la disponibilidad total se multiplica a la baja (tres servicios al 99,9 % dan aproximadamente un 99,7 %).

Patrones de resiliencia imprescindibles:

| Patrón | Qué hace |
| --- | --- |
| *Timeout* | Nunca esperar indefinidamente |
| Reintentos con espera exponencial | Reintentar fallos transitorios, sin saturar al servicio caído |
| *Circuit breaker* | Si un servicio falla mucho, dejar de llamarlo un tiempo y responder con un plan B |
| *Fallback* | Respuesta degradada: mostrar el catálogo sin recomendaciones |
| *Bulkhead* | Limitar los recursos que puede consumir cada dependencia |
| Idempotencia | Que repetir una petición no duplique el efecto (claves de idempotencia en pagos) |

## Comunicación asíncrona con eventos

En lugar de llamar a otros servicios, un servicio **publica un evento** ("ha pasado esto") y quien esté interesado reacciona.

```text
Pedidos ──publica──▶ [ PedidoCreado ] ──▶ Pagos (cobra)
                                      ├─▶ Inventario (reserva stock)
                                      └─▶ Notificaciones (email de confirmación)
```

```json
{
  "tipo": "PedidoCreado",
  "id": "evt_01J9Z3K8",
  "ocurrido_en": "2026-10-12T18:04:11Z",
  "version": 1,
  "datos": { "pedido_id": 1042, "cliente_id": 77, "total": 59.90, "lineas": [{ "sku": "TEC-01", "cantidad": 1 }] }
}
```

Ventajas: el publicador no conoce a los consumidores, se pueden añadir consumidores nuevos sin tocarlo y, si un consumidor está caído, procesará los eventos al volver.

Herramientas: **Kafka** (registro de eventos de alto volumen), **RabbitMQ** (colas y enrutado flexible), **NATS**, servicios gestionados de la nube o [Redis Streams](/lecciones/redis-cache) para casos más sencillos.

Reglas para los eventos:

- Nombres en pasado: `PedidoCreado`, `PagoRechazado`.
- Incluye un **id único** y la **versión** del esquema.
- Los consumidores deben ser **idempotentes**: la mayoría de sistemas garantizan entrega *al menos una vez*, así que un evento puede llegar repetido.
- Cambia los esquemas de forma compatible (añadir campos, nunca quitar ni renombrar sin una versión nueva).

### El patrón outbox

Problema: guardas el pedido en tu base de datos y publicas el evento. Si el servicio se cae entre ambas cosas, hay un pedido sin evento (o un evento sin pedido).

Solución: en la **misma transacción** que guarda el pedido, guarda el evento en una tabla `outbox`. Un proceso aparte lee esa tabla y publica los eventos pendientes.

```sql
BEGIN;
INSERT INTO pedidos (...) VALUES (...);
INSERT INTO outbox (id, tipo, datos) VALUES ('evt_01J9Z3K8', 'PedidoCreado', '{...}');
COMMIT;
```

## Sagas: transacciones distribuidas

Un pedido implica reservar stock, cobrar y programar el envío, en tres servicios distintos. No hay una transacción que lo abarque todo. Una **saga** es una secuencia de pasos locales en la que cada paso tiene una **acción compensatoria** que lo deshace si algo falla después.

```text
1. Pedidos:     crear pedido (pendiente)      ↺ cancelar pedido
2. Inventario:  reservar stock                ↺ liberar stock
3. Pagos:       cobrar                        ↺ devolver el cobro
4. Envíos:      programar envío
   Si 3 falla → liberar stock (↺2) → cancelar pedido (↺1)
```

Dos estilos:

| Estilo | Funcionamiento | Pros y contras |
| --- | --- | --- |
| Coreografía | Cada servicio reacciona a eventos de los demás | Sin punto central; difícil de seguir cuando hay muchos pasos |
| Orquestación | Un orquestador indica a cada servicio qué hacer | Flujo explícito y fácil de depurar; el orquestador es una pieza más |

Herramientas como **Temporal** facilitan escribir flujos de larga duración con reintentos y compensaciones como si fuera código normal.

## API Gateway y BFF

Los clientes no deberían conocer decenas de servicios. Un **API Gateway** es la única puerta de entrada:

- Enruta cada petición al servicio correspondiente.
- Centraliza la autenticación, los límites de uso, CORS y TLS.
- Puede agregar respuestas de varios servicios.

Una variante es el **BFF** (*Backend for Frontend*): un gateway específico para cada tipo de cliente (web, app móvil), adaptado a lo que cada uno necesita.

> **Atención:** no metas lógica de negocio en el gateway. Si empieza a crecer con reglas de dominio, se convierte en un nuevo monolito por el que pasa todo.

## Event Sourcing y CQRS

**CQRS** (*Command Query Responsibility Segregation*) separa el modelo de escritura del de lectura. Las escrituras validan reglas de negocio; las lecturas usan vistas optimizadas (incluso en otra base de datos o en un buscador como Elasticsearch), actualizadas mediante eventos.

**Event Sourcing** guarda el estado como la **secuencia de eventos** que lo produjo, en lugar de solo el estado actual:

```text
CuentaAbierta(saldo=0) → DineroIngresado(100) → DineroRetirado(30) → DineroIngresado(50)
Saldo actual = reproducir los eventos = 120
```

Ventajas: auditoría completa, poder reconstruir el estado en cualquier momento y crear vistas nuevas a partir del historial. Inconvenientes: más complejidad, versionado de eventos y consultas que requieren proyecciones.

Úsalos en partes concretas del sistema donde aporten valor (contabilidad, auditoría, dominios con mucha lógica), no en todo por defecto.

## Observabilidad

Con una petición que atraviesa cinco servicios, "mirar el log" ya no basta. Los tres pilares:

- **Logs estructurados** (JSON) con un **id de correlación** que viaja en todas las llamadas de una misma petición.
- **Métricas**: latencia, tasa de errores y volumen por servicio (Prometheus y Grafana son el estándar abierto).
- **Trazas distribuidas**: el recorrido completo de una petición entre servicios, con el tiempo de cada tramo. **OpenTelemetry** es el estándar para instrumentar.

Define **SLO** (objetivos de nivel de servicio), por ejemplo "el 99 % de las peticiones de checkout en menos de 500 ms", y alerta cuando estés en riesgo de incumplirlos, no por cada error suelto.

## Despliegue y operación

Requisitos prácticos para que los microservicios funcionen:

- **CI/CD independiente** por servicio: tests, imagen y despliegue automáticos ([GitHub Actions](/lecciones/github-actions)).
- **Contenedores y orquestación** ([Docker](/lecciones/docker), [Kubernetes](/lecciones/kubernetes)).
- **Descubrimiento de servicios y configuración** centralizada.
- **Tests de contrato** (por ejemplo con Pact): comprueban que un cambio en un servicio no rompe a sus consumidores, sin levantar todo el sistema.
- **Despliegues graduales** (*canary*, *blue-green*) y *feature flags*.
- **Seguridad entre servicios**: autenticación mutua (mTLS) o tokens de servicio; un *service mesh* puede encargarse de ello.

Si no puedes tener todo esto, probablemente todavía no te convienen los microservicios.

## Caso práctico

Diseña la arquitectura de una tienda online que hoy es un monolito Laravel con problemas: el equipo ha pasado de 5 a 30 personas, las rebajas tumban toda la web y los despliegues tardan horas en coordinarse.

Una propuesta razonable y progresiva:

1. **Modulariza el monolito**: carpetas por dominio (Catálogo, Pedidos, Pagos, Envíos), sin acceder a tablas de otros módulos, comunicación mediante interfaces y eventos internos.
2. **Mide** dónde está el cuello de botella durante las rebajas (suele ser catálogo y búsqueda).
3. **Extrae primero lo que más gana**: el catálogo de lectura como servicio con caché agresiva y un buscador, alimentado por eventos `ProductoActualizado`.
4. **Pagos** después, por sus requisitos de seguridad y disponibilidad propios.
5. Introduce un **gateway**, trazas con OpenTelemetry y el patrón outbox antes de extraer más servicios.

> **Reto:** dibuja el diagrama de tu propuesta, lista los eventos que publicaría cada servicio y escribe la saga del proceso de compra con sus compensaciones. Explica qué sigue en el monolito y por qué. Saber justificar **por qué no** extraer algo es tan importante como saber extraerlo.
