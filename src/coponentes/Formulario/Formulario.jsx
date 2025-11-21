import { Popover } from "../Popover/Popover";
import { useState, useEffect } from "react";
import Css from "./Formulario.module.css";
import { toast } from "react-toastify";
import Server from "../../api"; // ✔ instancia Axios

function v(nro, data) {
  const vector = data.split("-");
  return vector[nro - 1];
}

// 🔑 API key de imgbb
const IMGBB_API_KEY = "a224f36313d7c8d81307b1d21747b9be";

export function Formulario({ data }) {
  const [formValues, setFormValues] = useState(() => {
    const inputs = data.Input.reduce((acc, curr) => {
      acc[v(1, curr)] = "";
      return acc;
    }, {});

    const selects = data.Recibir.reduce((acc, sel) => {
      if (sel.name.includes("-MasDeUno")) {
        acc[sel.name.replace("-MasDeUno", "")] = [];
      } else {
        acc[sel.name] = "";
      }
      return acc;
    }, {});

    return { ...inputs, ...selects };
  });

  const [imagePreviews, setImagePreviews] = useState({});
  const [options, setOptions] = useState({});
  const [mensaje, setMensaje] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  mensaje;
  // -----------------------------------------------------------
  // 📌 Cargar las opciones de selects usando Axios
  // -----------------------------------------------------------
  useEffect(() => {
    data.Recibir.forEach(async (sel) => {
      try {
        const response = await Server.get(sel.Ruta);
        setOptions((prev) => ({ ...prev, [sel.name]: response.data }));
      } catch (error) {
        console.error("Error al cargar opciones:", error);
        setOptions((prev) => ({ ...prev, [sel.name]: [] }));
      }
    });
  }, [data.Recibir]);

  // -----------------------------------------------------------
  // 📌 Manejo checkbox múltiples
  // -----------------------------------------------------------
  const handleCheckboxChange = (fieldName, optionId, isChecked) => {
    setFormValues((prev) => {
      const current = prev[fieldName] || [];
      return {
        ...prev,
        [fieldName]: isChecked
          ? [...current, optionId]
          : current.filter((id) => id !== optionId)
      };
    });
  };

  // -----------------------------------------------------------
  // 📌 Input y archivos
  // -----------------------------------------------------------
  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    // FILE
    if (type === "file") {
      const file = files?.[0];
      setFormValues({ ...formValues, [name]: file });

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => ({
            ...prev,
            [name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreviews((prev) => {
          const newPrev = { ...prev };
          delete newPrev[name];
          return newPrev;
        });
      }
      return;
    }

    // TEXT
    setFormValues({ ...formValues, [name]: value });
  };

  // -----------------------------------------------------------
  // 📌 Subir imagen a imgbb usando Axios
  // -----------------------------------------------------------
  const uploadToImgbb = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const base64Image = reader.result.split(",")[1];
        const formData = new FormData();
        formData.append("image", base64Image);
  
        try {
          const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
            {
              method: "POST",
              body: formData,
            }
          );
  
          const result = await response.json();
  
          if (result?.data?.url) resolve(result.data.url);
          else reject("Error al subir imagen");
        } catch (err) {
          reject(err.message);
        }
      };
  
      reader.readAsDataURL(file);
    });
  };
  
  // -----------------------------------------------------------
  // 📌 Enviar formulario usando Axios
  // -----------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setMensaje("⏳ Procesando...");

    try {
      if (!data.Backendt) {
        toast.error("Backendt no definido");
        return;
      }

      const payload = { ...formValues };

      // Agregar carrito si existe
      if (data.carrito?.length > 0) {
        payload.productos = data.carrito;
      }

      // Subir imágenes primero
      for (const key in formValues) {
        if (formValues[key] instanceof File) {
          setMensaje("⏳ Subiendo imagen...");
          const url = await uploadToImgbb(formValues[key]);
          payload[key] = url;
        }
      }

      // Enviar datos al backend
      const response = await Server.post(data.Backendt, payload);

      if (response.data?.success || !response.data?.error) {
        toast.success("✅ Operación exitosa");
        setMensaje("✔️ Enviado correctamente");
        handleCancel();
      } else {
        toast.error("❌ Error en el servidor");
        setMensaje("❌ Error en el servidor");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("❌ Error de conexión");
      setMensaje("❌ Error de conexión");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -----------------------------------------------------------
  // 📌 Reset formulario
  // -----------------------------------------------------------
  const handleCancel = () => {
    const resetInputs = data.Input.reduce(
      (acc, curr) => ({ ...acc, [v(1, curr)]: "" }),
      {}
    );

    const resetSelects = data.Recibir.reduce((acc, sel) => {
      const field = sel.name.includes("-MasDeUno")
        ? sel.name.replace("-MasDeUno", "")
        : sel.name;

      return { ...acc, [field]: sel.name.includes("-MasDeUno") ? [] : "" };
    }, {});

    setFormValues({ ...resetInputs, ...resetSelects });
    setImagePreviews({});
  };

  const removeImagePreview = (field) => {
    setFormValues((prev) => ({ ...prev, [field]: "" }));
    setImagePreviews((prev) => {
      const p = { ...prev };
      delete p[field];
      return p;
    });
  };

  // -----------------------------------------------------------
  // 📌 Render
  // -----------------------------------------------------------
  return (
    <Popover botonTexto={data.Titulo}>
      <form onSubmit={handleSubmit} className={Css.formulario}>
        <center>
          <h1 className={Css.titulo}>{data.Titulo}</h1>
        </center>
        <hr className={Css.linea} />

        {/* ---------------- INPUTS ---------------- */}
        {data.Input.map((item, index) => {
          const key = v(1, item);
          const label = v(2, item);
          let type = v(3, item);
          const placeholder = v(4, item);

          if (type === "url" && data.url?.estado) {
            formValues[key] = data.url.url;
            type = "text";
          }

          return (
            <div className={Css.caja} key={index}>
              {type === "file" ? (
                <>
                  {!imagePreviews[key] && (
                    <>
                      <label className={Css.foto}>{label}</label>
                      <input
                        type="file"
                        className={`${Css.file} ${Css.input}`}
                        name={key}
                        accept="image/*"
                        onChange={handleChange}
                        required
                      />
                    </>
                  )}
                </>
              ) : type === "tt" ? (
                <>
                  <label className={Css.label}>{label}</label>
                  <textarea
                    className={Css.input}
                    name={key}
                    value={formValues[key]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    required
                  />
                </>
              ) : (
                <>
                  <label className={Css.label}>{label}</label>
                  <input
                    type={type}
                    name={key}
                    value={formValues[key]}
                    onChange={handleChange}
                    className={Css.input}
                    required
                  />
                </>
              )}

              {type === "file" && imagePreviews[key] && (
                <div className={Css.previewContainer}>
                  <img
                    src={imagePreviews[key]}
                    className={Css.previewImage}
                  />
                  <button
                    type="button"
                    onClick={() => removeImagePreview(key)}
                    className={Css.removeImageButton}
                  >
                    ✕ Eliminar imagen
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ---------------- SELECTS & CHECKBOX ---------------- */}
        {data.Recibir.map((sel, i) => {
          const isMultiple = sel.name.includes("-MasDeUno");
          const field = isMultiple
            ? sel.name.replace("-MasDeUno", "")
            : sel.name;
          const [idKey, nameKey] = sel.items || ["id", "nombre"];

          return (
            <div className={Css.caja} key={i}>
              {!isMultiple ? (
                <>
                  <label className={Css.label}>{field}</label>
                  <select
                    className={Css.input}
                    name={field}
                    value={formValues[field]}
                    onChange={handleChange}
                    required
                  >
                    <option value="">--Seleccionar--</option>
                    {options[sel.name]?.map((opt) => (
                      <option key={opt[idKey]} value={opt[idKey]}>
                        {opt[nameKey]}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <label className={Css.label}>{field} (múltiple)</label>
                  <div className={Css.checkboxContainer}>
                    {options[sel.name]?.map((opt) => (
                      <label key={opt[idKey]} className={Css.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={Css.checkboxInput}
                          checked={(formValues[field] || []).includes(opt[idKey])}
                          onChange={(e) =>
                            handleCheckboxChange(
                              field,
                              opt[idKey],
                              e.target.checked
                            )
                          }
                        />
                        {opt[nameKey]}
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}

        {/* ---------------- BOTONES ---------------- */}
        <div className={Css.botones}>
          <button type="submit" className={Css.enviar} disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar"}
          </button>
          <div onClick={handleCancel} className={Css.cancelar}>
            Cancelar
          </div>
        </div>
      </form>
    </Popover>
  );
}
