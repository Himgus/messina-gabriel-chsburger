import Configuracion from "../models/Configuracion.js";
const configuracion = new Configuracion(200, [
    { dias: "Lunes a jueves", horario: "12 a 23 h" },
    { dias: "Viernes a domingo", horario: "12 a 24 h" }
]);
class ConfiguracionRepository {
    get() {
        return configuracion;
    }
    update(datos) {
        Object.assign(configuracion, datos);
        return configuracion;
    }
}
export default new ConfiguracionRepository();
