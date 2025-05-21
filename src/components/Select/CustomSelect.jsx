import { useState, useRef, useEffect } from "react";
import "./Select.css";

// Recibe las mismas props que el select original
function CustomSelect({ options, value, onChange, ...props }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Agregar opción 'Todos' al inicio
  const allOption = { value: "", label: "Todos", type: "todos" };
  const fullOptions = [allOption, ...options];
  const selectedOption = fullOptions.find((opt) => opt.value === value);

  // Función para obtener la clase de tipo
  const getTypeClass = (opt) => {
    if (opt.type) return `select__option--type-${opt.type}`;
    if (opt.value) return `select__option--type-${opt.value}`;
    return "";
  };

  return (
    <div
      className="select"
      ref={ref}
      tabIndex={0}
      onClick={() => setOpen((o) => !o)}
      {...props}
    >
      <div className="select__selected">
        {selectedOption ? selectedOption.label : "Selecciona una opción"}
      </div>
      {open && (
        <ul className="select__dropdown">
          {fullOptions.map((opt) => (
            <li
              key={opt.value}
              className={`select__option${
                opt.value === value ? " select__option--selected" : ""
              } ${getTypeClass(opt)}`}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
