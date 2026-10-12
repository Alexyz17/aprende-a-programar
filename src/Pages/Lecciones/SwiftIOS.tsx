import LessonLayout from '@/layouts/LessonLayout';
import { Head } from '@inertiajs/react';

const modules = [
    { id: '/lecciones/swift-ios', title: 'Swift — fundamentos esenciales', free: true },
    { id: '/lecciones/swift-ios#swiftui', title: 'Vistas, estado y bindings', free: true },
    { id: '/lecciones/swift-ios#mvvm', title: 'MVVM con @Observable', free: true },
    { id: '/lecciones/swift-ios#networking', title: 'Networking con async/await', free: true },
    { id: '/lecciones/swift-ios#swiftdata', title: 'Persistencia con SwiftData', free: true },
    { id: '/lecciones/swift-ios#navigation', title: 'Navigation y tabs', free: true },
    { id: '/lecciones/swift-ios#hig', title: 'HIG y diseño para iOS', free: true },
    { id: '/lecciones/swift-ios#appstore', title: 'Publicar en App Store', free: true },
];

export default function SwiftIOS() {
    return (
        <LessonLayout
            title="Swift para iOS"
            description="Desarrolla apps iOS modernas con SwiftUI, MVVM, SwiftData y los patrones que Apple recomienda en 2026."
            duration="5h 30min"
            lessons={28}
            level="Intermedio"
            premium={false}
            modules={modules}
            activeModule="/lecciones/swift-ios"
            allUnlocked={true}
            category="Mobile"
        >
            <Head>
                <title>Swift para iOS — Aprende a Programar</title>
                <meta name="description" content="Curso completo de iOS con SwiftUI, MVVM, SwiftData, URLSession y publicación en App Store." />
            </Head>

            <h1>Swift para iOS</h1>

            <blockquote>
                iOS es la plataforma con los usuarios más rentables del mundo. Swift y SwiftUI te permiten construir interfaces que funcionan en iPhone, iPad y Mac con el mismo código, siguiendo las guías HIG de Apple.
            </blockquote>

            {/* ── 1. Swift ── */}
            <h2 id="swift">Swift — fundamentos esenciales</h2>
            <pre><code>{`// Opcionales y nil safety
var nombre: String? = "Ana"
let longitud = nombre?.count ?? 0

// Structs con propiedades computadas
struct Usuario {
    let id: UUID
    var nombre: String
    var email: String
    var activo: Bool = true

    var iniciales: String {
        nombre.split(separator: " ").compactMap { $0.first }.map(String.init).joined()
    }
}

// Enums con valores asociados
enum ResultadoAPI<T> {
    case exito(T)
    case error(codigo: Int, mensaje: String)
    case cargando
}

// Protocols
protocol Repositorio {
    associatedtype Entidad
    func obtenerTodos() async throws -> [Entidad]
    func buscarPorId(_ id: UUID) async throws -> Entidad?
    func guardar(_ entidad: Entidad) async throws
    func eliminar(_ id: UUID) async throws
}

// Extensions
extension String {
    var esEmailValido: Bool {
        let regex = try? NSRegularExpression(pattern: "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\\\.[A-Za-z]{2,}")
        return regex?.firstMatch(in: self, range: NSRange(startIndex..., in: self)) != nil
    }
}`}</code></pre>

            {/* ── 2. SwiftUI ── */}
            <h2 id="swiftui">SwiftUI — UI declarativa</h2>
            <pre><code>{`import SwiftUI

// Formulario de login
struct LoginView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var mostrarPassword = false
    @State private var cargando = false

    var botonHabilitado: Bool {
        email.esEmailValido && password.count >= 6 && !cargando
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Credenciales") {
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)

                    HStack {
                        Group {
                            if mostrarPassword {
                                TextField("Contraseña", text: $password)
                            } else {
                                SecureField("Contraseña", text: $password)
                            }
                        }
                        Button {
                            mostrarPassword.toggle()
                        } label: {
                            Image(systemName: mostrarPassword ? "eye.slash" : "eye")
                                .foregroundStyle(.secondary)
                        }
                    }
                }

                Section {
                    Button {
                        Task { await iniciarSesion() }
                    } label: {
                        if cargando {
                            ProgressView()
                                .frame(maxWidth: .infinity)
                        } else {
                            Text("Iniciar sesión")
                                .frame(maxWidth: .infinity)
                                .bold()
                        }
                    }
                    .disabled(!botonHabilitado)
                }
            }
            .navigationTitle("Bienvenido")
        }
    }

    private func iniciarSesion() async {
        cargando = true
        defer { cargando = false }
        // llamar a la API
    }
}`}</code></pre>

            {/* ── 3. MVVM ── */}
            <h2 id="mvvm">MVVM con @Observable (iOS 17+)</h2>
            <pre><code>{`import Observation

// @Observable reemplaza a ObservableObject + @Published
@Observable
class UsuariosViewModel {
    var usuarios: [Usuario] = []
    var cargando = false
    var error: String?
    var busqueda = ""

    // Computed — filtrado reactivo
    var usuariosFiltrados: [Usuario] {
        guard !busqueda.isEmpty else { return usuarios }
        return usuarios.filter {
            $0.nombre.localizedCaseInsensitiveContains(busqueda) ||
            $0.email.localizedCaseInsensitiveContains(busqueda)
        }
    }

    private let api: UsuarioAPI

    init(api: UsuarioAPI = .live) { self.api = api }

    func cargar() async {
        cargando = true
        error = nil
        do {
            usuarios = try await api.obtenerUsuarios()
        } catch {
            self.error = error.localizedDescription
        }
        cargando = false
    }

    func eliminar(at offsets: IndexSet) async {
        let idsAEliminar = offsets.map { usuariosFiltrados[$0].id }
        usuarios.removeAll { idsAEliminar.contains($0.id) }
        // También llamar a la API
        for id in idsAEliminar {
            try? await api.eliminarUsuario(id)
        }
    }
}

// Vista consumidora
struct PantallaUsuarios: View {
    @State private var vm = UsuariosViewModel()

    var body: some View {
        NavigationStack {
            Group {
                if vm.cargando && vm.usuarios.isEmpty {
                    ProgressView("Cargando...")
                } else if let error = vm.error {
                    ContentUnavailableView(
                        "Error al cargar",
                        systemImage: "wifi.slash",
                        description: Text(error)
                    )
                } else {
                    List {
                        ForEach(vm.usuariosFiltrados) { usuario in
                            NavigationLink(value: usuario) {
                                TarjetaUsuario(usuario: usuario)
                            }
                        }
                        .onDelete { offsets in
                            Task { await vm.eliminar(at: offsets) }
                        }
                    }
                    .searchable(text: $vm.busqueda)
                }
            }
            .navigationTitle("Usuarios")
            .navigationDestination(for: Usuario.self) { DetalleUsuario(usuario: $0) }
            .refreshable { await vm.cargar() }
            .task { await vm.cargar() }
        }
    }
}`}</code></pre>

            {/* ── 4. Networking ── */}
            <h2 id="networking">Networking con async/await</h2>
            <pre><code>{`// Cliente HTTP genérico
struct APIClient {
    let baseURL: URL
    var token: String?

    func request<T: Decodable>(_ endpoint: Endpoint) async throws -> T {
        var request = URLRequest(url: baseURL.appendingPathComponent(endpoint.ruta))
        request.httpMethod = endpoint.metodo
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        if let token {
            request.setValue("Bearer \\(token)", forHTTPHeaderField: "Authorization")
        }

        if let body = endpoint.body {
            request.httpBody = try JSONEncoder().encode(body)
        }

        let (data, response) = try await URLSession.shared.data(for: request)

        guard let http = response as? HTTPURLResponse else {
            throw APIError.respuestaInvalida
        }

        guard (200..<300).contains(http.statusCode) else {
            let error = try? JSONDecoder().decode(ErrorResponse.self, from: data)
            throw APIError.httpError(http.statusCode, error?.mensaje ?? "Error desconocido")
        }

        let decoder = JSONDecoder()
        decoder.keyDecodingStrategy = .convertFromSnakeCase
        decoder.dateDecodingStrategy = .iso8601
        return try decoder.decode(T.self, from: data)
    }
}

// Definir endpoints
struct UsuarioAPI {
    let client: APIClient

    func obtenerUsuarios() async throws -> [Usuario] {
        try await client.request(.get("/usuarios"))
    }

    func obtenerPorId(_ id: UUID) async throws -> Usuario {
        try await client.request(.get("/usuarios/\\(id)"))
    }

    func crear(_ datos: CrearUsuarioRequest) async throws -> Usuario {
        try await client.request(.post("/usuarios", body: datos))
    }
}`}</code></pre>

            {/* ── 5. SwiftData ── */}
            <h2 id="swiftdata">Persistencia con SwiftData</h2>
            <pre><code>{`import SwiftData

// Modelo persistente (reemplaza Core Data en iOS 17+)
@Model
final class TareaModel {
    var id: UUID
    var titulo: String
    var completada: Bool
    var creadaEn: Date
    var prioridad: Int

    @Relationship(deleteRule: .cascade) var etiquetas: [EtiquetaModel]

    init(titulo: String, prioridad: Int = 1) {
        self.id = UUID()
        self.titulo = titulo
        self.completada = false
        self.creadaEn = .now
        self.prioridad = prioridad
        self.etiquetas = []
    }
}

// En la App
@main
struct MiApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: [TareaModel.self, EtiquetaModel.self])
    }
}

// Consultas en la vista
struct ListaTareas: View {
    @Query(sort: \\TareaModel.creadaEn, order: .reverse)
    var tareas: [TareaModel]

    @Query(
        filter: #Predicate { !$0.completada },
        sort: \\TareaModel.prioridad, order: .reverse
    )
    var tareasPendientes: [TareaModel]

    @Environment(\\.modelContext) private var contexto

    var body: some View {
        List(tareas) { tarea in
            TareaFila(tarea: tarea)
        }
    }

    func agregarTarea(titulo: String) {
        let nueva = TareaModel(titulo: titulo)
        contexto.insert(nueva)
    }
}`}</code></pre>

            {/* ── 6. Navigation ── */}
            <h2 id="navigation">Navigation y estructura de la app</h2>
            <pre><code>{`// Estructura con TabView y NavigationStack
struct ContentView: View {
    @State private var tab = Tab.inicio

    enum Tab { case inicio, explorar, perfil }

    var body: some View {
        TabView(selection: $tab) {
            Tab("Inicio", systemImage: "house.fill", value: .inicio) {
                InicioView()
            }
            Tab("Explorar", systemImage: "magnifyingglass", value: .explorar) {
                ExplorarView()
            }
            Tab("Perfil", systemImage: "person.fill", value: .perfil) {
                PerfilView()
            }
        }
    }
}

// NavigationStack con NavigationPath (programático)
struct InicioView: View {
    @State private var ruta = NavigationPath()

    var body: some View {
        NavigationStack(path: $ruta) {
            InicioListaView()
                .navigationDestination(for: Usuario.self) { DetalleUsuario(usuario: $0) }
                .navigationDestination(for: Configuracion.self) { ConfigView(config: $0) }
        }
    }
}`}</code></pre>

            {/* ── 7. HIG ── */}
            <h2 id="hig">HIG — Diseño para iOS</h2>
            <pre><code>{`// Principios de las Human Interface Guidelines

// 1. Tipografía dinámica — respeta el tamaño de texto del usuario
Text("Título importante")
    .font(.title)                      // usa Dynamic Type
    .fontDesign(.rounded)              // SF Rounded

// 2. Colores adaptativos — automáticos en light/dark
Color.primary           // negro en light, blanco en dark
Color.secondary         // gris
Color.accentColor       // color de énfasis del sistema/app

// 3. Haptics — feedback táctil apropiado
let impacto = UIImpactFeedbackGenerator(style: .medium)
impacto.impactOccurred()  // al realizar una acción

let notificacion = UINotificationFeedbackGenerator()
notificacion.notificationOccurred(.success)  // al completar algo

// 4. SF Symbols — iconografía coherente con el sistema
Image(systemName: "heart.fill")
    .symbolRenderingMode(.hierarchical)
    .foregroundStyle(.red)

// 5. Accesibilidad — obligatorio para App Store
Image("logo")
    .accessibilityLabel("Logo de la empresa")
    .accessibilityHidden(false)

Button("Eliminar") { /* ... */ }
    .accessibilityHint("Elimina este elemento permanentemente")`}</code></pre>

            {/* ── 8. App Store ── */}
            <h2 id="appstore">Publicar en App Store</h2>
            <pre><code>{`// Lista de verificación para publicación

// 1. App Store Connect — crear la app
// - Bundle ID único (com.empresa.app)
// - Versión y build number
// - Capturas de pantalla para cada tamaño de dispositivo
// - Descripción, palabras clave y categoría

// 2. Info.plist — permisos necesarios
// NSCameraUsageDescription — "Usamos la cámara para..."
// NSLocationWhenInUseUsageDescription — "Tu ubicación para..."
// NSPhotoLibraryUsageDescription — "Accedemos a tus fotos para..."

// 3. Signing — certificados
// - Provisioning Profile (Distribution)
// - Certificado de distribución de Apple Developer

// 4. Archive y upload con Xcode
// Product → Archive → Distribute App → App Store Connect

// 5. TestFlight — beta antes del lanzamiento
// - Invitar testers internos y externos
// - Recopilar feedback antes de la revisión de Apple

// 6. Revisión de Apple — checklist
// ✅ No APIs privadas
// ✅ Todas las funcionalidades funcionan sin login (si aplica)
// ✅ Política de privacidad enlazada
// ✅ Información de contacto del soporte
// ✅ Capturas de pantalla reales (no mockups genéricos)`}</code></pre>

            <h2>Proyecto final</h2>
            <p>
                Construirás una app de seguimiento de hábitos: SwiftUI + MVVM + SwiftData para persistencia local + widgets para la pantalla de inicio + notificaciones locales. Lista para subir a App Store.
            </p>
        </LessonLayout>
    );
}
