import { useEffect, useState } from "react";
import Button from "./Button.jsx";
import CheckboxField from "./CheckboxField.jsx";
import FormField from "./FormField.jsx";
import { useFormulario } from "../hooks/useFormulario.js";
import { urlArchivo } from "../services/api.js";
import { CATEGORIAS_MENU, LIMITES_PRODUCTO, TIPOS_IMAGEN } from "../utils/constantes.js";
import { formularioAProducto, nuevaOpcion, validarArchivoImagen, validarProducto } from "../utils/validarProducto.js";
import "./ProductoForm.css";
const OPCIONES_CATEGORIA = CATEGORIAS_MENU.map(({ valor, etiqueta }) => ({ valor, etiqueta }));
const OPCIONES_TIPO = [
    { valor: "adicional", etiqueta: "Adicional (+)" },
    { valor: "final", etiqueta: "Precio final" }
];
function SelectorImagen({ imagenActual, archivo, error, onElegir, onQuitar }) {
    const [vistaPrevia, setVistaPrevia] = useState(null);
    useEffect(() => {
        if (!archivo) {
            setVistaPrevia(null);
            return undefined;
        }
        const url = URL.createObjectURL(archivo);
        setVistaPrevia(url);
        return () => URL.revokeObjectURL(url);
    }, [archivo]);
    const imagen = vistaPrevia ?? urlArchivo(imagenActual);
    return (
        <div className="producto-form__imagen">
            <div className="producto-form__vista" aria-live="polite">
                {imagen ? <img src={imagen} alt="Vista previa de la imagen del producto" /> : <span>Sin imagen</span>}
            </div>
            <div className="producto-form__imagen-controles">
                <FormField
                    type="file"
                    label="Imagen"
                    name="imagen"
                    accept={TIPOS_IMAGEN.join(",")}
                    onChange={(evento) => {
                        onElegir(evento.target.files[0] ?? null);
                        evento.target.value = "";
                    }}
                    error={error}
                    ayuda={`PNG, JPG o WEBP de hasta ${LIMITES_PRODUCTO.IMAGEN_MAX_MB} MB. Mejor con fondo transparente.`}
                />
                {imagen && (
                    <Button variante="peligro" tamanio="chico" onClick={onQuitar}>Quitar imagen</Button>
                )}
            </div>
        </div>
    );
}
export default function ProductoForm({ producto, valoresIniciales, opcionesIniciales, textoBoton, onSubmit, onCancelar }) {
    const [opciones, setOpciones] = useState(opcionesIniciales);
    const [imagenActual, setImagenActual] = useState(producto?.imagen ?? null);
    const [archivo, setArchivo] = useState(null);
    const [errorImagen, setErrorImagen] = useState(undefined);
    const { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit } = useFormulario({
        valoresIniciales,
        validar: (valoresActuales) => validarProducto(valoresActuales, opciones),
        onSubmit: (valoresActuales) => onSubmit(formularioAProducto(valoresActuales, opciones, imagenActual), archivo)
    });
    const elegirArchivo = (elegido) => {
        if (!elegido) {
            return;
        }
        const error = validarArchivoImagen(elegido);
        setErrorImagen(error);
        if (!error) {
            setArchivo(elegido);
        }
    };
    const quitarImagen = () => {
        setArchivo(null);
        setImagenActual(null);
        setErrorImagen(undefined);
    };
    const cambiarOpcion = (indice, campo, valor) => {
        setOpciones((actuales) => actuales.map((opcion, posicion) => (posicion === indice ? { ...opcion, [campo]: valor } : opcion)));
    };
    return (
        <form ref={formulario} className="formulario" onSubmit={handleSubmit} noValidate>
            <p className="formulario__aviso">
                Los campos marcados con <span aria-hidden="true">*</span> son obligatorios.
            </p>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Producto</legend>
                <div className="formulario__fila">
                    <FormField
                        label="Nombre"
                        name="nombre"
                        value={valores.nombre}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.nombre}
                        maxLength={LIMITES_PRODUCTO.NOMBRE_MAX}
                        placeholder="Ej.: Cheezy"
                        requerido
                    />
                    <FormField
                        as="select"
                        label="Categoría"
                        name="categoria"
                        value={valores.categoria}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errores.categoria}
                        opciones={OPCIONES_CATEGORIA}
                        requerido
                    />
                </div>
                <FormField
                    as="textarea"
                    label="Descripción"
                    name="descripcion"
                    value={valores.descripcion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errores.descripcion}
                    maxLength={LIMITES_PRODUCTO.DESCRIPCION_MAX}
                    placeholder="Ej.: Carne · Cheddar · Panceta"
                    ayuda="Ingredientes o qué incluye. Opcional para bebidas."
                />
                <FormField
                    type="number"
                    label="Precio ($)"
                    name="precio"
                    value={valores.precio}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errores.precio}
                    min="1"
                    max={LIMITES_PRODUCTO.PRECIO_MAX}
                    step="1"
                    inputMode="numeric"
                    requerido
                />
                <SelectorImagen
                    imagenActual={imagenActual}
                    archivo={archivo}
                    error={errorImagen}
                    onElegir={elegirArchivo}
                    onQuitar={quitarImagen}
                />
            </fieldset>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Opciones y adicionales</legend>
                <p className="formulario__aviso">
                    Ej.: "Doble" como adicional de + $3.000, o "Con panceta" con precio final de $59.000.
                </p>
                {opciones.length > 0 && (
                    <ul className="producto-form__opciones" role="list">
                        {opciones.map((opcion, indice) => (
                            <li key={opcion.clave} className="producto-form__opcion">
                                <FormField
                                    label={<>Opción {indice + 1}</>}
                                    name={`opcion-nombre-${indice}`}
                                    value={opcion.nombre}
                                    onChange={(evento) => cambiarOpcion(indice, "nombre", evento.target.value)}
                                    error={errores[`opcion-nombre-${indice}`]}
                                    maxLength={LIMITES_PRODUCTO.NOMBRE_MAX}
                                    requerido
                                />
                                <FormField
                                    type="number"
                                    label={<>Precio<span className="visualmente-oculto"> de la opción {indice + 1}</span></>}
                                    name={`opcion-precio-${indice}`}
                                    value={opcion.precio}
                                    onChange={(evento) => cambiarOpcion(indice, "precio", evento.target.value)}
                                    error={errores[`opcion-precio-${indice}`]}
                                    min="1"
                                    inputMode="numeric"
                                    requerido
                                />
                                <FormField
                                    as="select"
                                    label={<>Tipo<span className="visualmente-oculto"> de la opción {indice + 1}</span></>}
                                    name={`opcion-tipo-${indice}`}
                                    value={opcion.adicional ? "adicional" : "final"}
                                    onChange={(evento) => cambiarOpcion(indice, "adicional", evento.target.value === "adicional")}
                                    opciones={OPCIONES_TIPO}
                                />
                                <Button
                                    variante="peligro"
                                    tamanio="chico"
                                    className="producto-form__quitar"
                                    onClick={() => setOpciones((actuales) => actuales.filter((_, posicion) => posicion !== indice))}
                                >
                                    Quitar<span className="visualmente-oculto"> opción {indice + 1}</span>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
                <div>
                    <Button
                        variante="secundario"
                        tamanio="chico"
                        disabled={opciones.length >= LIMITES_PRODUCTO.OPCIONES_MAX}
                        onClick={() => setOpciones((actuales) => [...actuales, nuevaOpcion()])}
                    >
                        + Agregar opción
                    </Button>
                </div>
            </fieldset>
            <fieldset className="formulario__grupo">
                <legend className="formulario__leyenda">Visibilidad</legend>
                <CheckboxField
                    label="Disponible"
                    name="disponible"
                    checked={valores.disponible}
                    onChange={handleChange}
                    ayuda="Desmarcalo si está agotado: se sigue viendo en el menú con la etiqueta Agotado."
                />
                <CheckboxField
                    label="Destacar en la portada"
                    name="destacado"
                    checked={valores.destacado}
                    onChange={handleChange}
                    ayuda={`Aparece en "Productos estrella" de la página de inicio (máximo ${LIMITES_PRODUCTO.DESTACADOS_MAX}).`}
                />
            </fieldset>
            <div className="formulario__acciones">
                <Button variante="secundario" onClick={onCancelar} disabled={enviando}>Cancelar</Button>
                <Button type="submit" variante="accion" cargando={enviando}>
                    {enviando ? "Guardando…" : textoBoton}
                </Button>
            </div>
        </form>
    );
}
