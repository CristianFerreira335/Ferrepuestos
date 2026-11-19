
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(null);

  // Datos del producto
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");
  const [stock, setStock] = useState("");

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Obtener productos de MongoDB
  async function cargarProductos() {

    try {

      const respuesta = await fetch(
        "http://localhost:5000/api/productos"
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los productos");
      }

      setProductos(datos);

    } catch (error) {

      setError(error.message);

    } finally {

      setCargando(false);

    }

  }

  useEffect(() => {
    cargarProductos();
  }, []);

  // Limpiar formulario
  function limpiarFormulario() {

    setNombre("");
    setDescripcion("");
    setPrecio("");
    setCategoria("");
    setImagen("");
    setStock("");
    setEditando(null);

  }

  // Agregar producto
  async function agregarProducto(e) {

    e.preventDefault();

    setMensaje("");
    setError("");

    const token = sessionStorage.getItem("token");

    try {

      const respuesta = await fetch(
        "http://localhost:5000/api/productos",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            precio: Number(precio),
            categoria,
            imagen,
            stock: Number(stock)
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo agregar el producto");
      }

      setMensaje("Producto agregado correctamente");

      limpiarFormulario();

      cargarProductos();

    } catch (error) {

      setError(error.message);

    }

  }

  // Preparar producto para editar
  function prepararEdicion(producto) {

    setEditando(producto._id);

    setNombre(producto.nombre);
    setDescripcion(producto.descripcion);
    setPrecio(producto.precio);
    setCategoria(producto.categoria);
    setImagen(producto.imagen || "");
    setStock(producto.stock);

    setMensaje("");
    setError("");

  }

  // Modificar producto
  async function editarProducto(e) {

    e.preventDefault();

    setMensaje("");
    setError("");

    const token = sessionStorage.getItem("token");

    try {

      const respuesta = await fetch(
        `http://localhost:5000/api/productos/${editando}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre,
            descripcion,
            precio: Number(precio),
            categoria,
            imagen,
            stock: Number(stock)
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo modificar el producto");
      }

      setMensaje("Producto modificado correctamente");

      limpiarFormulario();

      cargarProductos();

    } catch (error) {

      setError(error.message);

    }

  }

  // Eliminar producto
  async function eliminarProducto(id) {

    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este producto?"
    );

    if (!confirmar) {
      return;
    }

    setMensaje("");
    setError("");

    const token = sessionStorage.getItem("token");

    try {

      const respuesta = await fetch(
        `http://localhost:5000/api/productos/${id}`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "No se pudo eliminar el producto");
      }

      setMensaje("Producto eliminado correctamente");

      cargarProductos();

    } catch (error) {

      setError(error.message);

    }

  }

  // Cancelar edición
  function cancelarEdicion() {

    limpiarFormulario();

    setMensaje("Edición cancelada");
    setError("");

  }

  // Cerrar sesión
  function cerrarSesion() {

    sessionStorage.removeItem("token");

    navigate("/admin");

  }

  return (
    <div>

      <h1>FerRepuestos</h1>

      <h2>Panel de administración</h2>

      <button onClick={cerrarSesion}>
        Cerrar sesión
      </button>

      <hr />

      <h2>
        {editando ? "Editar producto" : "Agregar producto"}
      </h2>

      <form onSubmit={editando ? editarProducto : agregarProducto}>

        <input
          type="text"
          placeholder="Nombre del producto"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <br /><br />

        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min="0"
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
        />

        <br /><br />

        <input
          type="text"
          placeholder="URL de imagen (opcional)"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
        />

        <br /><br />

        <input
          type="number"
          placeholder="Cantidad en stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          min="0"
          required
        />

        <br /><br />

        <button type="submit">
          {editando ? "Guardar cambios" : "Agregar producto"}
        </button>

        {editando && (
          <button type="button" onClick={cancelarEdicion}>
            Cancelar edición
          </button>
        )}

      </form>

      {mensaje && <p>{mensaje}</p>}
      {error && <p>{error}</p>}

      <hr />

      <h2>Productos registrados</h2>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : (

        <table border="1" cellPadding="10">

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>

            {productos.map((producto) => (

              <tr key={producto._id}>

                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>{producto.categoria}</td>
                <td>{producto.stock}</td>

              <td>

                    <button
                        onClick={() => prepararEdicion(producto)}
                    >
                        Editar
                    </button>

                    <button
                        onClick={() => eliminarProducto(producto._id)}
                    >
                        Eliminar
                    </button>

                    </td>
              </tr>

            ))}

          </tbody>

        </table>

      )}

    </div>
  );

}

export default Admin;
