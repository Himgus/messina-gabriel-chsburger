import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
export default function Layout() {
    const { pathname, hash } = useLocation();
    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView();
            return;
        }
        window.scrollTo(0, 0);
    }, [pathname, hash]);
    return (
        <>
            <a href="#contenido" className="saltar-contenido">Saltar al contenido principal</a>
            <Navbar />
            <main id="contenido" tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
