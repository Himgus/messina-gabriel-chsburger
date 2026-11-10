import "./Seccion.css";
export default function Seccion({ id, titulo, subtitulo, variante = "clara", children }) {
    const idTitulo = `${id}-titulo`;
    return (
        <section id={id} className={`seccion seccion--${variante}`} aria-labelledby={idTitulo}>
            <div className="contenedor">
                <header className="seccion__encabezado">
                    <h2 id={idTitulo} className="seccion__titulo">{titulo}</h2>
                    {subtitulo && <p className="seccion__subtitulo">{subtitulo}</p>}
                </header>
                {children}
            </div>
        </section>
    );
}
