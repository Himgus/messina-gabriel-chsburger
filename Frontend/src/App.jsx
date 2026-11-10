import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import AdminEventosPage from "./pages/AdminEventosPage.jsx";
import EditarReservaPage from "./pages/EditarReservaPage.jsx";
import EventoDetallePage from "./pages/EventoDetallePage.jsx";
import EventoFormPage from "./pages/EventoFormPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MisReservasPage from "./pages/MisReservasPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PanelReservasPage from "./pages/PanelReservasPage.jsx";
import RegistroPage from "./pages/RegistroPage.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import { Rol, ROLES_PERSONAL } from "./utils/constantes.js";
export default function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="eventos/:id" element={<EventoDetallePage />} />
                            <Route path="ingresar" element={<LoginPage />} />
                            <Route path="registro" element={<RegistroPage />} />
                            <Route element={<RutaProtegida roles={[Rol.CLIENTE]} />}>
                                <Route path="mis-reservas" element={<MisReservasPage />} />
                                <Route path="mis-reservas/:id/editar" element={<EditarReservaPage />} />
                            </Route>
                            <Route element={<RutaProtegida roles={ROLES_PERSONAL} />}>
                                <Route path="panel/reservas" element={<PanelReservasPage />} />
                            </Route>
                            <Route element={<RutaProtegida roles={[Rol.ADMINISTRADOR]} />}>
                                <Route path="admin/eventos" element={<AdminEventosPage />} />
                                <Route path="admin/eventos/nuevo" element={<EventoFormPage key="nuevo" />} />
                                <Route path="admin/eventos/:id/editar" element={<EventoFormPage key="editar" />} />
                                <Route path="admin/reportes" element={<ReportesPage />} />
                            </Route>
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}
