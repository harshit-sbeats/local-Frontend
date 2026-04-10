
export const SimpleInputField = ({ label, name, placeholder, value, onChange }) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <input
      type="text"
      name={name}
      className="form-control form-control-sm"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  </div>
);

export const ClassicField = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  type = "text" // 🔹 Default to text, but can be "number"
}) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <input
      type={type} 
      name={name}
      className="form-control form-control-sm"
      placeholder={placeholder}
      // 🔹 Fix: Use ?? to ensure 0 is displayed correctly
      value={value ?? ""} 
      onChange={onChange}
      // 🔹 UX Fix: Prevents scroll wheel from accidentally changing numbers
      onWheel={(e) => type === "number" && e.target.blur()}
      // 🔹 Mobile Fix: Opens numeric keypad even if type is text
      inputMode={type === "number" ? "decimal" : "text"}
    />
  </div>
);

export const SimpleSelectField = ({ 
  label, name, options, value, onChange, showAddButton, 
  valueKey = "id", labelKey = "name", disabled 
}) => (
  <div className="mb-3">
    <label className="form-label fw-bold small mb-1">{label}</label>
    <div className="input-group input-group-sm">
      <select 
        className="form-select form-select-sm" 
        name={name} 
        value={value || ""} 
        onChange={onChange}
        disabled={disabled}
      >
        <option value="">{disabled ? 'Loading...' : `Select ${label.toLowerCase()}`}</option>
        {options.map((opt) => (
          <option key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
          </option>
        ))}
      </select>
      {showAddButton && (
        <button className="btn btn-outline-secondary" type="button">
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  </div>
);
export default SimpleSelectField;