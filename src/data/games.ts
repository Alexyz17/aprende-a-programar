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
];

export const gameBySlug = (slug: string) => GAMES.find((g) => g.slug === slug);
