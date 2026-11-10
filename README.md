# CHS Burger: sistema de reservas

Sistema de reservas de mesas para partidos y eventos de **CHS Burger**.

Los clientes consultan la agenda de partidos y eventos del local, reservan una mesa y siguen el estado de su reserva. Los empleados registran señas, asignan mesas y hacen el check-in. El administrador carga los eventos y consulta reportes de ocupación.

> Estado actual: backend MVC con registro e inicio de sesión (JWT), CRUD de **Eventos**, **Reservas** con su flujo de estados, asignación de mesas y reporte de ocupación, con persistencia en memoria (arrays). Frontend en React conectado a esa API.

## Cómo ejecutarlo

Se necesitan dos terminales, una para cada parte.

**Backend**

```
cd Backend
npm install
npm start        # o npm run dev para reiniciar al guardar
```

El servidor escucha en `http://localhost:3000`. Variables de entorno opcionales:

| Variable | Para qué sirve | Valor por defecto |
|---|---|---|
| `PORT` | Puerto del servidor | `3000` |
| `FRONTEND_URL` | Origen permitido por CORS | `http://localhost:5173` |
| `JWT_SECRET` | Clave para firmar los tokens de sesión | una clave de desarrollo (cambiarla en producción) |

Los datos viven en memoria: al reiniciar el servidor vuelven a los datos de ejemplo.

**Frontend**

```
cd Frontend
npm install
npm run dev
```

La aplicación queda en `http://localhost:5173`. Por defecto consume la API en `http://localhost:3000/api`; para cambiarla, copiar `.env.example` a `.env` y modificar `VITE_API_URL`.

## Cuentas de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Administrador | `admin@chsburger.com` | `Admin1234` |
| Empleado | `empleado@chsburger.com` | `Empleado1234` |
| Cliente | `cliente@chsburger.com` | `Cliente1234` |
| Cliente | `sofia@mail.com` | `Cliente1234` |

Los datos de ejemplo incluyen un partido que empezó hace 30 minutos (*Racing vs. Independiente*), para poder probar desde el panel el check-in, las ausencias y la finalización de reservas.

## Frontend

Respeta el wireframe de la primera entrega (navbar, portada con llamado a la acción, sobre nosotros, grilla de 4 productos estrella y footer con contacto y redes) con los cambios definidos en la entrega 2: la portada muestra el próximo evento destacado y se suma la sección **Agenda** entre la portada y "Sobre nosotros". Usa la identidad visual definida: amarillo `#FFC300`, negro `#1A1A1A`, rojo `#D62828` para los botones de acción, Anton para títulos y Poppins para textos.

### Pantallas

| Ruta | Pantalla | Acceso |
|---|---|---|
| `/` | Inicio: portada con el evento destacado, agenda con lugares disponibles, sobre nosotros, productos estrella | Todos |
| `/eventos/:id` | Detalle de un evento y formulario de reserva | Todos (reservar: cliente) |
| `/ingresar`, `/registro` | Inicio de sesión y registro de clientes | Todos |
| `/mis-reservas` | Reservas del cliente (próximas e historial), con modificar y cancelar | Cliente |
| `/mis-reservas/:id/editar` | Modificar cantidad de personas y observaciones | Cliente |
| `/panel/reservas` | Panel de recepción: seña, asignación de mesa, check-in, ausencias, finalizar y cancelar con motivo | Empleado, Admin |
| `/admin/eventos` | Listado de eventos con opciones para editar y eliminar (con confirmación) | Admin |
| `/admin/eventos/nuevo`, `/admin/eventos/:id/editar` | Alta y edición de un evento | Admin |
| `/admin/reportes` | Ranking de ocupación por evento, cancelaciones y ausencias | Admin |

Si alguien sin sesión entra a una ruta protegida, se lo manda a *Ingresar* y después vuelve a donde quería ir (por ejemplo, al evento que estaba por reservar). Si el rol no corresponde, se muestra *Acceso denegado*.

Las imágenes (portada, sobre nosotros, productos y detalle de evento) están vacías a propósito, con el mismo formato del wireframe. Para cargar las fotos reales se agregan en `src/assets/` y se completa el campo `imagen` de cada producto en `src/data/negocio.js`.

### Experiencia de usuario y accesibilidad

- Estados de carga en cada pantalla que consulta la API y en los botones mientras se guarda o elimina.
- Un único sistema de notificaciones laterales (toasts) para operaciones exitosas y errores, incluidos los que devuelve el backend y la falta de conexión.
- Validación de formularios en el cliente (además de la del servidor), con mensajes debajo de cada campo y foco en el primer campo con error.
- Confirmación en un diálogo modal antes de eliminar un evento, cancelar una reserva o marcar una ausencia.
- `label` asociados a cada `input`, botones semánticos, textos alternativos en las imágenes, enlace para saltar al contenido, foco visible, título de pestaña por pantalla y diseño adaptable a celulares.

## Estructura del repositorio

```
├── Frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── public/               # favicon
│   └── src/
│       ├── main.jsx          # punto de entrada
│       ├── App.jsx           # rutas de la aplicación
│       ├── assets/           # logo (las fotos van acá)
│       ├── components/       # componentes reutilizables (Button, FormField, EventoCard, ConfirmDialog, ...)
│       ├── pages/            # pantallas principales
│       ├── services/         # comunicación con la API: api.js (fetch, token y errores) y un servicio por recurso
│       ├── context/          # sesión del usuario (AuthContext) y notificaciones (ToastContext)
│       ├── hooks/            # useRecurso (carga de datos), useFormulario (validación), useAuth, useToast, useTituloPagina
│       ├── data/             # contenido fijo del negocio (productos, sucursales, contacto)
│       ├── utils/            # formateo, fechas y validaciones
│       └── styles/           # variables de diseño y estilos globales
├── Backend/
│   ├── package.json
│   └── src/
│       ├── server.js         # levanta el servidor
│       ├── app.js            # configura Express, rutas y middlewares
│       ├── routes/           # definición de endpoints
│       ├── controllers/      # reciben la petición y devuelven la respuesta
│       ├── services/         # reglas de negocio y validaciones
│       ├── repositories/     # acceso a los datos (arrays en memoria)
│       ├── models/           # clases del dominio
│       ├── middlewares/      # autenticación (JWT), permisos por rol, errores y rutas inexistentes
│       ├── responses/        # formato común de las respuestas
│       ├── exceptions/       # AppError y sus subclases
│       ├── enums/            # Messages, HttpStatus, ReglasNegocio, TipoEvento, Sector, EstadoReserva, Rol
│       └── utils/            # validadores, fechas y parseo de IDs
├── diagrama-clases.png
└── README.md
```

## API

Todas las rutas empiezan con `/api`. Las rutas protegidas necesitan el header `Authorization: Bearer <token>`, que se obtiene al ingresar o registrarse.

### Autenticación

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| POST | `/auth/registro` | Crea una cuenta de cliente (`nombre`, `apellido`, `email`, `telefono`, `contrasena`) y devuelve `{ token, usuario }` | Público |
| POST | `/auth/login` | Inicia sesión (`email`, `contrasena`) y devuelve `{ token, usuario }` | Público |
| GET | `/auth/perfil` | Datos del usuario de la sesión | Con sesión |

Las contraseñas se guardan encriptadas con bcrypt y el token dura 8 horas.

### Eventos

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/eventos` | Lista los eventos con `lugaresDisponibles` y `personasReservadas` | Público |
| GET | `/eventos/:id` | Obtiene un evento por ID | Público |
| POST | `/eventos` | Crea un evento | Admin |
| PUT | `/eventos/:id` | Modifica un evento (solo los campos enviados) | Admin |
| DELETE | `/eventos/:id` | Elimina un evento sin reservas activas | Admin |

Ejemplo de cuerpo para crear:

```json
{
    "titulo": "Racing vs. Independiente",
    "tipo": "PARTIDO",
    "competencia": "Liga Profesional",
    "fechaHora": "2026-12-20T19:00:00Z",
    "cupo": 70,
    "requiereSenia": true,
    "montoSenia": 4000
}
```

### Reservas

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/reservas/mias` | Reservas del cliente de la sesión | Cliente |
| POST | `/reservas` | Crea una reserva (`eventoId`, `cantidadPersonas`, `observaciones`) | Cliente |
| PUT | `/reservas/:id` | Modifica cantidad de personas u observaciones | Cliente (dueño) |
| GET | `/reservas` | Lista reservas; filtros opcionales `?eventoId=` y `?estado=` | Empleado, Admin |
| GET | `/reservas/:id` | Detalle con evento, mesa, cliente e historial de estados | Dueño, Empleado, Admin |
| PATCH | `/reservas/:id/cancelar` | Cancela (`motivo`, obligatorio para el local) | Cliente (dueño), Empleado, Admin |
| PATCH | `/reservas/:id/senia` | Registra la seña: Pendiente → Confirmada | Empleado, Admin |
| PATCH | `/reservas/:id/mesa` | Asigna una mesa (`mesaId`) | Empleado, Admin |
| PATCH | `/reservas/:id/check-in` | Llegó el cliente: Confirmada → En curso | Empleado, Admin |
| PATCH | `/reservas/:id/finalizar` | En curso → Finalizada | Empleado, Admin |
| PATCH | `/reservas/:id/ausente` | Confirmada → No se presentó | Empleado, Admin |

### Mesas y reportes

| Método | Ruta | Descripción | Acceso |
|---|---|---|---|
| GET | `/mesas` | Mesas activas con su sector y capacidad | Empleado, Admin |
| GET | `/reportes/ocupacion` | Ocupación, cancelaciones y ausencias por evento, ordenado por personas | Admin |

### Reglas de negocio implementadas

| Regla | Dónde se controla |
|---|---|
| RN1: no se reserva más gente que los lugares disponibles | Crear y modificar reserva |
| RN2: una sola reserva activa por cliente y evento | Crear reserva |
| RN3: de 1 a 10 personas por reserva | Crear y modificar reserva |
| RN4: solo eventos futuros; las reservas cierran 1 hora antes | Crear reserva |
| RN5: el cliente modifica o cancela hasta 2 horas antes | Modificar y cancelar reserva |
| RN6: si el evento pide seña, la reserva queda Pendiente; si no, se confirma sola | Crear reserva |
| RN7: la ausencia se marca recién 20 minutos después del inicio | Marcar ausente |
| RN8: con 3 ausencias en 90 días, la reserva queda Pendiente de seña aunque el evento no la pida | Crear reserva |
| RN9: la mesa tiene que alcanzar para el grupo y no puede estar en otra reserva del mismo evento | Asignar mesa |
| RN10: email único por cuenta | Registro |
| RN11: no se elimina un evento con reservas activas ni se baja el cupo debajo de lo reservado | Eliminar y modificar evento |

Los estados avanzan solo por las transiciones del diagrama y cada cambio se guarda en el historial (`CambioEstado`) con fecha, usuario y motivo. El check-in requiere tener una mesa asignada.

**Pendiente para próximas entregas:** la cancelación automática por seña vencida (RN6) y el pase automático a "No se presentó" (RN7) hoy los hace el empleado a mano desde el panel; tampoco están todavía el ABM de mesas, el alta de empleados ni la configuración de horarios. Los datos se pierden al reiniciar porque se guardan en memoria.

Respuesta exitosa: `{ "success": true, "data": { ... } }`. Respuesta con error: `{ "success": false, "message": "El evento no existe." }`.

## Modelo del dominio

![Diagrama de clases](diagrama-clases.png)

| Clase | Qué representa |
|---|---|
| **Usuario** | Persona que usa el sistema. Su `rol` puede ser cliente, empleado o administrador. |
| **Evento** | Partido, show o turno común para el que se puede reservar. Tiene un cupo máximo de personas y puede requerir seña. |
| **Mesa** | Mesa del salón, con su sector (pantalla grande, barra o patio) y su capacidad. |
| **Reserva** | Reserva de un cliente para un evento. Es la entidad principal y recorre el flujo de estados. |
| **CambioEstado** | Historial de los cambios de estado de cada reserva: quién, cuándo y por qué. |

### Relaciones

- Un **Usuario** realiza muchas **Reservas** (1 a 0..*).
- Un **Evento** recibe muchas **Reservas** (1 a 0..*).
- Una **Mesa** se asigna a muchas **Reservas** a lo largo del tiempo; una reserva tiene como máximo una mesa (0..1 a 0..*).
- Una **Reserva** tiene uno o más **CambioEstado** (composición: el historial no existe sin su reserva).

### Flujo de estados de la Reserva

```
Pendiente → Confirmada → En curso → Finalizada
    ↘            ↘ ↘
   Cancelada   Cancelada / No se presentó
```

### Diagrama en Mermaid

```mermaid
classDiagram
    class Usuario {
        -number id
        -string nombre
        -string apellido
        -string email
        -string contrasena
        -string telefono
        -Rol rol
        -Date fechaRegistro
        -boolean activo
        +registrarse() void
        +iniciarSesion(email, contrasena) boolean
        +actualizarDatos(datos) void
        +esAdministrador() boolean
        +contarAusencias(dias) number
    }
    class Evento {
        -number id
        -string titulo
        -TipoEvento tipo
        -string competencia
        -Date fechaHora
        -number cupo
        -boolean requiereSenia
        -number montoSenia
        -boolean destacado
        -boolean activo
        +lugaresDisponibles() number
        +tieneLugarPara(cantidad) boolean
        +estaAbiertoParaReservas() boolean
        +modificarCupo(nuevoCupo) void
        +suspender(motivo) void
    }
    class Mesa {
        -number id
        -number numero
        -Sector sector
        -number capacidad
        -boolean activa
        +puedeAlojar(cantidad) boolean
        +estaLibreEn(evento) boolean
    }
    class Reserva {
        -number id
        -number usuarioId
        -number eventoId
        -number mesaId
        -number cantidadPersonas
        -EstadoReserva estado
        -boolean seniaRegistrada
        -string observaciones
        -string motivoCancelacion
        -Date fechaCreacion
        +confirmar() void
        +registrarSenia() void
        +asignarMesa(mesa) void
        +hacerCheckIn() void
        +finalizar() void
        +cancelar(motivo, usuario) void
        +marcarAusente() void
        +modificarCantidad(cantidad) void
        +puedeModificarse() boolean
    }
    class CambioEstado {
        -number id
        -number reservaId
        -EstadoReserva estadoAnterior
        -EstadoReserva estadoNuevo
        -number usuarioId
        -Date fechaHora
        -string motivo
    }
    Usuario "1" -- "0..*" Reserva : realiza
    Evento "1" -- "0..*" Reserva : es para
    Mesa "0..1" -- "0..*" Reserva : se asigna a
    Reserva "1" *-- "1..*" CambioEstado : historial
```

> Los métodos del diagrama son una guía de lo que se va a implementar más adelante. Por ahora las clases de `Backend/src/models/` solo definen sus atributos; los valores posibles de `tipo`, `sector`, `estado` y `rol` están en `Backend/src/enums/`.
