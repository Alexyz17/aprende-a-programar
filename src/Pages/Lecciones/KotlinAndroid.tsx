import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/kotlin-android', title: 'Kotlin para Android — fundamentos', free: true },
    { id: '/lecciones/kotlin-android#compose', title: 'Jetpack Compose básico', free: true },
    { id: '/lecciones/kotlin-android#viewmodel', title: 'ViewModel y estado', free: true },
    { id: '/lecciones/kotlin-android#coroutines', title: 'Coroutines y Flow', free: true },
    { id: '/lecciones/kotlin-android#room', title: 'Room — base de datos local', free: true },
    { id: '/lecciones/kotlin-android#retrofit', title: 'Retrofit y APIs REST', free: true },
    { id: '/lecciones/kotlin-android#navigation', title: 'Navigation Component', free: true },
    { id: '/lecciones/kotlin-android#material3', title: 'Material 3 y temas', free: true },
];

export default function KotlinAndroid() {
    return (
        <LessonLayout
            title="Kotlin para Android"
            description="Desarrolla apps Android profesionales con Kotlin, Jetpack Compose, ViewModel, Room y Material 3."
            duration="6h 00min"
            lessons={32}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/kotlin-android"
            allUnlocked={true}
            category="Mobile"
        >
            <Head>
                <title>Kotlin para Android — Aprende a Programar</title>
                <meta name="description" content="Curso completo de Android con Kotlin y Jetpack Compose. ViewModel, Coroutines, Room, Retrofit y Material 3." />
            </Head>

            <h1>Kotlin para Android</h1>

            <blockquote>
                Android tiene más de 3.000 millones de dispositivos activos. Con Kotlin y Jetpack Compose puedes construir apps nativas de alta calidad siguiendo los patrones de arquitectura que Google recomienda en 2026.
            </blockquote>

            {/* ── 1. Kotlin ── */}
            <h2 id="kotlin">Kotlin para Android — fundamentos</h2>
            <pre><code>{`// Null safety
var nombre: String = "Ana"
var apellido: String? = null
val longitud = apellido?.length ?: 0

// Data classes
data class Usuario(
    val id: Int,
    val nombre: String,
    val email: String,
    val activo: Boolean = true
)

// Sealed classes para resultados
sealed class Resultado<out T> {
    data class Exito<T>(val datos: T) : Resultado<T>()
    data class Error(val mensaje: String, val codigo: Int = -1) : Resultado<Nothing>()
    object Cargando : Resultado<Nothing>()
}

// Extension functions
fun String.esEmailValido(): Boolean =
    android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()

// Scope functions
val lista = mutableListOf<String>().apply {
    add("Kotlin")
    add("Compose")
    add("Coroutines")
}

// Higher-order functions
fun <T> List<T>.filtrarYMapear(
    predicado: (T) -> Boolean,
    transformacion: (T) -> T
): List<T> = filter(predicado).map(transformacion)`}</code></pre>

            {/* ── 2. Compose ── */}
            <h2 id="compose">Jetpack Compose — UI declarativa</h2>
            <pre><code>{`// Composable con estado local
@Composable
fun FormularioLogin(
    onLoginExito: (String) -> Unit
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var mostrarPassword by remember { mutableStateOf(false) }
    var cargando by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(24.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            "Bienvenido",
            style = MaterialTheme.typography.headlineLarge,
            modifier = Modifier.padding(bottom = 32.dp)
        )

        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            leadingIcon = { Icon(Icons.Default.Email, null) },
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Next
            ),
            modifier = Modifier.fillMaxWidth(),
            isError = email.isNotEmpty() && !email.esEmailValido()
        )

        Spacer(Modifier.height(12.dp))

        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Contraseña") },
            visualTransformation = if (mostrarPassword)
                VisualTransformation.None else PasswordVisualTransformation(),
            trailingIcon = {
                IconButton(onClick = { mostrarPassword = !mostrarPassword }) {
                    Icon(
                        if (mostrarPassword) Icons.Default.VisibilityOff
                        else Icons.Default.Visibility,
                        contentDescription = null
                    )
                }
            },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(24.dp))

        Button(
            onClick = {
                cargando = true
                onLoginExito(email)
            },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            enabled = email.esEmailValido() && password.length >= 6 && !cargando
        ) {
            if (cargando) {
                CircularProgressIndicator(
                    modifier = Modifier.size(20.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Iniciar sesión")
            }
        }
    }
}`}</code></pre>

            {/* ── 3. ViewModel ── */}
            <h2 id="viewmodel">ViewModel y estado</h2>
            <pre><code>{`// UiState — encapsula todo el estado de la pantalla
data class UsuariosUiState(
    val usuarios: List<Usuario> = emptyList(),
    val cargando: Boolean = false,
    val error: String? = null,
    val busqueda: String = ""
)

@HiltViewModel
class UsuariosViewModel @Inject constructor(
    private val repo: UsuarioRepositorio
) : ViewModel() {

    private val _uiState = MutableStateFlow(UsuariosUiState())
    val uiState: StateFlow<UsuariosUiState> = _uiState.asStateFlow()

    init { cargarUsuarios() }

    fun cargarUsuarios() {
        viewModelScope.launch {
            _uiState.update { it.copy(cargando = true, error = null) }
            when (val resultado = repo.obtenerTodos()) {
                is Resultado.Exito ->
                    _uiState.update { it.copy(usuarios = resultado.datos, cargando = false) }
                is Resultado.Error ->
                    _uiState.update { it.copy(error = resultado.mensaje, cargando = false) }
                else -> {}
            }
        }
    }

    fun actualizarBusqueda(texto: String) {
        _uiState.update { it.copy(busqueda = texto) }
    }

    val usuariosFiltrados: StateFlow<List<Usuario>> = uiState
        .map { state ->
            if (state.busqueda.isBlank()) state.usuarios
            else state.usuarios.filter {
                it.nombre.contains(state.busqueda, ignoreCase = true) ||
                it.email.contains(state.busqueda, ignoreCase = true)
            }
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())
}

// Pantalla que consume el ViewModel
@Composable
fun PantallaUsuarios(viewModel: UsuariosViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    val usuariosFiltrados by viewModel.usuariosFiltrados.collectAsStateWithLifecycle()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("Usuarios") })
        }
    ) { padding ->
        Column(modifier = Modifier.padding(padding)) {
            SearchBar(
                query = uiState.busqueda,
                onQueryChange = viewModel::actualizarBusqueda
            )
            when {
                uiState.cargando -> LoadingIndicator()
                uiState.error != null -> ErrorView(uiState.error!!, viewModel::cargarUsuarios)
                else -> ListaUsuarios(usuariosFiltrados)
            }
        }
    }
}`}</code></pre>

            {/* ── 4. Coroutines ── */}
            <h2 id="coroutines">Coroutines y Flow</h2>
            <pre><code>{`// Coroutines básicas
viewModelScope.launch {
    // código suspendible — no bloquea el hilo principal
    val datos = withContext(Dispatchers.IO) {
        api.obtenerDatos()  // en hilo de I/O
    }
    _uiState.update { it.copy(datos = datos) }  // de vuelta en Main
}

// async/await para operaciones paralelas
viewModelScope.launch {
    val (usuarios, estadisticas) = coroutineScope {
        val u = async { repo.obtenerUsuarios() }
        val e = async { repo.obtenerEstadisticas() }
        u.await() to e.await()
    }
}

// Flow — stream de datos reactivo
class UsuarioRepositorio(private val dao: UsuarioDao) {
    // Flow de Room — se actualiza automáticamente al cambiar la BD
    val todosLosUsuarios: Flow<List<Usuario>> = dao.observarTodos()

    suspend fun obtenerPorId(id: Int): Resultado<Usuario> {
        return try {
            val usuario = dao.buscarPorId(id) ?: return Resultado.Error("No encontrado", 404)
            Resultado.Exito(usuario)
        } catch (e: Exception) {
            Resultado.Error(e.message ?: "Error desconocido")
        }
    }
}

// Coleccionar Flow en el ViewModel
val usuarios: StateFlow<List<Usuario>> = repo.todosLosUsuarios
    .catch { e -> _uiState.update { it.copy(error = e.message) } }
    .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

// Transformaciones de Flow
repo.todosLosUsuarios
    .filter { lista -> lista.isNotEmpty() }
    .map { lista -> lista.sortedBy { it.nombre } }
    .distinctUntilChanged()
    .collect { listaOrdenada -> /* actualizar UI */ }`}</code></pre>

            {/* ── 5. Room ── */}
            <h2 id="room">Room — base de datos local</h2>
            <pre><code>{`// Entidad
@Entity(tableName = "usuarios")
data class UsuarioEntity(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    @ColumnInfo(name = "nombre") val nombre: String,
    @ColumnInfo(name = "email") val email: String,
    @ColumnInfo(name = "creado_en") val creadoEn: Long = System.currentTimeMillis()
)

// DAO — Data Access Object
@Dao
interface UsuarioDao {
    @Query("SELECT * FROM usuarios ORDER BY nombre ASC")
    fun observarTodos(): Flow<List<UsuarioEntity>>

    @Query("SELECT * FROM usuarios WHERE id = :id")
    suspend fun buscarPorId(id: Int): UsuarioEntity?

    @Query("SELECT * FROM usuarios WHERE nombre LIKE '%' || :busqueda || '%'")
    fun buscar(busqueda: String): Flow<List<UsuarioEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertar(usuario: UsuarioEntity): Long

    @Update
    suspend fun actualizar(usuario: UsuarioEntity)

    @Delete
    suspend fun eliminar(usuario: UsuarioEntity)

    @Query("DELETE FROM usuarios WHERE id = :id")
    suspend fun eliminarPorId(id: Int)
}

// Base de datos
@Database(entities = [UsuarioEntity::class], version = 1, exportSchema = true)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun usuarioDao(): UsuarioDao

    companion object {
        @Volatile private var INSTANCIA: AppDatabase? = null

        fun obtener(context: Context): AppDatabase =
            INSTANCIA ?: synchronized(this) {
                Room.databaseBuilder(context, AppDatabase::class.java, "app.db")
                    .addMigrations(MIGRATION_1_2)
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { INSTANCIA = it }
            }
    }
}`}</code></pre>

            {/* ── 6. Retrofit ── */}
            <h2 id="retrofit">Retrofit y APIs REST</h2>
            <pre><code>{`// Interfaz de la API
interface UsuarioApi {
    @GET("usuarios")
    suspend fun obtenerTodos(): List<UsuarioDto>

    @GET("usuarios/{id}")
    suspend fun obtenerPorId(@Path("id") id: Int): UsuarioDto

    @POST("usuarios")
    suspend fun crear(@Body usuario: CrearUsuarioRequest): UsuarioDto

    @PUT("usuarios/{id}")
    suspend fun actualizar(@Path("id") id: Int, @Body datos: ActualizarUsuarioRequest): UsuarioDto

    @DELETE("usuarios/{id}")
    suspend fun eliminar(@Path("id") id: Int): Response<Unit>
}

// Configuración de Retrofit con Hilt
@Module @InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.miapp.com/v1/")
        .addConverterFactory(Json.asConverterFactory("application/json".toMediaType()))
        .client(OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG)
                    HttpLoggingInterceptor.Level.BODY
                else HttpLoggingInterceptor.Level.NONE
            })
            .addInterceptor { chain ->
                chain.proceed(
                    chain.request().newBuilder()
                        .header("Authorization", "Bearer \${SessionManager.token}")
                        .build()
                )
            }
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
        )
        .build()

    @Provides @Singleton
    fun provideUsuarioApi(retrofit: Retrofit): UsuarioApi =
        retrofit.create(UsuarioApi::class.java)
}`}</code></pre>

            {/* ── 7. Navigation ── */}
            <h2 id="navigation">Navigation Compose</h2>
            <pre><code>{`// Definir rutas como sealed class
sealed class Ruta(val ruta: String) {
    object Login : Ruta("login")
    object Usuarios : Ruta("usuarios")
    object DetalleUsuario : Ruta("usuarios/{usuarioId}") {
        fun con(id: Int) = "usuarios/$id"
    }
    object Configuracion : Ruta("configuracion")
}

// NavGraph principal
@Composable
fun NavGraph(navController: NavHostController = rememberNavController()) {
    NavHost(navController, startDestination = Ruta.Login.ruta) {
        composable(Ruta.Login.ruta) {
            PantallaLogin(onLoginExito = {
                navController.navigate(Ruta.Usuarios.ruta) {
                    popUpTo(Ruta.Login.ruta) { inclusive = true }
                }
            })
        }
        composable(Ruta.Usuarios.ruta) {
            PantallaUsuarios(
                onUsuarioClick = { id ->
                    navController.navigate(Ruta.DetalleUsuario.con(id))
                }
            )
        }
        composable(
            route = Ruta.DetalleUsuario.ruta,
            arguments = listOf(navArgument("usuarioId") { type = NavType.IntType })
        ) { backStackEntry ->
            val usuarioId = backStackEntry.arguments?.getInt("usuarioId") ?: return@composable
            PantallaDetalleUsuario(usuarioId, onVolver = navController::popBackStack)
        }
    }
}`}</code></pre>

            {/* ── 8. Material 3 ── */}
            <h2 id="material3">Material 3 y temas dinámicos</h2>
            <pre><code>{`// Configurar tema Material 3 con Dynamic Color (Android 12+)
@Composable
fun MiAppTema(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = Build.VERSION.SDK_INT >= Build.VERSION_CODES.S,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && darkTheme -> dynamicDarkColorScheme(LocalContext.current)
        dynamicColor -> dynamicLightColorScheme(LocalContext.current)
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = AppTypography,
        content = content
    )
}

// Componentes Material 3
@Composable
fun PantallaEjemplo() {
    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Mi App") },
                actions = {
                    IconButton(onClick = { /* ajustes */ }) {
                        Icon(Icons.Default.Settings, "Ajustes")
                    }
                }
            )
        },
        floatingActionButton = {
            ExtendedFloatingActionButton(
                onClick = { /* nuevo */ },
                icon = { Icon(Icons.Default.Add, null) },
                text = { Text("Nuevo") }
            )
        },
        bottomBar = {
            NavigationBar {
                NavigationBarItem(
                    selected = true,
                    onClick = { },
                    icon = { Icon(Icons.Default.Home, null) },
                    label = { Text("Inicio") }
                )
                // ... más items
            }
        }
    ) { padding ->
        // Contenido principal
    }
}`}</code></pre>

            <h2>Proyecto final</h2>
            <p>
                Con todo lo anterior construirás una app completa de gestión de tareas: autenticación, lista de tareas sincronizada con una API REST, almacenamiento local con Room, navegación entre pantallas y soporte de tema oscuro/claro. Lista para publicar en Google Play.
            </p>
        </LessonLayout>
    );
}
