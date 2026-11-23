import { useMemo } from "react";
import Button from "../components/Button.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import ListaPrecios from "../components/ListaPrecios.jsx";
import Loader from "../components/Loader.jsx";
import MensajeEstado from "../components/MensajeEstado.jsx";
import ProductoCard from "../components/ProductoCard.jsx";
import { useRecurso } from "../hooks/useRecurso.js";
import { useTituloPagina } from "../hooks/useTituloPagina.js";
import { getProductos } from "../services/productoService.js";
import { DELIVERY } from "../data/negocio.js";
import { CATEGORIAS_MENU, CategoriaProducto } from "../utils/constantes.js";
import "./MenuPage.css";
function CategoriaMenu({ categoria, productos }) {
    const idTitulo = `menu-${categoria.ancla}`;
    return (
        <section id={categoria.ancla} className="menu__categoria" aria-labelledby={idTitulo}>
            <header className="menu__categoria-encabezado">
                <h2 id={idTitulo} className="menu__categoria-titulo">{categoria.etiqueta}</h2>
                {categoria.descripcion && <p className="menu__categoria-descripcion">{categoria.descripcion}</p>}
            </header>
            {categoria.valor === CategoriaProducto.BEBIDA ? (
                <ListaPrecios productos={productos} />
            ) : (
                <ul className="menu__grilla" role="list">
                    {productos.map((producto) => (
                        <li key={producto.id}>
                            <ProductoCard producto={producto} />
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}
export default function MenuPage() {
    useTituloPagina("Menú");
    const { datos, cargando, error, recargar } = useRecurso(getProductos);
    const categorias = useMemo(() => CATEGORIAS_MENU
        .map((categoria) => ({ categoria, productos: (datos ?? []).filter((producto) => producto.categoria === categoria.valor) }))
        .filter(({ productos }) => productos.length > 0), [datos]);
    return (
        <div className="contenedor pagina">
            <EncabezadoPagina
                titulo="Menú"
                descripcion="Nuestras carnes son rosas porque son ahumadas. Todas las burgers vienen con salsa CHS y papas chicas de 80 g."
            />
            {cargando && <Loader mensaje="Cargando el menú…" />}
            {!cargando && error && (
                <MensajeEstado
                    tipo="error"
                    titulo="No pudimos cargar el menú"
                    accion={<Button variante="secundario" onClick={recargar}>Reintentar</Button>}
                >
                    <p>{error}</p>
                </MensajeEstado>
            )}
            {!cargando && !error && categorias.length === 0 && (
                <MensajeEstado titulo="El menú está vacío">
                    <p>Todavía no cargamos productos. Volvé a pasar en un rato.</p>
                </MensajeEstado>
            )}
            {!cargando && !error && categorias.length > 0 && (
                <>
                    <nav className="menu__indice" aria-label="Categorías del menú">
                        <ul role="list">
                            {categorias.map(({ categoria }) => (
                                <li key={categoria.valor}>
                                    <a href={`#${categoria.ancla}`} className="menu__indice-enlace">{categoria.etiqueta}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    {categorias.map(({ categoria, productos }) => (
                        <CategoriaMenu key={categoria.valor} categoria={categoria} productos={productos} />
                    ))}
                    <aside className="menu__delivery" aria-label="Pedidos por delivery">
                        <p className="menu__delivery-titulo">¿Preferís comer en casa?</p>
                        <div className="menu__delivery-botones">
                            {DELIVERY.map((app) => (
                                <Button key={app.nombre} href={app.url} variante="principal" target="_blank" rel="noreferrer">
                                    Pedí por {app.nombre}
                                    <span className="visualmente-oculto"> (se abre en una pestaña nueva)</span>
                                </Button>
                            ))}
                        </div>
                    </aside>
                </>
            )}
        </div>
    );
}
