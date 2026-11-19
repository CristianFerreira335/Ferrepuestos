
import { useState, useEffect } from "react";
import "./App.css";


function App() {
  
 // Estados
const [busqueda, setBusqueda] = useState("");
const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

// Productos recibidos desde MongoDB
const [productos, setProductos] = useState([]);

// Estado de carga
const [cargando, setCargando] = useState(true);

// Estado de error
const [error, setError] = useState("");

// Obtener productos desde MongoDB
useEffect(() => {

  fetch("http://localhost:5000/api/productos")

    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("No se pudieron obtener los productos");
      }

      return respuesta.json();
    })

    .then((datos) => {

      // Adaptar los productos recibidos
      const productosAdaptados = datos.map((producto) => ({
        ...producto,
        id: producto._id,

        // Agregar un icono según el nombre
        icono:
          producto.nombre === "Filtro de aceite" ? "🛢️" :
          producto.nombre === "Rodamiento industrial" ? "⚙️" :
          producto.nombre === "Grasa lubricante" ? "🧴" :
          producto.nombre === "Correa de motor" ? "🔧" :
          producto.nombre === "Filtro de combustible" ? "🔩" :
          producto.nombre === "Refrigerante" ? "💧" : "📦"
      }));

      setProductos(productosAdaptados);
      setCargando(false);

    })

    .catch((error) => {
      console.log("Error:", error);
      setError("No se pudieron cargar los productos.");
      setCargando(false);
    });

}, []);

  // Recuperar el carrito guardado
  const [carrito, setCarrito] = useState(() => {
    try {
      const carritoGuardado = localStorage.getItem("carrito");

      return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    } catch (error) {
      return [];
    }
  });

  // Guardar el carrito cuando cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);



  // Filtrar productos
  const productosFiltrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoriaSeleccionada === "Todas" ||
      producto.categoria === categoriaSeleccionada;

    return coincideNombre && coincideCategoria;
  });

  // Consultar un producto por WhatsApp
  function consultarWhatsApp(producto) {
    const telefono = "59892946141";

    const mensaje =
      `Hola, estoy interesado en ${producto.nombre}. ¿Tienen disponibilidad?`;

    const enlace =
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(enlace, "_blank");
  }

  // Agregar productos al carrito
  function agregarAlCarrito(producto) {
    setCarrito((carritoActual) => {
      const productoExiste = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (productoExiste) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [
        ...carritoActual,
        { ...producto, cantidad: 1 }
      ];
    });
  }

  // Cambiar cantidad
  function cambiarCantidad(id, cambio) {
    setCarrito((carritoActual) =>
      carritoActual
        .map((item) =>
          item.id === id
            ? { ...item, cantidad: item.cantidad + cambio }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  // Eliminar productos
  function eliminarDelCarrito(id) {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== id)
    );
  }

  // Calcular total
  const totalCarrito = carrito.reduce(
    (total, item) => total + item.precio * item.cantidad,
    0
  );

  // Enviar pedido por WhatsApp
  function enviarPedido() {
    if (carrito.length === 0) {
      return;
    }

    const telefono = "59892946141";

    let mensaje = "Hola, quiero realizar el siguiente pedido:\n\n";

    carrito.forEach((item) => {
      mensaje += `${item.nombre} x ${item.cantidad} - $${item.precio * item.cantidad}\n`;
    });

    mensaje += `\nTotal: $${totalCarrito.toLocaleString("es-UY")}`;
    mensaje += "\n\nQuedo a la espera de la confirmación. ¡Gracias!";

    const enlace =
      `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

    window.open(enlace, "_blank");
  }

  return (
    <div className="pagina">

      {/* ENCABEZADO */}
      <header className="navbar">

        <a href="#" className="logo">
          Fer<span>Repuestos</span>
        </a>

        <nav>
          <a href="#inicio">Inicio</a>
          <a href="#categorias">Categorías</a>
          <a href="#productos">Productos</a>
          <a href="#carrito">Carrito</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <a href="#productos" className="boton-nav">
          Ver catálogo
        </a>

      </header>

      <main>

        {/* PORTADA */}
        <section className="hero" id="inicio">

          <div className="hero-contenido">

            <span className="etiqueta">
              REPUESTOS PARA AUTOS Y EL CAMPO
            </span>

            <h1>
              Todo lo que necesitas
              <br />
              para seguir en marcha.
            </h1>

            <p>
              Encontrá repuestos, accesorios y productos
              para vehículos y maquinaria agropecuaria.
            </p>

            <a href="#productos" className="boton-principal">
              Explorar productos →
            </a>

          </div>

          <div className="hero-imagen">
            <span>🚜</span>
            <span>🚗</span>
            <p>Soluciones para el camino y el campo</p>
          </div>

        </section>

        {/* CATEGORÍAS */}
        <section className="categorias" id="categorias">

          <div className="titulo-seccion">
            <span>EXPLORÁ NUESTRAS CATEGORÍAS</span>
            <h2>¿Qué estás buscando?</h2>
            <p>
              Encontrá los repuestos que necesitás
              para tu vehículo o maquinaria.
            </p>
          </div>

          <div className="categorias-grid">

            <div className="categoria-card">
              <span>🚗</span>
              <h3>Automóviles</h3>
              <p>Repuestos para autos y camionetas.</p>
            </div>

            <div className="categoria-card">
              <span>🚜</span>
              <h3>Maquinaria agrícola</h3>
              <p>Componentes para tractores y maquinaria.</p>
            </div>

            <div className="categoria-card">
              <span>🛢️</span>
              <h3>Lubricantes</h3>
              <p>Aceites, grasas y productos de mantenimiento.</p>
            </div>

          </div>

        </section>

        {/* CATÁLOGO */}
        <section className="productos" id="productos">

          <div className="titulo-seccion">
            <span>NUESTRO CATÁLOGO</span>
            <h2>Productos destacados</h2>
            <p>
              Conocé algunos de nuestros productos.
            </p>
          </div>

          {/* BUSCADOR Y FILTROS */}
          <div className="filtros-productos">

            <input
              type="text"
              placeholder="Buscar un repuesto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Automóviles">Automóviles</option>
              <option value="Maquinaria">Maquinaria agrícola</option>
              <option value="Lubricantes">Lubricantes</option>
            </select>

          </div>

          {/* PRODUCTOS */}
          {cargando && <p>Cargando productos...</p>}
            {error && <p>{error}</p>}
            
          <div className="productos-grid">

            {productosFiltrados.map((producto) => (

              <article className="producto-card" key={producto.id}>

                <div className="producto-imagen">
                  <span>{producto.icono}</span>
                </div>

                <div className="producto-info">

                  <small>{producto.categoria}</small>

                  <h3>{producto.nombre}</h3>

                  <p>{producto.descripcion}</p>

                  <div className="producto-pie">

                    <strong>
                      ${producto.precio.toLocaleString("es-UY")}
                    </strong>

                    <button
                      onClick={() => agregarAlCarrito(producto)}
                    >
                      Agregar al carrito
                    </button>

                  </div>

                </div>

              </article>

            ))}

            {productosFiltrados.length === 0 && (
              <p>No se encontraron productos.</p>
            )}

          </div>

        </section>

        {/* CARRITO */}
        <section className="carrito" id="carrito">

          <div className="titulo-seccion">
            <span>TU COMPRA</span>
            <h2>Carrito de compras</h2>
            <p>Revisá los productos que seleccionaste.</p>
          </div>

          {carrito.length === 0 ? (

            <p className="carrito-vacio">
              Tu carrito está vacío.
            </p>

          ) : (

            <div className="carrito-contenido">

              {carrito.map((item) => (

                <div className="carrito-item" key={item.id}>

                  <div>
                    <h3>{item.nombre}</h3>
                    <p>
                      ${item.precio.toLocaleString("es-UY")} por unidad
                    </p>
                  </div>

                  <div className="carrito-cantidad">

                    <button
                      onClick={() => cambiarCantidad(item.id, -1)}
                    >
                      -
                    </button>

                    <strong>{item.cantidad}</strong>

                    <button
                      onClick={() => cambiarCantidad(item.id, 1)}
                    >
                      +
                    </button>

                  </div>

                  <strong>
                    ${(item.precio * item.cantidad).toLocaleString("es-UY")}
                  </strong>

                  <button
                    className="boton-eliminar"
                    onClick={() => eliminarDelCarrito(item.id)}
                  >
                    Eliminar
                  </button>

                </div>

              ))}

              <div className="carrito-total">

                <h3>
                  Total: ${totalCarrito.toLocaleString("es-UY")}
                </h3>

                <button onClick={enviarPedido}>
                  Finalizar pedido por WhatsApp
                </button>

              </div>

            </div>

          )}

        </section>

        {/* CONTACTO */}
        <section className="contacto" id="contacto">

          <div>
            <span>¿NECESITÁS AYUDA?</span>
            <h2>Estamos para ayudarte.</h2>

            <p>
              Consultanos por disponibilidad, precios y
              repuestos para tu vehículo o maquinaria.
            </p>
          </div>

          <a
            href="https://wa.me/59892946141"
            target="_blank"
            rel="noreferrer"
          >
            Contactar por WhatsApp
          </a>

        </section>

      </main>

      {/* PIE DE PÁGINA */}
      <footer className="footer">

        <a href="#inicio" className="logo">
          Fer<span>Repuestos</span>
        </a>

        <p>Repuestos para el camino y el campo.</p>

        <small>
          © 2026 FerRepuestos. Todos los derechos reservados.
        </small>

      </footer>

    </div>
  );
}

export default App;
