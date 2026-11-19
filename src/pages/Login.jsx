
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  async function iniciarSesion(e) {

    e.preventDefault();
    setError("");
    setCargando(true);

    try {

      const respuesta = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.mensaje || "Error al iniciar sesión");
      }

      sessionStorage.setItem("token", datos.token);

      navigate("/admin/panel");

    } catch (error) {

      setError(error.message);

    } finally {

      setCargando(false);

    }

  }

  return (
    <div>
      <h1>FerRepuestos</h1>
      <h2>Panel de administración</h2>

      <form onSubmit={iniciarSesion}>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={cargando}>
          {cargando ? "Ingresando..." : "Iniciar sesión"}
        </button>

        {error && <p>{error}</p>}

      </form>
    </div>
  );

}

export default Login;
