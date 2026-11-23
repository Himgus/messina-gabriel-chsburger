import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./components/AdminLayout.jsx";
import Layout from "./components/Layout.jsx";
import RutaProtegida from "./components/RutaProtegida.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import AdminEventosPage from "./pages/AdminEventosPage.jsx";
import AdminMenuPage from "./pages/AdminMenuPage.jsx";
import AdminMesasPage from "./pages/AdminMesasPage.jsx";
import AdminUsuariosPage from "./pages/AdminUsuariosPage.jsx";
import ConfiguracionPage from "./pages/ConfiguracionPage.jsx";
import EditarReservaPage from "./pages/EditarReservaPage.jsx";
import EventoDetallePage from "./pages/EventoDetallePage.jsx";
import EventoFormPage from "./pages/EventoFormPage.jsx";
import EventosPage from "./pages/EventosPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import MesaFormPage from "./pages/MesaFormPage.jsx";
import MisReservasPage from "./pages/MisReservasPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PanelReservasPage from "./pages/PanelReservasPage.jsx";
import PerfilPage from "./pages/PerfilPage.jsx";
import ProductoFormPage from "./pages/ProductoFormPage.jsx";
import RegistroPage from "./pages/RegistroPage.jsx";
import ReportesPage from "./pages/ReportesPage.jsx";
import UsuarioDetallePage from "./pages/UsuarioDetallePage.jsx";
import UsuarioFormPage from "./pages/UsuarioFormPage.jsx";
import { Rol, ROLES_PERSONAL } from "./utils/constantes.js";
export default function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <AuthProvider>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route index element={<HomePage />} />
                            <Route path="menu" element={<MenuPage />} />
                            <Route path="eventos" element={<EventosPage />} />
                            <Route path="eventos/:id" element={<EventoDetallePage />} />
                            <Route path="ingresar" element={<LoginPage />} />
                            <Route path="registro" element={<RegistroPage />} />
                            <Route element={<RutaProtegida />}>
                                <Route path="perfil" element={<PerfilPage />} />
                            </Route>
                            <Route element={<RutaProtegida roles={[Rol.CLIENTE]} />}>
                                <Route path="mis-reservas" element={<MisReservasPage />} />
                                <Route path="mis-reservas/:id/editar" element={<EditarReservaPage />} />
                            </Route>
                            <Route element={<RutaProtegida roles={ROLES_PERSONAL} />}>
                                <Route path="panel/reservas" element={<PanelReservasPage />} />
                            </Route>
                            <Route path="admin" element={<RutaProtegida roles={[Rol.ADMINISTRADOR]} />}>
                                <Route element={<AdminLayout />}>
                                    <Route index element={<Navigate to="eventos" replace />} />
                                    <Route path="eventos" element={<AdminEventosPage />} />
                                    <Route path="eventos/nuevo" element={<EventoFormPage key="nuevo" />} />
                                    <Route path="eventos/:id/editar" element={<EventoFormPage key="editar" />} />
                                    <Route path="menu" element={<AdminMenuPage />} />
                                    <Route path="menu/nuevo" element={<ProductoFormPage key="nuevo" />} />
                                    <Route path="menu/:id/editar" element={<ProductoFormPage key="editar" />} />
                                    <Route path="mesas" element={<AdminMesasPage />} />
                                    <Route path="mesas/nueva" element={<MesaFormPage key="nueva" />} />
                                    <Route path="mesas/:id/editar" element={<MesaFormPage key="editar" />} />
                                    <Route path="usuarios" element={<AdminUsuariosPage />} />
                                    <Route path="usuarios/nuevo" element={<UsuarioFormPage />} />
                                    <Route path="usuarios/:id" element={<UsuarioDetallePage />} />
                                    <Route path="reportes" element={<ReportesPage />} />
                                    <Route path="configuracion" element={<ConfiguracionPage />} />
                                </Route>
                            </Route>
                            <Route path="*" element={<NotFoundPage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </ToastProvider>
        </BrowserRouter>
    );
}
