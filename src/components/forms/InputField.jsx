import { Field, ErrorMessage } from 'formik';

const InputField = ({
  name,
  type = "text",
  placeholder,
  label,
  className = "",
  labelClassName = ""
}) => {
  return (
    <div className={`input-field ${className}`}>
      {label && <label htmlFor={name} className={labelClassName}>{label}</label>}
      
      <Field
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className="form-input"
      />
      
      <ErrorMessage name={name} component="div" className="error-message" />
    </div>
  );
};

export default InputField;
