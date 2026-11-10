import Icono from "./Icono.jsx";
import "./ListaDatos.css";
export default function ListaDatos({ items, variante = "normal" }) {
    return (
        <dl className={`lista-datos lista-datos--${variante}`}>
            {items.map((item) => (
                <div key={item.etiqueta} className="lista-datos__item">
                    <dt className="lista-datos__etiqueta">
                        <Icono nombre={item.icono} tamanio={18} />
                        {item.etiqueta}
                    </dt>
                    <dd className="lista-datos__valor">{item.valor}</dd>
                </div>
            ))}
        </dl>
    );
}
