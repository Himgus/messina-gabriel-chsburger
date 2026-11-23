import Producto from "../models/Producto.js";
import { CategoriaProducto } from "../enums/CategoriaProducto.js";
const RUTA_IMAGENES = "/imagenes/menu";
const imagen = (archivo) => `${RUTA_IMAGENES}/${archivo}`;
const adicional = (nombre, precio) => ({ nombre, precio, adicional: true });
const variante = (nombre, precio) => ({ nombre, precio, adicional: false });
const OPCIONES_BURGER = [adicional("Agrandá tu combo", 5000), adicional("Doble", 3000), adicional("Triple", 5000)];
const OPCIONES_LINEA_DOBLE = [adicional("Agrandá tu combo", 5000), adicional("Triple", 3000)];
const OPCIONES_COMBO = [adicional("Doble", 3000), adicional("Triple", 5000)];
const { BURGER, LINEA_DOBLE, COMBO, BALDAZO, ENTRADA, BEBIDA } = CategoriaProducto;
const productos = [
    new Producto(1, "Quick", BURGER, "Carne · Cheddar", 13900, imagen("quick.png"), OPCIONES_BURGER, false, true),
    new Producto(2, "Cheezy", BURGER, "Carne · Cheddar · Panceta", 15900, imagen("Cheezy.png"), OPCIONES_BURGER, false, true),
    new Producto(3, "Cheezy Reloaded", BURGER, "Carne · Cheddar · Panceta · Huevo · Tomate · Lechuga", 17900, imagen("CheezyReloaded.png"), OPCIONES_BURGER, false, true),
    new Producto(4, "Blue Tasty", BURGER, "Carne · Queso azul · Muzza · Cebolla caramelizada · Tomate · Lechuga", 17900, imagen("BlueTasty.png"), OPCIONES_BURGER, false, true),
    new Producto(5, "Nice Selection", BURGER, "Carne · Muzza · Cebolla caramelizada · Champiñones", 17900, imagen("NiceSelection.png"), OPCIONES_BURGER, false, true),
    new Producto(6, "Onion Top", BURGER, "Carne · Cheddar · Lomo · Cebolla caramelizada · Aros de cebolla", 17900, imagen("OnionTop.png"), OPCIONES_BURGER, false, true),
    new Producto(7, "Chicken Norrys", BURGER, "Pollo crispy · Cheddar · Panceta · BBQ · Pickles · Papas pay", 19900, imagen("ChickenNorrys.png"), OPCIONES_BURGER, false, true),
    new Producto(8, "Deli Pork", BURGER, "Bondiola · Coleslaw · BBQ · Pickles", 19900, imagen("DeliPork.png"), OPCIONES_BURGER, false, true),
    new Producto(9, "Veggie Style", BURGER, "Medallón veggie · Cheddar · Cebolla caramelizada · Tomate · Lechuga", 17900, imagen("VeggieStyle.png"), OPCIONES_BURGER, false, true),
    new Producto(10, "Tropicana", LINEA_DOBLE, "Carne · Chuleta · Plátano maduro · Queso llanero frito", 20500, imagen("Tropicana.png"), OPCIONES_LINEA_DOBLE, true, true),
    new Producto(11, "Crispy Rain", LINEA_DOBLE, "Doble carne de 130 g · Cheddar · Panceta · BBQ · Cebolla crispy", 20500, imagen("CrispyRain.png"), OPCIONES_LINEA_DOBLE, false, true),
    new Producto(12, "Combo Día", COMBO, "Cheese burger + papas o gaseosa", 7500, imagen("ComboDia.png"), [], false, true),
    new Producto(13, "Hazla Doble", COMBO, "Cheese burger doble + papas o gaseosa", 10000, imagen("HazlaDoble.png"), [], true, true),
    new Producto(14, "Combo Completo", COMBO, "Cheese burger doble + papas y gaseosa", 12500, imagen("ComboCompleto.png"), [], false, true),
    new Producto(15, "Combo 4", COMBO, "4 burgers a elegir del menú clásico + papas + gaseosa de 1,5 L", 70000, imagen("Combo4.png"), OPCIONES_COMBO, false, true),
    new Producto(16, "Combo Duo", COMBO, "2 burgers a elegir del menú clásico + papas + 2 gaseosas de lata", 38000, imagen("ComboDuo.png"), OPCIONES_COMBO, false, true),
    new Producto(17, "Combo Quick", COMBO, "3 Quick burgers + papas + gaseosa de 1,5 L", 42000, imagen("ComboQuick.png"), OPCIONES_COMBO, false, true),
    new Producto(18, "Megabaldazo", BALDAZO, "8 cheese burgers + 400 g de papas + gaseosa de 1,5 L, servido en el balde", 54000, imagen("Megabaldazo.png"), [
        variante("Con panceta", 59000),
        variante("Con panceta y balde de plástico", 62000)
    ], true, true),
    new Producto(19, "Megabaldazo Lite", BALDAZO, "4 cheese burgers + 400 g de papas + gaseosa de 1,5 L", 30000, imagen("MegabaldazoLite.png"), [
        variante("Con panceta", 33000),
        variante("Con panceta y balde de plástico", 35000)
    ], true, true),
    new Producto(20, "Baldazo Mundial", BALDAZO, "4 cheese burgers + 500 g de papas + 4 tequeños + 8 nuggets de pollo + 4 croquetas de cerdo + gaseosa de 1,5 L + balde coleccionable + paquete de figuritas Panini", 60000, imagen("BaldazoMundial.png"), [], false, true),
    new Producto(21, "Rueda de Tractor", BALDAZO, "700 g de carne · Cheddar · Panceta · Huevo · Papas pay · Lechuga · Tomate · Salsa CH · Salsa de ajo + 500 g de papas fritas + gaseosa de 1,5 L", 70000, imagen("RuedaDeTractor.png"), [
        variante("Sin papas y sin gaseosa", 60000)
    ], false, true),
    new Producto(22, "Tequeños", ENTRADA, "6 tequeños + salsa CH", 13000, imagen("Tequenios.png"), [variante("Docena", 26000)], false, true),
    new Producto(23, "Tenders de Pollo", ENTRADA, "6 piezas + salsa BBQ", 13000, imagen("TendersDePollo.png"), [adicional("Extra de papas", 6500)], false, true),
    new Producto(24, "Ribs de Cerdo", ENTRADA, "1 ración individual + salsa BBQ", 15000, imagen("RibsDeCerdo.png"), [adicional("Extra de papas", 6500)], false, true),
    new Producto(25, "Gaseosa lata", BEBIDA, "", 3000, null, [], false, true),
    new Producto(26, "Gaseosa 1,5 L", BEBIDA, "", 6000, null, [], false, true),
    new Producto(27, "Agua", BEBIDA, "", 3000, null, [], false, true),
    new Producto(28, "Cerveza nacional", BEBIDA, "", 5000, null, [], false, true),
    new Producto(29, "Cerveza artesanal", BEBIDA, "", 5000, null, [], false, true),
    new Producto(30, "Papelón con limón 1,5 L", BEBIDA, "", 6500, null, [], false, true),
    new Producto(31, "Té helado / Papelón 500 ml", BEBIDA, "", 4500, null, [], false, true)
];
let ultimoId = productos.length;
class ProductoRepository {
    findAll() {
        return productos;
    }
    findById(id) {
        return productos.find((producto) => producto.id === id) ?? null;
    }
    findByNombre(nombre) {
        return productos.find((producto) => producto.nombre.toLowerCase() === nombre.toLowerCase()) ?? null;
    }
    create(datos) {
        ultimoId++;
        const producto = new Producto(
            ultimoId,
            datos.nombre,
            datos.categoria,
            datos.descripcion,
            datos.precio,
            datos.imagen,
            datos.opciones,
            datos.destacado,
            datos.disponible
        );
        productos.push(producto);
        return producto;
    }
    update(id, datos) {
        const producto = this.findById(id);
        if (!producto) {
            return null;
        }
        Object.assign(producto, datos, { id });
        return producto;
    }
    delete(id) {
        const indice = productos.findIndex((producto) => producto.id === id);
        if (indice === -1) {
            return null;
        }
        const [eliminado] = productos.splice(indice, 1);
        return eliminado;
    }
}
export default new ProductoRepository();
