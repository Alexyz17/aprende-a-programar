# Excel para análisis de datos

> Antes de Power BI, Python o SQL, casi todo análisis de datos en una empresa empieza en una hoja de cálculo. Dominar Excel de verdad (tablas, búsquedas, funciones dinámicas, tablas dinámicas y Power Query) te hace mucho más útil en cualquier puesto, y lo que aprendas aquí lo reutilizarás en [Power BI desde cero](/lecciones/power-bi).

## Pensar en datos, no en celdas

El error más común en Excel es usarlo como un papel cuadriculado: totales a mano entre los datos, celdas combinadas, colores que significan cosas y cada mes en una pestaña distinta. Así es imposible analizar nada.

Un buen conjunto de datos sigue tres reglas:

1. **Una fila por registro** (una venta, un cliente, un día).
2. **Una columna por atributo**, con un encabezado único en la primera fila.
3. **Un solo tipo de dato por columna**: fechas como fechas, números como números.

| Mal | Bien |
| --- | --- |
| Una pestaña por mes | Una sola tabla con una columna `Fecha` |
| Columnas `Enero`, `Febrero`, `Marzo`… | Columnas `Mes` e `Importe` |
| Totales en medio de los datos | Los totales, en otra hoja o en una tabla dinámica |
| Celdas combinadas | Repetir el valor en cada fila |

> **Nota:** este curso usa Excel de Microsoft 365. Casi todo funciona igual en Excel 2021 y en **Google Sheets** (gratis); las funciones nuevas como `FILTRAR` o `BUSCARX` existen también en Sheets en inglés (`FILTER`, `XLOOKUP`).

### Datos de práctica

Copia esto en una hoja nueva, empezando en la celda A1. Si tu Excel está en español, el separador decimal será la coma:

```csv
Fecha;Vendedor;Zona;Producto;Unidades;Precio
05/01/2026;Ana;Norte;Taza;3;9,50
12/01/2026;Luis;Sur;Mochila;1;49,00
03/02/2026;Ana;Norte;Libreta;10;3,20
18/02/2026;Eva;Centro;Taza;5;9,50
07/03/2026;Luis;Sur;Auriculares;1;120,00
21/03/2026;Eva;Centro;Mochila;2;49,00
10/04/2026;Ana;Norte;Auriculares;2;120,00
28/04/2026;Luis;Sur;Libreta;6;3,20
```

Si lo pegas y todo queda en la columna A, usa **Datos → Texto en columnas** con el punto y coma como separador.

## Tablas de Excel

Selecciona cualquier celda de los datos y pulsa **Ctrl + T** (o **Insertar → Tabla**). Llámala `Ventas` en **Diseño de tabla → Nombre de la tabla**.

Convertir un rango en tabla cambia mucho:

- Las fórmulas, formatos y gráficos **crecen solos** al añadir filas.
- Los encabezados quedan fijos al hacer scroll y tienen filtros.
- Puedes usar **referencias estructuradas**: `Ventas[Unidades]` en lugar de `E2:E9`.

Añade una columna `Importe` escribiendo en la primera celda vacía a la derecha:

```text
=[@Unidades]*[@Precio]
```

`[@Unidades]` significa "la celda de la columna Unidades **de esta fila**". Excel rellena toda la columna automáticamente.

## Referencias y fórmulas básicas

Toda fórmula empieza por `=`. Las referencias pueden ser:

| Referencia | Al copiar la fórmula… |
| --- | --- |
| `A1` | Cambian la fila y la columna |
| `$A$1` | No cambia nada (absoluta) |
| `A$1` / `$A1` | Fija solo la fila / solo la columna |

Pulsa **F4** mientras escribes una referencia para ir cambiando entre los tipos.

Funciones de resumen que usarás a diario:

```text
=SUMA(Ventas[Importe])
=PROMEDIO(Ventas[Importe])
=CONTAR(Ventas[Unidades])
=CONTARA(Ventas[Vendedor])
=MAX(Ventas[Importe])
=MIN(Ventas[Importe])
```

> **Atención:** según el idioma de Excel, las funciones se llaman distinto (`SUMA` / `SUM`) y los argumentos se separan con punto y coma en español y con coma en inglés. En este curso usamos los nombres y separadores en español.

## Funciones condicionales

Suman, cuentan o promedian **solo las filas que cumplen una condición**:

```text
=SUMAR.SI(Ventas[Zona];"Norte";Ventas[Importe])
=CONTAR.SI(Ventas[Producto];"Taza")
=SUMAR.SI.CONJUNTO(Ventas[Importe];Ventas[Zona];"Sur";Ventas[Unidades];">1")
=PROMEDIO.SI.CONJUNTO(Ventas[Importe];Ventas[Vendedor];"Ana")
```

Con los datos de práctica, las ventas de la zona Norte suman **300,50 €**.

### SI, Y, O

```text
=SI([@Importe]>=100;"Grande";"Normal")
=SI(Y([@Zona]="Norte";[@Importe]>50);"Objetivo";"")
=SI.CONJUNTO([@Importe]>=200;"A";[@Importe]>=50;"B";VERDADERO;"C")
```

`SI.CONJUNTO` evita anidar muchos `SI` uno dentro de otro. Y `SI.ERROR` muestra algo más amable cuando una fórmula falla:

```text
=SI.ERROR([@Importe]/[@Unidades];0)
```

## Buscar datos: BUSCARX

Imagina una segunda tabla `Productos` con el coste de cada producto:

```csv
Producto;Coste
Taza;4,00
Mochila;22,00
Libreta;1,10
Auriculares;70,00
```

Para traer el coste a cada venta, añade la columna `Coste` en `Ventas` con:

```text
=BUSCARX([@Producto];Productos[Producto];Productos[Coste];"No encontrado")
```

`BUSCARX` busca un valor en una columna y devuelve el de otra, en cualquier dirección, con un valor por defecto si no lo encuentra. Sustituye a `BUSCARV`, que solo busca hacia la derecha y se rompe si insertas columnas.

| Argumento | Qué es |
| --- | --- |
| 1 | Lo que buscas |
| 2 | Dónde lo buscas |
| 3 | Qué devuelves |
| 4 (opcional) | Qué mostrar si no lo encuentra |

Con el coste ya puedes calcular el margen de cada venta: `=[@Importe]-[@Unidades]*[@Coste]`.

> **Consejo:** si trabajas con versiones antiguas de Excel sin `BUSCARX`, la combinación `INDICE` + `COINCIDIR` hace lo mismo: `=INDICE(Productos[Coste];COINCIDIR([@Producto];Productos[Producto];0))`.

## Matrices dinámicas

Las funciones modernas devuelven **varios resultados** que se "derraman" en las celdas de al lado:

```text
=UNICOS(Ventas[Vendedor])
=ORDENAR(UNICOS(Ventas[Producto]))
=FILTRAR(Ventas;Ventas[Zona]="Sur";"Sin ventas")
=ORDENARPOR(Ventas[[Fecha]:[Importe]];Ventas[Importe];-1)
=SECUENCIA(12)
```

- `UNICOS` devuelve los valores sin repetir.
- `FILTRAR` devuelve las filas que cumplen una condición; varias condiciones se multiplican para "y": `(Ventas[Zona]="Sur")*(Ventas[Importe]>50)`.
- Si las celdas donde iba a derramarse no están vacías, verás el error `#¡DESBORDAMIENTO!`.

Combinadas, crean informes que se actualizan solos. Por ejemplo, el total por vendedor en dos celdas:

```text
G2: =UNICOS(Ventas[Vendedor])
H2: =SUMAR.SI(Ventas[Vendedor];G2#;Ventas[Importe])
```

`G2#` se refiere a **todo** el rango derramado desde G2.

### LET y LAMBDA

`LET` da nombre a partes de una fórmula, como las variables en programación:

```text
=LET(total;SUMA(Ventas[Importe]);norte;SUMAR.SI(Ventas[Zona];"Norte";Ventas[Importe]);norte/total)
```

Y con `LAMBDA` (en **Fórmulas → Administrador de nombres**) puedes crear tus propias funciones reutilizables. Si vienes de programar, verás que Excel moderno es casi un lenguaje funcional.

## Tablas dinámicas

La herramienta más potente de Excel para resumir datos sin escribir fórmulas:

1. Selecciona una celda de la tabla `Ventas`.
2. **Insertar → Tabla dinámica → Nueva hoja de cálculo**.
3. Arrastra campos a las cuatro áreas:
   - **Filas**: `Vendedor`
   - **Columnas**: `Zona`
   - **Valores**: `Importe` (por defecto, suma)
   - **Filtros**: `Producto`

Trucos que conviene conocer:

- **Agrupar fechas**: arrastra `Fecha` a Filas y Excel la agrupa por años, trimestres y meses.
- **Mostrar valores como**: clic derecho en un valor → *% del total general* o *% del total de columna*.
- **Segmentación de datos**: **Analizar → Insertar segmentación** añade botones para filtrar, como en Power BI.
- **Actualizar**: cuando cambian los datos, clic derecho → **Actualizar** (o **Ctrl + Alt + F5** para todo).

> **Atención:** una tabla dinámica **no** se actualiza sola al cambiar los datos. Si alguien te dice que "los números no cuadran", lo primero es actualizar.

## Gráficos que se entienden

Con una celda de la tabla dinámica seleccionada, **Insertar → Gráfico dinámico** crea un gráfico conectado a ella.

| Para mostrar… | Usa |
| --- | --- |
| Evolución en el tiempo | Líneas |
| Comparar categorías | Barras o columnas |
| Parte de un total (pocas categorías) | Barras apiladas al 100 % |
| Relación entre dos números | Dispersión |

Reglas rápidas: quita el efecto 3D, elimina leyendas si solo hay una serie, ordena las barras de mayor a menor y pon un título que diga la conclusión ("Luis vende el doble en el Sur"), no solo qué es el gráfico.

Para una alerta visual dentro de la tabla, **Inicio → Formato condicional**: barras de datos, escalas de color o iconos. Con **Nueva regla → Utilice una fórmula** puedes resaltar filas enteras, por ejemplo `=$G2>100`.

## Limpiar datos con Power Query

Cuando los datos llegan sucios de otro sistema (espacios de más, fechas como texto, columnas que sobran), no los arregles a mano cada mes. **Datos → Obtener datos** abre **Power Query**, el mismo editor que usa Power BI:

1. **Datos → Desde texto/CSV** y elige el archivo.
2. **Transformar datos**.
3. Aplica pasos: cambiar tipos, recortar espacios (**Transformar → Formato → Recortar**), quitar duplicados, dividir columnas, filtrar filas.
4. **Cerrar y cargar** en una tabla.

El mes siguiente, con el archivo nuevo en la misma ruta, basta con **Datos → Actualizar todo**: todos los pasos se repiten solos.

Una de sus funciones más útiles: **Anular dinamización de columnas** (*unpivot*). Convierte una tabla con una columna por mes en una tabla larga con columnas `Mes` e `Importe`, el formato correcto del primer apartado.

## Buenas prácticas

- **Datos, cálculos y presentación en hojas separadas.** Quien abra el archivo sabrá dónde mirar y qué no tocar.
- **Nada de números escritos a mano dentro de fórmulas.** Pon el IVA en una celda con nombre (`IVA`) y usa `=[@Importe]*IVA`.
- **Valida las entradas** con **Datos → Validación de datos**: listas desplegables, fechas en un rango, números positivos.
- **Comprueba los totales** con un segundo método (la tabla dinámica debe dar lo mismo que `SUMA`).
- **Protege las hojas** de cálculo que otros solo deben leer.
- **Versiona y documenta**: una hoja `Léeme` con de dónde vienen los datos, cuándo se actualizan y qué hace cada hoja.

### ¿Cuándo dejar Excel?

Excel es perfecto hasta cierto punto. Cambia de herramienta cuando:

- Los datos superan unos cientos de miles de filas (Excel admite 1.048.576 por hoja, pero se vuelve lento mucho antes) → [Power BI](/lecciones/power-bi) o una base de datos con [SQL](/lecciones/sql-basico).
- Varias personas editan a la vez el mismo archivo y aparecen versiones `final_v3_bueno.xlsx` → una base de datos o una aplicación.
- Necesitas automatizar procesos complejos o estadística seria → [Python](/lecciones/python-basico) con pandas.

## Proyecto: panel de ventas

Con los datos de práctica ampliados (añade al menos 30 filas inventadas de 2025 y 2026), construye un libro con:

1. Hoja `Datos` con las tablas `Ventas` y `Productos`, y las columnas `Importe`, `Coste` (con `BUSCARX`) y `Margen`.
2. Hoja `Resumen` con: total de ventas, margen total y margen en porcentaje; una lista de vendedores con `UNICOS` y su total con `SUMAR.SI`; y las 5 mayores ventas con `ORDENARPOR` y `TOMAR`.
3. Hoja `Panel` con una tabla dinámica por zona y mes, un gráfico dinámico de líneas y segmentaciones de vendedor y producto.
4. Validación de datos en la columna `Zona` para que solo admita Norte, Sur y Centro.

> **Ejercicio:** calcula en una celda qué vendedor tiene más ventas, con una sola fórmula. Pista: `INDICE` y `COINCIDIR` con `MAX`, o `TOMAR(ORDENARPOR(...);1)`.

> **Reto:** prepara un CSV "sucio" con fechas en dos formatos, espacios de más, nombres de zona escritos de varias formas ("norte", "Norte ", "NORTE") y filas duplicadas. Límpialo solo con Power Query, de forma que al sustituir el archivo por otro igual de sucio y pulsar **Actualizar todo** el panel siga funcionando.
