import './Select.css';

function Select({ options, onChange, placeholder, disabled }) {
  return (
    <select className="select" onChange={onChange} disabled={disabled}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;