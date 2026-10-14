# Power BI desde cero

> Power BI es la herramienta de Microsoft para convertir datos en informes interactivos. Se usa en empresas de todos los tamaños para seguir ventas, costes, stock o cualquier indicador. No necesitas saber programar para empezar, pero si sabes un poco de SQL o de Excel avanzarás mucho más rápido.

## Qué es Power BI y para qué sirve

Power BI resuelve un problema muy común: los datos están repartidos en Excels, bases de datos y exportaciones de otros programas, y alguien tiene que juntarlos cada semana para hacer gráficos a mano. Con Power BI preparas ese proceso **una vez** y después el informe se actualiza solo.

El flujo de trabajo siempre tiene las mismas cuatro fases:

1. **Obtener datos**: conectar con Excel, CSV, SQL Server, PostgreSQL, una API, SharePoint…
2. **Transformar**: limpiar y dar forma a los datos con **Power Query**.
3. **Modelar**: relacionar tablas y crear cálculos con **DAX**.
4. **Visualizar y compartir**: gráficos, filtros e informes publicados en la web.

### Las piezas de Power BI

| Pieza | Para qué sirve |
| --- | --- |
| **Power BI Desktop** | Programa gratuito para Windows donde se construye el informe |
| **Servicio de Power BI** (app.powerbi.com) | Web donde se publican, comparten y actualizan los informes |
| **Power BI Mobile** | App para consultar los informes en el móvil |
| **Archivo `.pbix`** | El informe: datos, modelo, cálculos y páginas en un solo archivo |

> **Nota:** Power BI Desktop solo existe para Windows. En Mac o Linux puedes usar una máquina virtual con Windows (mira [Máquinas virtuales con Linux](/lecciones/maquinas-virtuales) para entender cómo funcionan) o probar el editor web del servicio, que tiene menos funciones.

## Instalación y primer vistazo

Descarga **Power BI Desktop** desde Microsoft Store (se actualiza solo cada mes) o desde la web de Microsoft. Es gratis y no necesitas cuenta para trabajar en local.

Al abrirlo verás tres vistas en la barra de la izquierda:

- **Vista de informe**: el lienzo donde colocas gráficos.
- **Vista de tabla**: los datos ya cargados, fila a fila.
- **Vista de modelo**: las tablas como cajas y las relaciones entre ellas.

A la derecha están los paneles de **Visualizaciones** (tipos de gráfico), **Datos** (tablas y columnas) y **Filtros**.

### Datos de práctica

Para seguir el curso crea una carpeta `curso-powerbi` con estos tres archivos CSV. Cópialos tal cual en el Bloc de notas y guárdalos con codificación UTF-8.

`ventas.csv`:

```csv
id_venta,fecha,id_producto,id_tienda,unidades,precio_unitario
1,2025-01-05,1,1,3,19.90
2,2025-01-12,2,2,1,49.00
3,2025-02-03,3,1,2,9.50
4,2025-02-18,1,3,5,19.90
5,2025-03-07,4,2,1,120.00
6,2025-03-21,2,1,2,49.00
7,2025-04-10,3,3,6,9.50
8,2025-04-28,4,1,1,120.00
9,2026-01-09,1,2,4,21.50
10,2026-02-14,2,3,3,49.00
11,2026-03-02,4,1,2,125.00
12,2026-04-19,3,2,8,9.90
```

`productos.csv`:

```csv
id_producto,producto,categoria,coste_unitario
1,Taza,Hogar,8.00
2,Mochila,Viaje,22.00
3,Libreta,Papelería,3.20
4,Auriculares,Electrónica,70.00
```

`tiendas.csv`:

```csv
id_tienda,tienda,ciudad
1,Centro,Barcelona
2,Norte,Terrassa
3,Online,Online
```

Son pocas filas a propósito: así puedes comprobar a mano que cada cálculo da lo que tiene que dar.

## Obtener datos

En la pestaña **Inicio → Obtener datos** verás decenas de conectores. Para los CSV:

1. **Obtener datos → Texto/CSV** y elige `ventas.csv`.
2. Aparece una vista previa. Comprueba que el delimitador es la coma y que la primera fila son los encabezados.
3. Pulsa **Transformar datos** (no "Cargar"): así revisas los tipos antes de cargar nada.

Repite el proceso con `productos.csv` y `tiendas.csv`.

### Importar o DirectQuery

Con bases de datos te preguntará el **modo de conectividad**:

| Modo | Cómo funciona | Cuándo usarlo |
| --- | --- | --- |
| **Importar** | Copia los datos dentro del `.pbix` y los comprime | Casi siempre: es el más rápido y permite todo DAX |
| **DirectQuery** | Cada gráfico lanza una consulta a la base de datos en vivo | Datos enormes o que deben verse al segundo |

> **Consejo:** empieza siempre con **Importar**. DirectQuery tiene limitaciones en DAX y Power Query, y el rendimiento depende de la base de datos.

## Limpiar datos con Power Query

Power Query es el editor que se abre con **Transformar datos**. Cada cambio que haces queda registrado como un **paso aplicado** en el panel de la derecha. Cuando el informe se actualice, Power Query repetirá esos pasos sobre los datos nuevos: por eso no hace falta volver a limpiar nada a mano.

Transformaciones que usarás constantemente:

- **Cambiar el tipo de dato**: fecha, número decimal, número entero, texto. Es lo primero que debes revisar.
- **Quitar columnas** que no vas a usar: menos columnas, modelo más ligero.
- **Filtrar filas**: quitar vacíos, pruebas o años que no interesan.
- **Reemplazar valores**: corregir "Barna" por "Barcelona".
- **Dividir columna** por un delimitador: separar "Nombre Apellido".
- **Columna personalizada**: calcular algo nuevo fila a fila.
- **Combinar consultas** (como un JOIN) y **anexar consultas** (como un UNION).

### Un ejemplo con ventas

En la consulta `ventas`:

1. Asegúrate de que `fecha` es de tipo **Fecha** y `precio_unitario` es **Número decimal**.
2. **Agregar columna → Columna personalizada** con el nombre `importe` y la fórmula `[unidades] * [precio_unitario]`.
3. Cambia el tipo de `importe` a **Número decimal**.

Si el CSV usa punto como separador decimal y tu Windows está en español, los decimales pueden leerse mal. Arréglalo con **Cambiar tipo → Usar configuración regional** y elige *Inglés (Estados Unidos)*.

> **Atención:** Power Query no modifica tu CSV original. Todo ocurre en la copia que se carga en Power BI.

### El lenguaje M

Detrás de cada paso hay código en el lenguaje **M**. Puedes verlo en **Inicio → Editor avanzado**:

```m
let
    Origen = Csv.Document(File.Contents("C:\curso-powerbi\ventas.csv"), [Delimiter = ",", Encoding = 65001]),
    Encabezados = Table.PromoteHeaders(Origen, [PromoteAllScalars = true]),
    Tipos = Table.TransformColumnTypes(
        Encabezados,
        {{"fecha", type date}, {"unidades", Int64.Type}, {"precio_unitario", type number}},
        "en-US"
    ),
    ConImporte = Table.AddColumn(Tipos, "importe", each [unidades] * [precio_unitario], type number)
in
    ConImporte
```

Cada línea del `let` es un paso que usa el resultado del anterior, y `in` indica cuál es el resultado final. No necesitas escribir M a mano para empezar, pero leerlo te ayudará a entender qué hace cada paso y a arreglar errores.

### Parámetros para la ruta

Si mueves la carpeta, todas las consultas fallan. Crea un parámetro con **Inicio → Administrar parámetros → Nuevo parámetro** (`Carpeta`, tipo Texto, valor `C:\curso-powerbi\`) y úsalo en el origen:

```m
Origen = Csv.Document(File.Contents(Carpeta & "ventas.csv"), [Delimiter = ",", Encoding = 65001])
```

Cuando termines, pulsa **Cerrar y aplicar**.

## Modelar los datos: el esquema en estrella

Un buen modelo es más importante que unos gráficos bonitos. El diseño recomendado en Power BI es el **esquema en estrella**:

- **Tabla de hechos**: lo que ocurre y se mide. Muchas filas y columnas numéricas. Aquí: `ventas`.
- **Tablas de dimensiones**: describen los hechos. Pocas filas y columnas de texto para filtrar y agrupar. Aquí: `productos`, `tiendas` y, pronto, `calendario`.

La tabla de hechos queda en el centro y las dimensiones alrededor, como las puntas de una estrella.

### Crear relaciones

Ve a la **vista de modelo**. Power BI suele detectar las relaciones solo; si no, arrastra `productos[id_producto]` sobre `ventas[id_producto]` y `tiendas[id_tienda]` sobre `ventas[id_tienda]`.

Cada relación tiene dos propiedades clave:

| Propiedad | Valor habitual | Significado |
| --- | --- | --- |
| **Cardinalidad** | Uno a varios (1:*) | Un producto aparece en muchas ventas |
| **Dirección del filtro** | Única | El filtro viaja de la dimensión a los hechos |

Con dirección única, si filtras la categoría "Hogar" en `productos`, la tabla `ventas` se filtra sola. Es lo que quieres el 95 % de las veces.

> **Atención:** evita la dirección del filtro **Ambas** y las relaciones **varios a varios** salvo que sepas exactamente por qué las necesitas. Generan resultados ambiguos y lentos.

Si ya conoces bases de datos relacionales, esto te sonará: son claves primarias y foráneas, como en [SQL desde cero](/lecciones/sql-basico).

### Oculta lo que no se usa

Clic derecho sobre las columnas de ID en `ventas` → **Ocultar en la vista de informe**. Quien construya gráficos debe usar `productos[producto]`, no `ventas[id_producto]`.

## La tabla calendario

Para analizar por año, mes o trimestre, y para comparar con el año anterior, necesitas una **tabla de fechas** con un día por fila y sin huecos. Créala con DAX en **Modelado → Nueva tabla**:

```dax
calendario =
ADDCOLUMNS (
    CALENDAR ( DATE ( 2025, 1, 1 ), DATE ( 2026, 12, 31 ) ),
    "Año", YEAR ( [Date] ),
    "Mes", FORMAT ( [Date], "mmmm" ),
    "Nº mes", MONTH ( [Date] ),
    "Trimestre", "T" & QUARTER ( [Date] ),
    "Año-Mes", FORMAT ( [Date], "yyyy-mm" )
)
```

Después:

1. Selecciona la tabla y pulsa **Herramientas de tabla → Marcar como tabla de fechas**, eligiendo la columna `Date`.
2. Relaciona `calendario[Date]` con `ventas[fecha]` (uno a varios).
3. Selecciona la columna `Mes` y en **Ordenar por columna** elige `Nº mes`. Si no, los meses salen en orden alfabético: abril, agosto, diciembre…

> **Consejo:** desactiva la opción **Archivo → Opciones → Datos cargados → Fecha y hora automáticas**. Crea una tabla de fechas oculta por cada columna de fecha y engorda el modelo sin necesidad.

## DAX: columnas calculadas y medidas

**DAX** (Data Analysis Expressions) es el lenguaje de fórmulas de Power BI. Se parece a las fórmulas de Excel, pero trabaja con tablas y columnas, no con celdas.

Hay dos formas de usarlo y conviene no confundirlas:

| | Columna calculada | Medida |
| --- | --- | --- |
| Se calcula | Al actualizar, una vez por fila | Al mostrar el gráfico, según los filtros |
| Ocupa memoria | Sí, se guarda en el modelo | No |
| Uso típico | Clasificar filas, crear categorías | Totales, porcentajes, comparaciones |

Regla práctica: **si va a ir en el eje o en un filtro, columna; si es un número que se agrega, medida**.

### Columna calculada

En `ventas`, **Nueva columna**:

```dax
Tamaño pedido =
IF ( ventas[unidades] >= 5, "Grande", "Normal" )
```

Para traer un dato de una dimensión relacionada usa `RELATED`:

```dax
Coste línea =
ventas[unidades] * RELATED ( productos[coste_unitario] )
```

### Tus primeras medidas

Crea una tabla vacía para guardar las medidas ordenadas (**Inicio → Especificar datos**, llámala `_Medidas`) y añade, con **Nueva medida**:

```dax
Ventas = SUM ( ventas[importe] )

Unidades = SUM ( ventas[unidades] )

Nº ventas = COUNTROWS ( ventas )

Coste = SUM ( ventas[Coste línea] )

Margen = [Ventas] - [Coste]

Margen % = DIVIDE ( [Margen], [Ventas] )
```

- Las medidas se referencian entre corchetes y **sin** nombre de tabla: `[Ventas]`. Las columnas, siempre con tabla: `ventas[importe]`.
- Usa `DIVIDE` en lugar de `/`: si el denominador es 0 devuelve vacío en vez de error.
- Da formato a cada medida en **Herramientas de medidas**: moneda para `Ventas`, porcentaje para `Margen %`.

Con los datos de práctica, `Ventas` total debe dar **1.184,40 €**. Compruébalo con una tarjeta.

### Iteradores: SUMX

Si no hubieras creado la columna `importe` en Power Query, podrías calcular las ventas recorriendo fila a fila:

```dax
Ventas (SUMX) =
SUMX ( ventas, ventas[unidades] * ventas[precio_unitario] )
```

`SUMX` evalúa la expresión en cada fila de la tabla y suma los resultados. Hay versiones para otras agregaciones: `AVERAGEX`, `MAXX`, `MINX`, `COUNTX`.

## Contexto de filtro y CALCULATE

Esta es la idea más importante de DAX. Una medida **no tiene un único valor**: se recalcula para cada celda del gráfico según los filtros que le llegan. Si pones `[Ventas]` en una tabla con una fila por categoría, en la fila "Hogar" el contexto de filtro es `categoria = "Hogar"`, y la medida suma solo esas ventas.

Los filtros vienen de las filas y columnas del gráfico, de los segmentadores, del panel de filtros y de los clics en otros gráficos.

### CALCULATE

`CALCULATE` evalúa una expresión **cambiando el contexto de filtro**:

```dax
Ventas Online =
CALCULATE ( [Ventas], tiendas[tienda] = "Online" )

Ventas Hogar 2026 =
CALCULATE ( [Ventas], productos[categoria] = "Hogar", calendario[Año] = 2026 )
```

Los filtros de `CALCULATE` sustituyen a los que ya hubiera sobre esa misma columna y se combinan con el resto.

### Quitar filtros: ALL y porcentajes del total

Para calcular qué porcentaje del total representa cada categoría necesitas el total **sin** el filtro de la fila:

```dax
Ventas todas las categorías =
CALCULATE ( [Ventas], ALL ( productos[categoria] ) )

% sobre total =
DIVIDE ( [Ventas], [Ventas todas las categorías] )
```

`REMOVEFILTERS` hace lo mismo que `ALL` dentro de `CALCULATE` y se lee mejor:

```dax
Ventas totales = CALCULATE ( [Ventas], REMOVEFILTERS ( productos ) )
```

### Variables

Con `VAR` evitas repetir cálculos y las fórmulas largas se leen mejor:

```dax
Crecimiento % =
VAR Actual = [Ventas]
VAR Anterior = [Ventas año anterior]
RETURN
    DIVIDE ( Actual - Anterior, Anterior )
```

> **Importante:** si un número te sale raro, pregúntate siempre *"¿qué filtros le llegan a esta celda?"*. El 90 % de los errores en DAX son de contexto.

## Inteligencia de tiempo

Con la tabla calendario marcada como tabla de fechas, DAX trae funciones para comparar periodos:

```dax
Ventas acumuladas año =
TOTALYTD ( [Ventas], calendario[Date] )

Ventas año anterior =
CALCULATE ( [Ventas], SAMEPERIODLASTYEAR ( calendario[Date] ) )

Ventas mes anterior =
CALCULATE ( [Ventas], DATEADD ( calendario[Date], -1, MONTH ) )
```

Pon `calendario[Año-Mes]` en el eje de una tabla con `[Ventas]`, `[Ventas año anterior]` y `[Crecimiento %]`: en marzo de 2026 deberías ver 250 € frente a 218 € de marzo de 2025.

> **Atención:** usa siempre las columnas de `calendario` en los gráficos y filtros, nunca `ventas[fecha]`. Si no, las funciones de inteligencia de tiempo devuelven resultados incorrectos.

## Visualizaciones: elegir el gráfico adecuado

| Quieres mostrar… | Usa |
| --- | --- |
| Un número clave (KPI) | **Tarjeta** |
| Evolución en el tiempo | **Gráfico de líneas** |
| Comparar categorías | **Barras** (horizontales si los nombres son largos) |
| Parte de un total con pocas categorías | **Barras apiladas** o **anillo** (máximo 4-5 porciones) |
| Detalle exacto | **Tabla** o **matriz** |
| Datos por ubicación | **Mapa** |
| Relación entre dos medidas | **Dispersión** |

Para crear un gráfico, selecciona el tipo en el panel de Visualizaciones y arrastra campos a sus casillas (**Eje X**, **Eje Y**, **Leyenda**, **Valores**).

### Un primer informe

1. Fila superior con cuatro **tarjetas**: `Ventas`, `Margen`, `Margen %` y `Nº ventas`.
2. **Gráfico de líneas** con `calendario[Año-Mes]` en el eje y `Ventas` y `Ventas año anterior` en valores.
3. **Barras** con `productos[categoria]` y `Ventas`.
4. **Matriz** con `tiendas[tienda]` en filas, `calendario[Año]` en columnas y `Ventas` en valores.

### Formato condicional

En una tabla o matriz, clic en la flecha del campo → **Formato condicional** → **Color de fondo** o **Iconos**. Por ejemplo, `Margen %` en verde si supera el 50 % y en rojo si baja del 30 %.

## Interactividad: segmentadores, filtros y drill-down

Lo que diferencia un informe de Power BI de un PDF es que se puede explorar:

- **Segmentadores** (*slicers*): botones o listas para filtrar la página. Añade uno con `calendario[Año]` y otro con `tiendas[ciudad]`.
- **Filtrado cruzado**: al hacer clic en una barra, el resto de gráficos se filtra. Ajusta qué gráfico afecta a cuál en **Formato → Editar interacciones**.
- **Panel de filtros**: filtros a nivel de gráfico, de página o de todo el informe.
- **Jerarquías y drill-down**: arrastra `Año`, `Trimestre` y `Mes` al eje y usa las flechas del gráfico para bajar de nivel.
- **Información sobre herramientas**: añade medidas al campo *Tooltips* para que aparezcan al pasar el ratón.
- **Obtener detalles** (*drill-through*): una página de detalle de producto a la que se llega con clic derecho desde cualquier gráfico.

### Sincronizar segmentadores

Si tienes varias páginas, **Vista → Sincronizar segmentadores** hace que el filtro de año se mantenga al cambiar de página.

## Diseño de informes que se entienden

Un informe técnicamente correcto puede ser inútil si nadie lo entiende. Reglas básicas:

1. **Una pregunta por página**: "¿Cómo van las ventas?", "¿Qué productos dejan más margen?".
2. **Lo importante, arriba a la izquierda**: es donde mira primero quien lee.
3. **Pocos colores y con significado**: un color de marca y uno para destacar. Rojo y verde solo para malo y bueno, y nunca como única pista (piensa en el daltonismo).
4. **Títulos que dicen algo**: mejor "Las ventas online crecen un 40 %" que "Ventas por tienda".
5. **Nada de efectos 3D ni gráficos de tarta con 12 porciones.**
6. **Alinea** los objetos con la cuadrícula (**Vista → Mostrar líneas de cuadrícula**) y deja aire entre ellos.
7. **Tema propio**: **Vista → Temas → Personalizar el tema actual** para fijar colores y fuentes en todo el informe.

> **Consejo:** antes de abrir Power BI, dibuja el informe en un papel con la persona que lo va a usar. Te ahorrará horas de rehacer páginas.

## Publicar y compartir

Para publicar necesitas iniciar sesión con una **cuenta profesional o educativa** de Microsoft (no sirve una cuenta personal tipo @outlook.com).

1. **Inicio → Publicar** y elige un área de trabajo. "Mi área de trabajo" es personal.
2. En app.powerbi.com tendrás el **modelo semántico** (los datos) y el **informe**.
3. Desde ahí puedes anclar gráficos a un **panel** (*dashboard*), compartir el informe o crear una **aplicación** para un grupo de personas.

| Licencia | Qué permite (resumido) |
| --- | --- |
| **Gratuita** | Crear informes y publicarlos en tu área personal |
| **Pro** | Compartir y colaborar con otros usuarios Pro |
| **Premium / Fabric** | Capacidad dedicada, modelos grandes y compartir con usuarios gratuitos |

Las condiciones de licencia cambian a menudo: consulta la documentación oficial de Microsoft antes de decidir nada en un proyecto real.

> **Atención:** la opción **Publicar en la web** genera un enlace público que **cualquiera** puede ver, sin iniciar sesión. Nunca la uses con datos de una empresa o con datos personales.

### Actualización programada

En la configuración del modelo semántico puedes programar actualizaciones diarias. Si los datos están en tu PC o en un servidor de la empresa (no en la nube), hace falta instalar una **puerta de enlace de datos local** (*on-premises data gateway*) para que el servicio pueda llegar hasta ellos.

## Seguridad a nivel de fila (RLS)

Con **RLS** cada persona ve solo sus datos dentro del mismo informe. Por ejemplo, que el responsable de la tienda Norte solo vea Terrassa:

1. **Modelado → Administrar roles → Nuevo rol** llamado `Terrassa`.
2. En la tabla `tiendas`, añade el filtro DAX:

```dax
[ciudad] = "Terrassa"
```

3. Pruébalo con **Ver como → Terrassa**.
4. Tras publicar, en el servicio asigna personas o grupos al rol.

Con RLS dinámico usas el email de quien mira el informe y una tabla de permisos:

```dax
[email_responsable] = USERPRINCIPALNAME ()
```

> **Importante:** RLS filtra los datos para quien **ve** el informe. Quien tiene permiso de edición en el área de trabajo ve todos los datos. Combínalo con permisos bien configurados, igual que harías en una aplicación web (mira [Seguridad básica en la web](/lecciones/seguridad-web)).

## Buenas prácticas y rendimiento

- **Limpia en Power Query, calcula en DAX**: las transformaciones de filas van antes de cargar; los agregados, en medidas.
- **Importa solo lo necesario**: menos columnas y menos años. Las columnas de texto con muchos valores distintos (IDs largos, comentarios) son las que más pesan.
- **Esquema en estrella siempre**: evita tablas gigantes "planas" con todo mezclado.
- **Medidas antes que columnas calculadas** para cualquier número que se sume.
- **Nombra bien**: `Ventas`, `Margen %`, no `Medida 1` ni `Sum of importe`. Agrupa las medidas en carpetas (**Propiedades → Carpeta para mostrar**).
- **Analizador de rendimiento** (**Optimizar → Analizador de rendimiento**): mide cuánto tarda cada gráfico y te dice si el problema es la consulta DAX o el dibujado.
- **Control de versiones**: guarda el proyecto como **Proyecto de Power BI (.pbip)**. Separa el informe y el modelo en archivos de texto que puedes versionar con Git (mira [Git esencial](/lecciones/git-esencial)).

### Power BI y programación

Si vienes del desarrollo, hay varios puntos de unión:

- **SQL**: conectar directamente con PostgreSQL o MySQL y escribir tus propias consultas como origen.
- **Python y R**: Power Query admite scripts de Python como paso de transformación, y hay un visual de Python para gráficos de matplotlib (mira [Python desde cero](/lecciones/python-basico)).
- **APIs**: el conector **Web** lee JSON de una API REST, como las que construyes en [APIs REST con Laravel](/lecciones/apis-rest).
- **Insertar informes** en tu propia aplicación web con Power BI Embedded y su SDK de JavaScript.

## Proyecto: informe de ventas completo

Con los datos de práctica (o, mejor, con datos públicos de tu ayuntamiento o del INE), construye un informe de tres páginas:

1. **Resumen**: tarjetas de `Ventas`, `Margen %`, `Crecimiento %` frente al año anterior y `Nº ventas`; gráfico de líneas mensual con el año actual y el anterior; segmentadores de año y ciudad sincronizados.
2. **Productos**: barras de ventas por categoría con `% sobre total` en la información sobre herramientas; matriz de producto por trimestre con formato condicional en el margen.
3. **Detalle de tienda**: página de obtención de detalles a la que se llega con clic derecho sobre cualquier tienda.

Requisitos técnicos:

- Ruta de los archivos en un **parámetro**.
- Modelo en **estrella** con tabla `calendario` marcada como tabla de fechas.
- Todas las medidas en la tabla `_Medidas`, con formato y nombre claro.
- Un **tema** propio con tus colores.

> **Ejercicio:** añade una medida `Ticket medio` (ventas entre número de ventas) y otra `Producto más vendido` que devuelva el nombre del producto con más unidades. Pista: busca cómo funcionan `TOPN` y `MAXX` juntos.

> **Reto:** crea un rol de RLS dinámico. Añade una tabla `responsables` con `email` e `id_tienda`, relaciónala con `tiendas` y haz que cada persona vea solo su tienda usando `USERPRINCIPALNAME()`. Comprueba el resultado con **Ver como** escribiendo distintos emails.
