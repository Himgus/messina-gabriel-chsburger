# CHS Burger: sistema de reservas

Sistema de reservas de mesas para partidos y eventos de **CHS Burger**.

Los clientes consultan la agenda de partidos y eventos del local, reservan una mesa y siguen el estado de su reserva. Los empleados registran señas, asignan mesas y hacen el check-in. El administrador carga los eventos y consulta reportes de ocupación.

> Estado actual: estructura inicial y modelo del dominio. Todavía no hay funcionalidades implementadas.

## Estructura del repositorio

```
├── Frontend/                 # interfaz web (todavía vacía)
├── Backend/
│   ├── package.json          # "type": "module" para usar import / export
│   └── src/
│       └── models/           # clases del dominio
│           ├── Usuario.js
│           ├── Evento.js
│           ├── Mesa.js
│           ├── Reserva.js
│           └── CambioEstado.js
├── diagrama-clases.png
└── README.md
```

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

> Los métodos del diagrama son una guía de lo que se va a implementar más adelante. Por ahora las clases de `Backend/src/models/` solo definen sus atributos.
