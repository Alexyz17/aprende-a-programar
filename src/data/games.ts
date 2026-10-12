export type GameType = 'quiz' | 'fill_code' | 'order_blocks' | 'guess_output';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
    question: string;
    /** quiz: opciones; order_blocks: bloques EN EL ORDEN CORRECTO (la interfaz los baraja). */
    options?: string[];
    /** quiz / fill_code / guess_output: respuesta correcta. */
    answer?: string;
    /** Respuestas alternativas aceptadas en fill_code y guess_output. */
    accept?: string[];
    explanation: string;
    points: number;
}

export interface Game {
    slug: string;
    title: string;
    description: string;
    type: GameType;
    course: string;
    difficulty: Difficulty;
    questions: Question[];
}

export const GAME_TYPE_LABEL: Record<GameType, string> = {
    quiz: 'Test',
    fill_code: 'Completa el código',
    order_blocks: 'Ordena los bloques',
    guess_output: 'Adivina la salida',
};

export const DIFFICULTY_LABEL: Record<Difficulty, string> = { easy: 'Fácil', medium: 'Media', hard: 'Difícil' };

export const GAMES: Game[] = [
    {
        slug: 'quiz-linux',
        title: 'Test de Linux',
        description: 'Pon a prueba tus conocimientos sobre los comandos esenciales de Linux.',
        type: 'quiz', course: 'comandos-linux', difficulty: 'easy',
        questions: [
            { question: '¿Qué comando lista archivos incluyendo los ocultos?', options: ['ls -a', 'ls -l', 'ls -h', 'ls -r'], answer: 'ls -a', explanation: 'La opción -a (all) muestra también los archivos que empiezan por punto, que son los ocultos.', points: 100 },
            { question: '¿Qué comando muestra cuánto ocupa un directorio en total?', options: ['du -sh', 'df -h', 'ls -s', 'stat .'], answer: 'du -sh', explanation: 'du (disk usage) con -s (resumen) y -h (legible) muestra el tamaño total. df muestra el espacio libre de los discos.', points: 100 },
            { question: '¿Qué permisos deja chmod 755 archivo.sh?', options: ['Propietario: rwx, grupo: r-x, otros: r-x', 'Propietario: rwx, grupo: rwx, otros: rwx', 'Propietario: r-x, grupo: r-x, otros: r-x', 'Propietario: rwx, grupo: r--, otros: r--'], answer: 'Propietario: rwx, grupo: r-x, otros: r-x', explanation: '7 = 4+2+1 = rwx y 5 = 4+1 = r-x.', points: 150 },
            { question: '¿Qué comando muestra los procesos en tiempo real?', options: ['top', 'ps', 'jobs', 'kill'], answer: 'top', explanation: 'top (o htop) se actualiza continuamente. ps muestra una foto fija de los procesos.', points: 100 },
            { question: '¿Qué hace el operador >> en la shell?', options: ['Añade al final del archivo sin borrar lo anterior', 'Sobrescribe el archivo', 'Lee desde el archivo', 'Redirige solo los errores'], answer: 'Añade al final del archivo sin borrar lo anterior', explanation: '>> añade (append). Con > el archivo se vacía y se escribe desde cero.', points: 150 },
            { question: '¿Qué comando busca la palabra "error" dentro de app.log?', options: ['grep error app.log', 'find error app.log', 'cat error app.log', 'locate error app.log'], answer: 'grep error app.log', explanation: 'grep busca texto dentro de archivos. find busca archivos por nombre, tamaño, fecha…', points: 100 },
            { question: '¿Cómo ves la ruta del directorio en el que estás?', options: ['pwd', 'cd', 'whoami', 'path'], answer: 'pwd', explanation: 'pwd significa "print working directory".', points: 80 },
            { question: '¿Qué hace el carácter | entre dos comandos?', options: ['Envía la salida del primero como entrada del segundo', 'Ejecuta los dos a la vez sin relación', 'Ejecuta el segundo solo si el primero falla', 'Guarda la salida en un archivo'], answer: 'Envía la salida del primero como entrada del segundo', explanation: 'Es una tubería (pipe). Por ejemplo: cat app.log | grep error | wc -l.', points: 120 },
        ],
    },
    {
        slug: 'quiz-git',
        title: 'Test de Git',
        description: 'Commits, ramas, merge y trabajo con remotos: ¿lo tienes claro?',
        type: 'quiz', course: 'git-esencial', difficulty: 'easy',
        questions: [
            { question: '¿Qué hace git add archivo.txt?', options: ['Prepara el archivo para el próximo commit', 'Crea un commit con el archivo', 'Sube el archivo al remoto', 'Crea el archivo'], answer: 'Prepara el archivo para el próximo commit', explanation: 'git add mueve los cambios al área de preparación (staging). El commit se crea con git commit.', points: 100 },
            { question: '¿Qué comando crea una rama nueva y se cambia a ella?', options: ['git switch -c nueva', 'git branch nueva', 'git merge nueva', 'git checkout nueva'], answer: 'git switch -c nueva', explanation: 'git switch -c (o el clásico git checkout -b) crea la rama y cambia a ella. git branch solo la crea.', points: 100 },
            { question: '¿Qué diferencia hay entre git fetch y git pull?', options: ['fetch descarga cambios sin integrarlos; pull descarga e integra', 'Son exactamente iguales', 'pull solo funciona con ramas nuevas', 'fetch sube cambios al remoto'], answer: 'fetch descarga cambios sin integrarlos; pull descarga e integra', explanation: 'git pull = git fetch + git merge (o rebase, según la configuración).', points: 150 },
            { question: '¿Qué archivo indica a Git qué archivos no debe seguir?', options: ['.gitignore', '.gitconfig', '.gitkeep', '.git/HEAD'], answer: '.gitignore', explanation: 'En .gitignore se listan patrones como node_modules/ o .env.', points: 80 },
            { question: 'Quieres deshacer el último commit pero conservar los cambios en tus archivos. ¿Qué usas?', options: ['git reset --soft HEAD~1', 'git reset --hard HEAD~1', 'git revert --all', 'git rm HEAD'], answer: 'git reset --soft HEAD~1', explanation: '--soft mueve la rama hacia atrás y deja los cambios preparados. --hard los borraría.', points: 200 },
            { question: '¿Qué significa un conflicto de merge?', options: ['Dos ramas cambiaron las mismas líneas y Git no sabe cuál quedarse', 'El remoto no está disponible', 'La rama no existe', 'Hay archivos sin añadir'], answer: 'Dos ramas cambiaron las mismas líneas y Git no sabe cuál quedarse', explanation: 'Git marca el conflicto con <<<<<<<, ======= y >>>>>>> para que elijas a mano.', points: 120 },
            { question: '¿Para qué sirve git stash?', options: ['Guardar temporalmente cambios sin hacer commit', 'Borrar ramas viejas', 'Ver el historial', 'Firmar commits'], answer: 'Guardar temporalmente cambios sin hacer commit', explanation: 'git stash aparta los cambios; git stash pop los recupera.', points: 120 },
        ],
    },
    {
        slug: 'ordena-git',
        title: 'Ordena el flujo de Git',
        description: 'Coloca en orden los comandos de un flujo de trabajo típico con ramas.',
        type: 'order_blocks', course: 'git-esencial', difficulty: 'medium',
        questions: [
            { question: 'Ordena los pasos para empezar un proyecto y subirlo a un remoto:', options: ['git init', 'git add .', 'git commit -m "Primer commit"', 'git remote add origin <url>', 'git push -u origin main'], explanation: 'Inicializar, preparar, confirmar, conectar el remoto y subir.', points: 150 },
            { question: 'Ordena el flujo para trabajar en una funcionalidad nueva:', options: ['git switch main', 'git pull', 'git switch -c feature/login', 'git commit -am "Añade login"', 'git push -u origin feature/login'], explanation: 'Parte de main actualizada, crea la rama, confirma tus cambios y súbela para abrir una merge request.', points: 200 },
            { question: 'Ordena los pasos para resolver un conflicto de merge:', options: ['git merge feature/login', 'Editar los archivos con conflicto', 'git add archivo-resuelto.php', 'git commit'], explanation: 'El merge se detiene, resuelves a mano, marcas el archivo como resuelto con git add y cierras el merge con un commit.', points: 150 },
        ],
    },
    {
        slug: 'quiz-html-css',
        title: 'Test de HTML y CSS',
        description: 'Etiquetas semánticas, selectores, box model y Flexbox.',
        type: 'quiz', course: 'html-css', difficulty: 'easy',
        questions: [
            { question: '¿Qué etiqueta es la más adecuada para el menú principal de una web?', options: ['<nav>', '<div>', '<menu-bar>', '<section>'], answer: '<nav>', explanation: '<nav> es semántica: los lectores de pantalla la anuncian como zona de navegación.', points: 100 },
            { question: '¿Para qué sirve el atributo alt en una imagen?', options: ['Describe la imagen para quien no puede verla', 'Cambia el tamaño', 'Pone un título al pasar el ratón', 'Carga una imagen alternativa'], answer: 'Describe la imagen para quien no puede verla', explanation: 'alt lo leen los lectores de pantalla y se muestra si la imagen no carga. Si es decorativa, alt="".', points: 100 },
            { question: 'Con box-sizing: border-box, el ancho (width) de un elemento incluye…', options: ['contenido, padding y borde', 'solo el contenido', 'contenido y margen', 'contenido, padding, borde y margen'], answer: 'contenido, padding y borde', explanation: 'Con border-box el padding y el borde se restan del ancho declarado. El margen nunca cuenta.', points: 150 },
            { question: '¿Qué propiedad centra horizontalmente los hijos de un contenedor flex en fila?', options: ['justify-content: center', 'align-items: center', 'text-align: center', 'margin: center'], answer: 'justify-content: center', explanation: 'justify-content actúa en el eje principal (horizontal en flex-direction: row). align-items actúa en el eje cruzado.', points: 120 },
            { question: '¿Qué selector tiene más especificidad?', options: ['#cabecera', '.cabecera', 'header', 'header .titulo'], answer: '#cabecera', explanation: 'Un id pesa más que cualquier número de clases o etiquetas.', points: 150 },
            { question: '¿Qué unidad es relativa al tamaño de fuente del elemento raíz?', options: ['rem', 'em', 'px', 'vh'], answer: 'rem', explanation: 'rem = root em. em es relativa a la fuente del propio elemento (o del padre).', points: 100 },
            { question: '¿Qué hace una media query como @media (min-width: 768px)?', options: ['Aplica los estilos solo si la pantalla mide al menos 768px', 'Limita el ancho de la página a 768px', 'Aplica estilos solo en móvil', 'Carga otra hoja de estilos'], answer: 'Aplica los estilos solo si la pantalla mide al menos 768px', explanation: 'Es la base del diseño responsive "mobile first": estilos base para móvil y min-width para pantallas mayores.', points: 120 },
        ],
    },
    {
        slug: 'quiz-javascript',
        title: 'Test de JavaScript',
        description: 'Tipos, ámbitos, promesas y arrays en JavaScript moderno.',
        type: 'quiz', course: 'javascript-moderno', difficulty: 'medium',
        questions: [
            { question: '¿Qué diferencia hay entre let y const?', options: ['const no se puede reasignar; let sí', 'let es global y const local', 'const hace el objeto inmutable', 'No hay diferencia'], answer: 'const no se puede reasignar; let sí', explanation: 'const impide reasignar la variable, pero el contenido de un objeto o array const sí puede cambiar.', points: 100 },
            { question: '¿Qué devuelve [1, 2, 3].map(n => n * 2)?', options: ['[2, 4, 6]', '[1, 2, 3]', '12', 'undefined'], answer: '[2, 4, 6]', explanation: 'map crea un array nuevo aplicando la función a cada elemento.', points: 100 },
            { question: '¿Qué hace await dentro de una función async?', options: ['Espera a que la promesa se resuelva sin bloquear el hilo', 'Bloquea todo el navegador', 'Convierte la función en síncrona', 'Repite la petición si falla'], answer: 'Espera a que la promesa se resuelva sin bloquear el hilo', explanation: 'await pausa esa función y deja que el resto del programa siga funcionando.', points: 150 },
            { question: '¿Cuál es el resultado de 0.1 + 0.2 === 0.3?', options: ['false', 'true', 'TypeError', 'undefined'], answer: 'false', explanation: 'Los números de coma flotante no representan 0.1 y 0.2 con exactitud: el resultado es 0.30000000000000004.', points: 150 },
            { question: '¿Qué operador devuelve el valor de la derecha solo si el de la izquierda es null o undefined?', options: ['??', '||', '&&', '?.'], answer: '??', explanation: '?? (nullish coalescing) no trata 0 ni "" como vacíos, a diferencia de ||.', points: 150 },
            { question: '¿Qué método de array devuelve el primer elemento que cumple una condición?', options: ['find', 'filter', 'some', 'indexOf'], answer: 'find', explanation: 'find devuelve el elemento (o undefined). filter devuelve un array con todos los que cumplen.', points: 100 },
            { question: '¿Qué imprime typeof null?', options: ['"object"', '"null"', '"undefined"', '"number"'], answer: '"object"', explanation: 'Es un error histórico del lenguaje que se mantiene por compatibilidad.', points: 150 },
        ],
    },
    {
        slug: 'adivina-output-js',
        title: 'Adivina la salida en JavaScript',
        description: 'Lee el código y escribe exactamente lo que se mostraría por consola.',
        type: 'guess_output', course: 'javascript-moderno', difficulty: 'hard',
        questions: [
            { question: "const a = [1, 2, 3];\nconst b = a;\nb.push(4);\nconsole.log(a.length);", answer: '4', explanation: 'a y b apuntan al mismo array: los arrays se copian por referencia.', points: 150 },
            { question: "console.log('5' + 3);", answer: '53', explanation: 'Con + y un string, JavaScript concatena: "5" + "3" = "53".', points: 100 },
            { question: "console.log('5' - 3);", answer: '2', explanation: 'El operador - no existe para strings, así que convierte "5" a número.', points: 120 },
            { question: "const { x = 10, y } = { y: 2 };\nconsole.log(x + y);", answer: '12', explanation: 'x no viene en el objeto, así que toma el valor por defecto 10.', points: 150 },
            { question: "console.log([10, 1, 3].sort());", answer: '[1, 10, 3]', accept: ['[ 1, 10, 3 ]', '1,10,3'], explanation: 'Sin función de comparación, sort ordena como texto. Para números: sort((a, b) => a - b).', points: 200 },
            { question: "let n = 0;\nfor (let i = 0; i < 3; i++) n += i;\nconsole.log(n);", answer: '3', explanation: '0 + 1 + 2 = 3.', points: 100 },
        ],
    },
    {
        slug: 'quiz-typescript',
        title: 'Test de TypeScript',
        description: 'Tipos, interfaces, uniones y genéricos.',
        type: 'quiz', course: 'typescript-basico', difficulty: 'medium',
        questions: [
            { question: '¿Qué tipo describe un valor que puede ser string o number?', options: ['string | number', 'string & number', 'any', 'string, number'], answer: 'string | number', explanation: 'Es un tipo unión. & es intersección (debe cumplir ambos).', points: 100 },
            { question: '¿Cuál es la diferencia principal entre unknown y any?', options: ['unknown obliga a comprobar el tipo antes de usarlo', 'any es más seguro', 'unknown solo vale para números', 'No hay diferencia'], answer: 'unknown obliga a comprobar el tipo antes de usarlo', explanation: 'any desactiva el chequeo de tipos. unknown es la alternativa segura.', points: 150 },
            { question: '¿Qué hace el ? en interface User { email?: string }?', options: ['La propiedad es opcional', 'La propiedad puede ser null', 'La propiedad es privada', 'Es un error de sintaxis'], answer: 'La propiedad es opcional', explanation: 'email puede no existir; su tipo es string | undefined.', points: 100 },
            { question: '¿Qué devuelve function first<T>(items: T[]): T | undefined con un string[]?', options: ['string | undefined', 'T', 'any', 'string[]'], answer: 'string | undefined', explanation: 'El genérico T se infiere como string a partir del argumento.', points: 150 },
            { question: '¿Qué utilidad crea un tipo con todas las propiedades opcionales?', options: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Pick<T, K>'], answer: 'Partial<T>', explanation: 'Partial<User> es útil para funciones de actualización.', points: 120 },
        ],
    },
    {
        slug: 'completa-php',
        title: 'Completa el código PHP',
        description: 'Rellena los huecos para completar fragmentos de código PHP y Laravel.',
        type: 'fill_code', course: 'laravel', difficulty: 'medium',
        questions: [
            { question: "User::where('email', ___)->first();", answer: '$email', explanation: 'where() recibe la columna y el valor a buscar; aquí el valor está en $email.', points: 100 },
            { question: "Route::get('/usuarios', ___)->name('users.index');", answer: "[UserController::class, 'index']", accept: ['[UserController::class, "index"]', "[UserController::class,'index']"], explanation: "Las rutas apuntan a [Controlador::class, 'metodo'] o a una función anónima.", points: 150 },
            { question: 'return response()->json($data, ___); // recurso creado', answer: '201', explanation: '201 Created es el código para un recurso recién creado. 200 es OK genérico y 422 es error de validación.', points: 120 },
            { question: "$request->validate(['email' => '___|email|max:255']);", answer: 'required', explanation: 'Las reglas se separan con |. "required" impide que el campo llegue vacío.', points: 100 },
            { question: "foreach ($usuarios ___ $usuario) { echo $usuario->name; }", answer: 'as', explanation: 'La sintaxis de foreach en PHP es foreach ($coleccion as $elemento).', points: 80 },
            { question: "$post = Post::with('___')->find(1); // carga también el autor", answer: 'author', accept: ['user'], explanation: 'with() hace eager loading de la relación y evita el problema N+1.', points: 150 },
        ],
    },
    {
        slug: 'adivina-output-php',
        title: 'Adivina la salida en PHP',
        description: 'Lee el código PHP y escribe exactamente lo que imprimiría.',
        type: 'guess_output', course: 'php-basico', difficulty: 'hard',
        questions: [
            { question: "<?php\n$arr = [1, 2, 3];\necho count($arr);", answer: '3', explanation: 'count() devuelve el número de elementos.', points: 100 },
            { question: "<?php\n$x = 10;\n$y = &$x;\n$y = 20;\necho $x;", answer: '20', explanation: '&$x crea una referencia: $x e $y son la misma variable.', points: 150 },
            { question: "<?php\n$a = '5';\n$b = 5;\necho var_export($a === $b, true);", answer: 'false', explanation: '=== compara valor y tipo: un string no es idéntico a un entero. Con == sería true.', points: 150 },
            { question: "<?php\necho strtoupper(substr('laravel', 0, 3));", answer: 'LAR', explanation: "substr('laravel', 0, 3) = 'lar' y strtoupper lo pasa a mayúsculas.", points: 120 },
            { question: "<?php\n$total = 0;\nforeach ([2, 4, 6] as $n) { $total += $n; }\necho $total;", answer: '12', explanation: '2 + 4 + 6 = 12.', points: 100 },
            { question: "<?php\necho intdiv(7, 2) . '-' . 7 % 2;", answer: '3-1', explanation: 'intdiv hace división entera (3) y % devuelve el resto (1).', points: 150 },
        ],
    },
    {
        slug: 'quiz-sql',
        title: 'Test de SQL',
        description: 'SELECT, JOIN, GROUP BY e índices.',
        type: 'quiz', course: 'sql-basico', difficulty: 'medium',
        questions: [
            { question: '¿Qué cláusula filtra filas ANTES de agrupar?', options: ['WHERE', 'HAVING', 'ORDER BY', 'LIMIT'], answer: 'WHERE', explanation: 'WHERE filtra filas; HAVING filtra grupos después de GROUP BY.', points: 120 },
            { question: '¿Qué devuelve un LEFT JOIN de clientes con pedidos?', options: ['Todos los clientes, tengan pedidos o no', 'Solo clientes con pedidos', 'Solo pedidos sin cliente', 'Todas las combinaciones posibles'], answer: 'Todos los clientes, tengan pedidos o no', explanation: 'Los clientes sin pedidos aparecen con NULL en las columnas de pedidos.', points: 150 },
            { question: '¿Qué hace SELECT COUNT(*) FROM usuarios;?', options: ['Cuenta las filas de la tabla', 'Suma los ids', 'Devuelve todas las columnas', 'Cuenta las columnas'], answer: 'Cuenta las filas de la tabla', explanation: 'COUNT(*) cuenta filas. COUNT(columna) ignora los NULL.', points: 80 },
            { question: '¿Para qué sirve un índice?', options: ['Acelerar las búsquedas a cambio de escrituras algo más lentas', 'Evitar duplicados siempre', 'Cifrar la columna', 'Ordenar la tabla físicamente'], answer: 'Acelerar las búsquedas a cambio de escrituras algo más lentas', explanation: 'Un índice evita recorrer la tabla entera, pero hay que mantenerlo en cada INSERT o UPDATE.', points: 150 },
            { question: '¿Cuál es la forma segura de meter datos del usuario en una consulta?', options: ['Consultas preparadas con parámetros', 'Concatenar el texto', 'Escapar las comillas a mano', 'Usar comillas dobles'], answer: 'Consultas preparadas con parámetros', explanation: 'Los parámetros separan datos y código y evitan la inyección SQL.', points: 150 },
            { question: '¿Qué hace una clave foránea (FOREIGN KEY)?', options: ['Obliga a que el valor exista en otra tabla', 'Hace la columna única', 'Crea un índice de texto completo', 'Genera ids automáticamente'], answer: 'Obliga a que el valor exista en otra tabla', explanation: 'Garantiza la integridad referencial, por ejemplo que pedidos.cliente_id exista en clientes.', points: 120 },
        ],
    },
    {
        slug: 'quiz-python',
        title: 'Test de Python',
        description: 'Listas, diccionarios, funciones y buenas prácticas en Python.',
        type: 'quiz', course: 'python-basico', difficulty: 'easy',
        questions: [
            { question: '¿Qué devuelve len({"a": 1, "b": 2})?', options: ['2', '4', '1', 'Error'], answer: '2', explanation: 'len de un diccionario cuenta sus claves.', points: 80 },
            { question: '¿Cuál es la forma más "pythónica" de crear una lista con los cuadrados del 0 al 4?', options: ['[n ** 2 for n in range(5)]', 'list(map(square, 5))', 'for n in 5: n*n', 'range(5) ** 2'], answer: '[n ** 2 for n in range(5)]', explanation: 'Es una list comprehension: concisa y legible.', points: 120 },
            { question: '¿Qué diferencia hay entre una lista y una tupla?', options: ['La tupla no se puede modificar', 'La lista no admite números', 'La tupla es más lenta siempre', 'No hay diferencia'], answer: 'La tupla no se puede modificar', explanation: 'Las tuplas son inmutables; se usan para datos fijos y como claves de diccionario.', points: 100 },
            { question: '¿Qué imprime print(f"{3 / 2}")?', options: ['1.5', '1', '2', '3/2'], answer: '1.5', explanation: 'En Python 3, / siempre devuelve float. Para división entera se usa //.', points: 100 },
            { question: '¿Para qué sirve with open("datos.txt") as f:?', options: ['Abre el archivo y lo cierra solo al terminar el bloque', 'Abre el archivo en modo escritura', 'Crea el archivo si no existe', 'Lee el archivo en paralelo'], answer: 'Abre el archivo y lo cierra solo al terminar el bloque', explanation: 'with usa un gestor de contexto: cierra el archivo incluso si hay un error.', points: 150 },
            { question: '¿Cómo obtienes un valor de un diccionario sin error si la clave no existe?', options: ['d.get("clave")', 'd["clave"]', 'd.find("clave")', 'd.value("clave")'], answer: 'd.get("clave")', explanation: 'get devuelve None (o el valor por defecto que pases) en lugar de lanzar KeyError.', points: 120 },
        ],
    },
    {
        slug: 'quiz-docker',
        title: 'Test de Docker',
        description: 'Imágenes, contenedores, volúmenes y Docker Compose.',
        type: 'quiz', course: 'docker', difficulty: 'medium',
        questions: [
            { question: '¿Cuál es la diferencia entre imagen y contenedor?', options: ['La imagen es la plantilla; el contenedor es una instancia en ejecución', 'Son lo mismo', 'El contenedor es la plantilla', 'La imagen solo existe en Docker Hub'], answer: 'La imagen es la plantilla; el contenedor es una instancia en ejecución', explanation: 'De una misma imagen puedes arrancar muchos contenedores.', points: 100 },
            { question: '¿Cómo conservas los datos de una base de datos si borras el contenedor?', options: ['Con un volumen', 'Con EXPOSE', 'Con un tag', 'No se puede'], answer: 'Con un volumen', explanation: 'Los volúmenes viven fuera del ciclo de vida del contenedor.', points: 150 },
            { question: '¿Qué hace -p 8080:80 en docker run?', options: ['Publica el puerto 80 del contenedor en el 8080 del host', 'Publica el 8080 del contenedor en el 80 del host', 'Limita la memoria', 'Asigna 80 procesos'], answer: 'Publica el puerto 80 del contenedor en el 8080 del host', explanation: 'El formato es host:contenedor.', points: 150 },
            { question: '¿Por qué conviene copiar package.json e instalar dependencias ANTES de copiar el resto del código?', options: ['Para aprovechar la caché de capas', 'Porque Docker lo exige', 'Para que la imagen pese más', 'Para que el contenedor arranque como root'], answer: 'Para aprovechar la caché de capas', explanation: 'Si solo cambia el código, la capa de dependencias se reutiliza y el build es mucho más rápido.', points: 200 },
            { question: '¿Qué comando muestra los logs de un contenedor?', options: ['docker logs', 'docker ps', 'docker inspect --logs', 'docker events'], answer: 'docker logs', explanation: 'Añade -f para seguirlos en tiempo real.', points: 80 },
        ],
    },
    {
        slug: 'ordena-docker',
        title: 'Ordena los bloques de Docker',
        description: 'Coloca las instrucciones en el orden correcto.',
        type: 'order_blocks', course: 'docker', difficulty: 'medium',
        questions: [
            { question: 'Ordena las instrucciones de un Dockerfile básico para PHP:', options: ['FROM php:8.3-fpm', 'WORKDIR /var/www', 'COPY . .', 'RUN composer install'], explanation: 'Imagen base, directorio de trabajo, copiar archivos e instalar dependencias.', points: 150 },
            { question: 'Ordena un Dockerfile de Nginx con configuración propia:', options: ['FROM nginx:alpine', 'COPY nginx.conf /etc/nginx/nginx.conf', 'EXPOSE 80', 'CMD ["nginx", "-g", "daemon off;"]'], explanation: 'Imagen base, configuración, documentar el puerto y comando de arranque.', points: 150 },
            { question: 'Ordena los comandos para levantar un proyecto con Docker Compose:', options: ['docker compose build', 'docker compose up -d', 'docker compose ps', 'docker compose logs -f'], explanation: 'Construir, levantar en segundo plano, comprobar el estado y revisar los logs.', points: 100 },
            { question: 'Ordena un build multi-stage (Node → Nginx):', options: ['FROM node:22 AS builder', 'RUN npm ci && npm run build', 'FROM nginx:alpine', 'COPY --from=builder /app/dist /usr/share/nginx/html'], explanation: 'Etapa de compilación con Node y etapa final ligera con Nginx que solo contiene los archivos generados.', points: 200 },
        ],
    },
    {
        slug: 'quiz-seguridad',
        title: 'Test de seguridad web',
        description: 'XSS, inyección SQL, CSRF, contraseñas y HTTPS.',
        type: 'quiz', course: 'seguridad-web', difficulty: 'medium',
        questions: [
            { question: '¿Cómo deben guardarse las contraseñas?', options: ['Con un hash lento como bcrypt o Argon2', 'Cifradas con AES', 'En texto plano en una tabla privada', 'Con MD5'], answer: 'Con un hash lento como bcrypt o Argon2', explanation: 'Un hash no se puede revertir y uno lento hace caros los ataques de fuerza bruta. MD5 es demasiado rápido.', points: 150 },
            { question: '¿Qué es un ataque XSS?', options: ['Inyectar JavaScript que se ejecuta en el navegador de otros usuarios', 'Saturar el servidor con peticiones', 'Robar la base de datos con SQL', 'Interceptar el wifi'], answer: 'Inyectar JavaScript que se ejecuta en el navegador de otros usuarios', explanation: 'Se evita escapando la salida (Blade {{ }}, React lo hace por defecto) y con Content-Security-Policy.', points: 150 },
            { question: '¿Qué protege un token CSRF?', options: ['Que otra web haga peticiones en tu nombre', 'Que roben tu contraseña', 'Que lean tus cookies', 'Que inyecten SQL'], answer: 'Que otra web haga peticiones en tu nombre', explanation: 'El token demuestra que el formulario salió de tu propia web.', points: 150 },
            { question: '¿Dónde NO debe guardarse una clave de API?', options: ['En el repositorio de código', 'En variables de entorno', 'En un gestor de secretos', 'En la configuración del servidor de CI'], answer: 'En el repositorio de código', explanation: 'Aunque la borres después, sigue en el historial de Git. Si ocurre, hay que rotar la clave.', points: 120 },
            { question: '¿Qué hace la cabecera HttpOnly en una cookie?', options: ['Impide leerla desde JavaScript', 'La cifra', 'Solo se envía por HTTP, no HTTPS', 'La borra al cerrar la pestaña'], answer: 'Impide leerla desde JavaScript', explanation: 'Así un XSS no puede robar la cookie de sesión. Secure hace que solo viaje por HTTPS.', points: 150 },
        ],
    },
    {
        slug: 'completa-react',
        title: 'Completa el código React',
        description: 'Hooks, props y listas: rellena el hueco.',
        type: 'fill_code', course: 'react-avanzado', difficulty: 'medium',
        questions: [
            { question: 'const [count, setCount] = ___(0);', answer: 'useState', explanation: 'useState devuelve el valor actual y la función para cambiarlo.', points: 100 },
            { question: '{items.map(item => <li ___={item.id}>{item.name}</li>)}', answer: 'key', explanation: 'key ayuda a React a identificar cada elemento de la lista entre renders.', points: 120 },
            { question: 'useEffect(() => { document.title = titulo; }, [___]);', answer: 'titulo', explanation: 'El array de dependencias indica cuándo volver a ejecutar el efecto.', points: 150 },
            { question: '<button ___={() => setCount(c => c + 1)}>+1</button>', answer: 'onClick', explanation: 'Los eventos en JSX usan camelCase: onClick, onChange, onSubmit…', points: 80 },
            { question: 'const total = ___(() => calcularTotal(carrito), [carrito]);', answer: 'useMemo', explanation: 'useMemo guarda el resultado y solo lo recalcula si cambia carrito.', points: 150 },
        ],
    },
    {
        slug: 'quiz-react-basico',
        title: 'Test de React desde cero',
        description: 'Componentes, props, estado, listas y efectos: lo básico de React.',
        type: 'quiz', course: 'react-basico', difficulty: 'easy',
        questions: [
            { question: '¿Qué es un componente de React?', options: ['Una función que devuelve JSX', 'Un archivo HTML', 'Una clase de CSS', 'Una petición a una API'], answer: 'Una función que devuelve JSX', explanation: 'Los componentes son funciones cuyo nombre empieza por mayúscula y que describen una parte de la interfaz.', points: 80 },
            { question: '¿Puede un componente modificar sus propias props?', options: ['No, las props son de solo lectura', 'Sí, siempre', 'Solo si son números', 'Solo dentro de useEffect'], answer: 'No, las props son de solo lectura', explanation: 'Si un dato tiene que cambiar, es estado. El padre puede pasar una función para que el hijo le pida el cambio.', points: 100 },
            { question: 'Tienes const [tareas, setTareas] = useState([]). ¿Cómo añades una tarea correctamente?', options: ['setTareas([...tareas, nueva])', 'tareas.push(nueva)', 'tareas = [...tareas, nueva]', 'setTareas(tareas.push(nueva))'], answer: 'setTareas([...tareas, nueva])', explanation: 'Hay que crear un array nuevo y pasarlo al setter. push muta el array y React no se entera del cambio.', points: 150 },
            { question: '¿Por qué cada elemento de una lista necesita una key?', options: ['Para que React sepa qué elemento es cuál cuando la lista cambia', 'Para darle estilos', 'Para ordenarla alfabéticamente', 'Porque lo exige HTML'], answer: 'Para que React sepa qué elemento es cuál cuando la lista cambia', explanation: 'La key debe ser única y estable, normalmente el id de los datos. El índice falla si la lista se reordena.', points: 120 },
            { question: '¿Cuándo se ejecuta useEffect(() => {...}, [])?', options: ['Una vez, al montar el componente', 'En cada render', 'Nunca', 'Cada vez que cambia cualquier estado'], answer: 'Una vez, al montar el componente', explanation: 'Con el array de dependencias vacío, el efecto solo se ejecuta tras el primer render.', points: 120 },
            { question: '¿Qué pasa con onClick={guardar()}?', options: ['guardar se ejecuta en cada render, no al hacer clic', 'Funciona igual que onClick={guardar}', 'Da un error de sintaxis', 'Solo se ejecuta al hacer doble clic'], answer: 'guardar se ejecuta en cada render, no al hacer clic', explanation: 'Hay que pasar la función, no llamarla: onClick={guardar} u onClick={() => guardar(id)}.', points: 150 },
            { question: 'Con {lista.length && <Lista />}, si la lista está vacía React pinta…', options: ['Un 0', 'Nada', 'false', 'Un error'], answer: 'Un 0', explanation: 'React no pinta false ni null, pero sí el número 0. Usa lista.length > 0 && ...', points: 200 },
        ],
    },
    {
        slug: 'completa-tailwind',
        title: 'Completa las clases de Tailwind',
        description: 'Escribe la clase de Tailwind que falta para conseguir el diseño pedido.',
        type: 'fill_code', course: 'tailwind-css', difficulty: 'easy',
        questions: [
            { question: '<nav class="flex items-center ___"> <!-- logo a la izquierda, enlaces a la derecha -->', answer: 'justify-between', explanation: 'justify-between reparte el espacio libre entre los hijos, empujándolos a los extremos.', points: 100 },
            { question: '<div class="grid grid-cols-1 ___:grid-cols-3"> <!-- 3 columnas desde 768px -->', answer: 'md', explanation: 'md: aplica desde 768 px. Tailwind es mobile first: sin prefijo se aplica siempre.', points: 100 },
            { question: '<button class="bg-indigo-600 ___:bg-indigo-500"> <!-- más claro al pasar el ratón -->', answer: 'hover', explanation: 'Los estados se escriben como prefijos: hover:, focus-visible:, active:, disabled:…', points: 80 },
            { question: '<body class="bg-white ___:bg-gray-950"> <!-- fondo oscuro en modo oscuro -->', answer: 'dark', explanation: 'dark: aplica la clase cuando el modo oscuro está activo.', points: 80 },
            { question: '<div class="bg-black/___"> <!-- negro al 50 % de opacidad -->', answer: '50', explanation: 'La barra indica la opacidad del color: bg-black/50, text-white/80…', points: 120 },
            { question: '<main class="grid min-h-screen ___"> <!-- centrar el contenido en ambos ejes -->', answer: 'place-items-center', explanation: 'En un grid, place-items-center centra en horizontal y en vertical a la vez.', points: 150 },
            { question: '<a class="___ block"> <h3 class="group-hover:text-indigo-600">…</h3> </a>', answer: 'group', explanation: 'Marca el padre con group para que los hijos reaccionen a su hover con group-hover:.', points: 150 },
        ],
    },
    {
        slug: 'completa-inertia',
        title: 'Completa el código de Inertia',
        description: 'Controladores de Laravel y páginas de React unidos con Inertia.',
        type: 'fill_code', course: 'laravel-inertia-react', difficulty: 'medium',
        questions: [
            { question: "return Inertia::___('Tareas/Index', ['tareas' => $tareas]);", answer: 'render', explanation: 'Inertia::render recibe el nombre del componente de React y sus props.', points: 100 },
            { question: "const { data, setData, post, processing, errors } = ___({ titulo: '' });", answer: 'useForm', explanation: 'useForm gestiona los datos del formulario, el envío y los errores de validación de Laravel.', points: 120 },
            { question: "const { auth } = ___().props; // datos compartidos por el middleware", answer: 'usePage', explanation: 'usePage da acceso a las props de la página, incluidas las compartidas en HandleInertiaRequests::share.', points: 150 },
            { question: '<Link href={`/tareas/${id}`} method="___" as="button">Borrar</Link>', answer: 'delete', explanation: 'Link puede hacer peticiones con otros métodos HTTP. Con as="button" se pinta como botón, que es lo correcto para acciones.', points: 120 },
            { question: "router.get('/tareas', { buscar }, { preserveState: true, ___: ['tareas'] });", answer: 'only', explanation: 'only hace una recarga parcial: Laravel solo calcula y envía esas props.', points: 200 },
            { question: "Gate::___('update', $tarea); // 403 si la tarea no es del usuario", answer: 'authorize', explanation: 'Gate::authorize usa la policy y lanza un 403 si el usuario no tiene permiso.', points: 150 },
        ],
    },
    {
        slug: 'quiz-kubernetes',
        title: 'Test de Kubernetes',
        description: 'Pods, Deployments, Services, ConfigMaps y escalado.',
        type: 'quiz', course: 'kubernetes', difficulty: 'medium',
        questions: [
            { question: '¿Cuál es la unidad mínima que Kubernetes ejecuta?', options: ['El Pod', 'El contenedor', 'El nodo', 'El Deployment'], answer: 'El Pod', explanation: 'Un Pod agrupa uno o varios contenedores que comparten red y almacenamiento.', points: 100 },
            { question: '¿Qué objeto mantiene un número de réplicas y permite actualizaciones sin cortes?', options: ['Deployment', 'Service', 'ConfigMap', 'Namespace'], answer: 'Deployment', explanation: 'El Deployment gestiona ReplicaSets y hace rolling updates.', points: 120 },
            { question: '¿Para qué sirve un Service?', options: ['Dar una dirección estable a un grupo de Pods', 'Guardar contraseñas', 'Construir imágenes', 'Programar tareas periódicas'], answer: 'Dar una dirección estable a un grupo de Pods', explanation: 'Los Pods cambian de IP al recrearse; el Service los encuentra por etiquetas y reparte el tráfico.', points: 150 },
            { question: '¿Dónde guardarías la URL de la base de datos sin datos sensibles?', options: ['En un ConfigMap', 'En la imagen de Docker', 'En el nombre del Pod', 'En un PersistentVolume'], answer: 'En un ConfigMap', explanation: 'La configuración no sensible va en ConfigMaps; las contraseñas, en Secrets.', points: 120 },
            { question: 'Un Secret de Kubernetes, por defecto, ¿está cifrado?', options: ['No, solo está codificado en base64', 'Sí, con AES-256 siempre', 'Sí, con la clave del nodo', 'Solo en Minikube'], answer: 'No, solo está codificado en base64', explanation: 'Base64 no es cifrado. Hay que activar el cifrado en reposo, limitar el acceso con RBAC o usar un gestor externo.', points: 200 },
            { question: '¿Qué comando muestra por qué un Pod no arranca?', options: ['kubectl describe pod <nombre>', 'kubectl get nodes', 'kubectl apply -f pod.yaml', 'kubectl version'], answer: 'kubectl describe pod <nombre>', explanation: 'describe muestra los eventos (ImagePullBackOff, CrashLoopBackOff…). Con kubectl logs ves la salida del contenedor.', points: 150 },
            { question: '¿Qué hace una readinessProbe?', options: ['Indica cuándo el Pod puede recibir tráfico', 'Reinicia el nodo', 'Mide el uso de CPU', 'Borra Pods antiguos'], answer: 'Indica cuándo el Pod puede recibir tráfico', explanation: 'Mientras no está listo, el Service no le envía peticiones. La livenessProbe es la que reinicia contenedores colgados.', points: 150 },
        ],
    },
    {
        slug: 'quiz-redis',
        title: 'Test de Redis',
        description: 'Estructuras de datos, caché, expiración y buenas prácticas.',
        type: 'quiz', course: 'redis-cache', difficulty: 'medium',
        questions: [
            { question: '¿Dónde guarda Redis los datos principalmente?', options: ['En memoria RAM', 'Solo en disco', 'En el navegador', 'En un archivo CSV'], answer: 'En memoria RAM', explanation: 'Por eso es tan rápido. Puede persistir en disco con RDB o AOF.', points: 80 },
            { question: '¿Qué estructura usarías para un ranking de puntuaciones?', options: ['Sorted set', 'List', 'String', 'Hash'], answer: 'Sorted set', explanation: 'Un sorted set ordena por puntuación: ZADD para sumar y ZREVRANGE para el top.', points: 150 },
            { question: '¿Qué hace SET clave valor EX 60?', options: ['Guarda el valor y lo borra a los 60 segundos', 'Guarda 60 copias', 'Espera 60 segundos antes de guardar', 'Limita el valor a 60 caracteres'], answer: 'Guarda el valor y lo borra a los 60 segundos', explanation: 'EX fija el tiempo de vida en segundos. TTL clave te dice cuánto le queda.', points: 120 },
            { question: '¿Por qué no debes usar KEYS * en producción?', options: ['Recorre todas las claves y bloquea Redis', 'Borra todas las claves', 'Solo funciona en local', 'Está obsoleto y da error'], answer: 'Recorre todas las claves y bloquea Redis', explanation: 'Redis atiende los comandos de uno en uno. Para iterar sin bloquear usa SCAN.', points: 150 },
            { question: 'En el patrón cache-aside, si la clave no está en Redis…', options: ['Lees la base de datos y guardas el resultado en Redis', 'Devuelves un error', 'Esperas a que otro proceso la cree', 'Reinicias Redis'], answer: 'Lees la base de datos y guardas el resultado en Redis', explanation: 'La aplicación consulta la caché, y si falla va a la fuente y rellena la caché con un TTL.', points: 150 },
            { question: '¿Qué comando incrementa un contador de forma atómica?', options: ['INCR', 'GET + SET', 'APPEND', 'HGET'], answer: 'INCR', explanation: 'INCR es atómico: aunque lleguen mil peticiones a la vez, no se pierde ninguna suma.', points: 100 },
        ],
    },
    {
        slug: 'adivina-output-python',
        title: 'Adivina la salida en Python',
        description: 'Lee el código Python y escribe exactamente lo que imprime.',
        type: 'guess_output', course: 'python-basico', difficulty: 'hard',
        questions: [
            { question: "nums = [4, 8, 15]\nprint(nums[-1])", answer: '15', explanation: 'Los índices negativos cuentan desde el final: -1 es el último elemento.', points: 80 },
            { question: "a = [1, 2, 3]\nb = a[:]\nb.append(4)\nprint(len(a))", answer: '3', explanation: 'a[:] crea una copia. Al añadir a b, a no cambia. Con b = a sí cambiarían las dos.', points: 150 },
            { question: 'print("python"[::-1])', answer: 'nohtyp', explanation: 'El slicing con paso -1 recorre la cadena al revés.', points: 120 },
            { question: "print(7 // 2, 7 % 2)", answer: '3 1', explanation: '// es división entera y % el resto. print separa sus argumentos con un espacio.', points: 120 },
            { question: "def f(x, lista=[]):\n    lista.append(x)\n    return lista\n\nf(1)\nprint(f(2))", answer: '[1, 2]', accept: ['[1,2]'], explanation: 'El valor por defecto se crea una sola vez y se comparte entre llamadas. Usa lista=None y créala dentro.', points: 200 },
            { question: 'print(" ".join(sorted("cab")))', answer: 'a b c', explanation: 'sorted devuelve una lista de caracteres ordenada y join los une con espacios.', points: 150 },
            { question: "x = 10\ndef cambiar():\n    x = 99\ncambiar()\nprint(x)", answer: '10', explanation: 'Dentro de la función, x = 99 crea una variable local. La global no cambia salvo que uses global x.', points: 150 },
        ],
    },
    {
        slug: 'quiz-algoritmos',
        title: 'Test de algoritmos',
        description: 'Complejidad, estructuras de datos, búsqueda y ordenación.',
        type: 'quiz', course: 'algoritmos', difficulty: 'medium',
        questions: [
            { question: '¿Qué complejidad tiene buscar un elemento en un array desordenado?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n²)'], answer: 'O(n)', explanation: 'En el peor caso hay que mirar todos los elementos.', points: 100 },
            { question: '¿Qué necesita la búsqueda binaria para funcionar?', options: ['Que los datos estén ordenados', 'Que no haya duplicados', 'Que el array tenga tamaño par', 'Una tabla hash'], answer: 'Que los datos estén ordenados', explanation: 'Descarta la mitad en cada paso comparando con el centro, por eso es O(log n).', points: 120 },
            { question: '¿Qué estructura sigue el orden "el último en entrar es el primero en salir"?', options: ['Pila', 'Cola', 'Árbol', 'Grafo'], answer: 'Pila', explanation: 'LIFO. La cola es FIFO: el primero en entrar es el primero en salir.', points: 100 },
            { question: 'Para saber si un número ya apareció en una lista grande, lo más eficiente es…', options: ['Guardar los vistos en un Set o tabla hash', 'Recorrer la lista entera cada vez', 'Ordenar la lista cada vez', 'Usar dos bucles anidados'], answer: 'Guardar los vistos en un Set o tabla hash', explanation: 'Comprobar si un elemento está en un Set es O(1) de media, frente a O(n) en una lista.', points: 150 },
            { question: '¿Qué complejidad tienen dos bucles anidados que recorren el mismo array de n elementos?', options: ['O(n²)', 'O(n)', 'O(2n)', 'O(log n)'], answer: 'O(n²)', explanation: 'Por cada uno de los n elementos se recorren otros n.', points: 120 },
            { question: '¿Qué le falta a una función recursiva que provoca un desbordamiento de pila?', options: ['Un caso base que detenga la recursión', 'Un bucle while', 'Variables globales', 'Un return al principio'], answer: 'Un caso base que detenga la recursión', explanation: 'Sin caso base (o si nunca se alcanza) la función se llama a sí misma indefinidamente.', points: 150 },
            { question: '¿Qué complejidad media tienen los buenos algoritmos de ordenación por comparación, como merge sort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(1)'], answer: 'O(n log n)', explanation: 'Es el límite teórico de la ordenación por comparación. Burbuja e inserción son O(n²).', points: 200 },
        ],
    },
    {
        slug: 'quiz-vue',
        title: 'Test de Vue.js',
        description: 'Reactividad, componentes y Composition API en Vue 3.',
        type: 'quiz', course: 'vuejs', difficulty: 'medium',
        questions: [
            { question: '¿Cómo creas un valor reactivo simple en la Composition API?', options: ['ref(0)', 'useState(0)', 'reactive(0)', 'new Vue(0)'], answer: 'ref(0)', explanation: 'ref envuelve el valor; en el script se lee con .value y en la plantilla directamente.', points: 100 },
            { question: '¿Qué directiva pinta un elemento por cada elemento de un array?', options: ['v-for', 'v-if', 'v-model', 'v-bind'], answer: 'v-for', explanation: 'v-for="tarea in tareas" junto con :key="tarea.id".', points: 80 },
            { question: '¿Para qué sirve v-model?', options: ['Enlazar en ambos sentidos un input con un dato', 'Definir un modelo de base de datos', 'Importar componentes', 'Validar formularios en el servidor'], answer: 'Enlazar en ambos sentidos un input con un dato', explanation: 'Al escribir se actualiza el dato y al cambiar el dato se actualiza el input.', points: 120 },
            { question: '¿Qué usarías para un valor derivado de otros que se recalcula solo cuando estos cambian?', options: ['computed', 'watch', 'ref', 'onMounted'], answer: 'computed', explanation: 'computed se cachea hasta que cambian sus dependencias. watch es para efectos secundarios.', points: 150 },
            { question: '¿Cómo avisa un componente hijo a su padre?', options: ['Emitiendo un evento con emit', 'Modificando sus props', 'Con v-if', 'Importando al padre'], answer: 'Emitiendo un evento con emit', explanation: 'Las props bajan del padre al hijo y los eventos suben del hijo al padre.', points: 120 },
            { question: '¿Qué librería es la recomendada hoy para el estado global en Vue 3?', options: ['Pinia', 'Redux', 'Vuex 2', 'Zustand'], answer: 'Pinia', explanation: 'Pinia es la librería oficial de estado y sustituye a Vuex.', points: 100 },
        ],
    },
    {
        slug: 'ordena-sql',
        title: 'Ordena la consulta SQL',
        description: 'Coloca las cláusulas de cada consulta en el orden correcto.',
        type: 'order_blocks', course: 'sql-basico', difficulty: 'medium',
        questions: [
            { question: 'Ordena una consulta con filtro y orden:', options: ['SELECT nombre, email', 'FROM usuarios', "WHERE activo = true", 'ORDER BY nombre', 'LIMIT 10'], explanation: 'El orden de escritura es SELECT, FROM, WHERE, ORDER BY y LIMIT.', points: 120 },
            { question: 'Ordena una consulta con agrupación:', options: ['SELECT cliente_id, SUM(total) AS gastado', 'FROM pedidos', "WHERE estado = 'pagado'", 'GROUP BY cliente_id', 'HAVING SUM(total) > 100', 'ORDER BY gastado DESC'], explanation: 'WHERE filtra filas antes de agrupar; HAVING filtra grupos después de GROUP BY.', points: 200 },
            { question: 'Ordena una consulta con JOIN:', options: ['SELECT c.nombre, p.total', 'FROM clientes c', 'JOIN pedidos p ON p.cliente_id = c.id', 'WHERE p.total > 50'], explanation: 'Los JOIN van justo después del FROM y antes del WHERE.', points: 150 },        ],
    },
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
