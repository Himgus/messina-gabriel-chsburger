const TRAZOS = {
    calendario: (
        <>
            <rect x="3" y="5" width="18" height="16" rx="2" />
            <path d="M3 10h18M8 3v4M16 3v4" />
        </>
    ),
    reloj: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    personas: (
        <>
            <circle cx="9" cy="8" r="3.5" />
            <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
            <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6.5 6.5 0 0 1 3.5 6" />
        </>
    ),
    dinero: (
        <>
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <circle cx="12" cy="12" r="2.5" />
            <path d="M6 9v6M18 9v6" />
        </>
    ),
    trofeo: (
        <>
            <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
            <path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M9 18h6" />
        </>
    ),
    ubicacion: (
        <>
            <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
        </>
    ),
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    cerrar: <path d="M6 6l12 12M18 6L6 18" />,
    check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
    alerta: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7.5v5.5M12 16.5v.5" />
        </>
    ),
    flecha: <path d="M19 12H5M11 6l-6 6 6 6" />,
    instagram: (
        <>
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <path d="M17.5 6.5v.01" />
        </>
    ),
    facebook: <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v4H8v7h4v-7h3l.5-4H12V8a1 1 0 0 1 1-1h2z" />,
    whatsapp: (
        <>
            <path d="M3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 8 19.2z" />
            <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1a4.5 4.5 0 0 1-2-2l1-1-1-2z" />
        </>
    ),
    linktree: <path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9" />
};
export default function Icono({ nombre, tamanio = 20, className = "" }) {
    return (
        <svg
            className={className}
            width={tamanio}
            height={tamanio}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {TRAZOS[nombre]}
        </svg>
    );
}
