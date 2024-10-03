import React from "react";
import { useForm } from "react-hook-form";

const AuthenticationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data); // Maneja el envío del formulario (lógica de inicio de sesión)
  };

  // Watch for checkbox state to disable the submit button if not checked
  const isPrivacyChecked = watch("privacyPolicy");

  return (
    <div className="p-8 bg-white shadow-lg rounded-lg max-w-md w-full z-20">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Campo de correo electrónico */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Correo Electrónico</label>
          <input
            type="email"
            placeholder="Introduce tu correo electrónico"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            {...register("email", {
              required: "El correo electrónico es obligatorio",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Correo electrónico no válido",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Campo de contraseña */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-1">Contraseña</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
            {...register("password", {
              required: "La contraseña es obligatoria",
              minLength: {
                value: 6,
                message: "La contraseña debe tener al menos 6 caracteres",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Checkbox para aceptar la Política de Privacidad y Aviso Legal */}
        <div className="mb-6">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="form-checkbox h-5 w-5 text-blue-600"
              {...register("privacyPolicy", {
                required:
                  "Debes aceptar la Política de Privacidad y el Aviso Legal",
              })}
            />
            <span className="ml-2 text-gray-700">
              Acepto la{" "}
              <a
                href="#"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidad
              </a>{" "}
              y el{" "}
              <a
                href="#"
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aviso Legal
              </a>
            </span>
          </label>
          {errors.privacyPolicy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.privacyPolicy.message}
            </p>
          )}
        </div>

        {/* Enlace para recuperar contraseña */}
        <div className="mb-4 flex justify-between">
          <button
            type="button"
            className="text-sm text-blue-500 hover:underline focus:outline-none"
            onClick={() =>
              alert("Redirigir a la página de recuperación de contraseña")
            }
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón de enviar (deshabilitado hasta que el checkbox esté marcado) */}
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200 focus:outline-none ${
            !isPrivacyChecked ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isPrivacyChecked}
        >
          Iniciar Sesión
        </button>
      </form>

      {/* Enlace para registro */}
      <div className="mt-4 text-center">
        <p className="text-gray-600 text-sm">
          ¿No tienes una cuenta?{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthenticationForm;
