import ListaDatos from "./ListaDatos.jsx";
import { formatearFecha, formatearHora, formatearMoneda } from "../utils/formatters.js";
export default function EventoDatos({ evento, variante = "normal" }) {
    const items = [
        { icono: "calendario", etiqueta: "Fecha", valor: formatearFecha(evento.fechaHora) },
        { icono: "reloj", etiqueta: "Hora", valor: formatearHora(evento.fechaHora) },
        {
            icono: "personas",
            etiqueta: "Lugares",
            valor: evento.lugaresDisponibles !== undefined
                ? `${evento.lugaresDisponibles} de ${evento.cupo} libres`
                : `${evento.cupo} personas`
        },
        {
            icono: "dinero",
            etiqueta: "Seña",
            valor: evento.requiereSenia ? formatearMoneda(evento.montoSenia) : "Sin seña"
        }
    ];
    return <ListaDatos items={items} variante={variante} />;
}
