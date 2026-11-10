import { request } from "./api.js";
export function getReporteOcupacion() {
    return request("/reportes/ocupacion");
}
