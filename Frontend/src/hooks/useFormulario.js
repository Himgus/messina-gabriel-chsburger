import { useRef, useState } from "react";
import { useToast } from "./useToast.js";
const filtrarTocados = (errores, tocados) => Object.fromEntries(
    Object.entries(errores).filter(([campo]) => tocados[campo])
);
export function useFormulario({ valoresIniciales, validar, onSubmit }) {
    const [valores, setValores] = useState(valoresIniciales);
    const [errores, setErrores] = useState({});
    const [tocados, setTocados] = useState({});
    const [enviando, setEnviando] = useState(false);
    const formulario = useRef(null);
    const { mostrarError } = useToast();
    const handleChange = (evento) => {
        const { name, type, value, checked } = evento.target;
        const nuevosValores = { ...valores, [name]: type === "checkbox" ? checked : value };
        setValores(nuevosValores);
        setErrores(filtrarTocados(validar(nuevosValores), tocados));
    };
    const handleBlur = (evento) => {
        const nuevosTocados = { ...tocados, [evento.target.name]: true };
        setTocados(nuevosTocados);
        setErrores(filtrarTocados(validar(valores), nuevosTocados));
    };
    const handleSubmit = async (evento) => {
        evento.preventDefault();
        const resultado = validar(valores);
        setTocados(Object.fromEntries(Object.keys(valores).map((campo) => [campo, true])));
        setErrores(resultado);
        const primerCampoConError = Array.from(formulario.current.elements)
            .find((elemento) => elemento.name && resultado[elemento.name]);
        if (primerCampoConError) {
            primerCampoConError.focus();
            mostrarError("Revisá los campos marcados antes de continuar.");
            return;
        }
        setEnviando(true);
        try {
            await onSubmit(valores);
        } finally {
            setEnviando(false);
        }
    };
    return { valores, errores, enviando, formulario, handleChange, handleBlur, handleSubmit };
}
