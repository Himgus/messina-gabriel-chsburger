import reservaService from "../services/ReservaService.js";
const INTERVALO = 60 * 1000;
const ejecutar = () => {
    const { seniasVencidas, ausencias } = reservaService.procesarVencimientos();
    if (seniasVencidas > 0 || ausencias > 0) {
        console.log(`Vencimientos procesados: ${seniasVencidas} reservas canceladas por seña vencida, ${ausencias} ausencias.`);
    }
};
export const iniciarProcesoDeVencimientos = () => {
    ejecutar();
    return setInterval(ejecutar, INTERVALO);
};
