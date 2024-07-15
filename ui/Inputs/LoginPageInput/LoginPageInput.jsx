import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React, { memo, useState } from "react";
import PropTypes from "prop-types";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const PassWordAdroment = memo(({ show, onClick }) => {
  return (
    <IconButton
      aria-label="toggle password visibility"
      onClick={onClick}
      // onMouseDown={handleMouseDownPassword}
      edge="end"
    >
      {show ? <VisibilityOff /> : <Visibility />}
    </IconButton>
  );
});

PassWordAdroment.propTypes={
  show:PropTypes.bool.isRequired,
  onClick:PropTypes.func.isRequired
}

const LoginPageInput = memo(
  ({
    error = false,
    id = "",
    label = "",
    value = "",
    onChange = null,
    variant = "outlined",
    helperText = "",
    placeholder = "",
    name = "input",
    type = "text",
    required = false,
    endAdornment=null,
    startAdornment=null,
  }) => {
    const [showPass, setShowPassWord] = useState(false);

    return (
      <FormControl error={error} fullWidth sx={{ paddingBottom: 2 }}>
        <b>
          {label} {required && "*"}
        </b>
        <TextField
          error={error}
          id={id}
          type={showPass?"text":type}
          required={required}
          label={label}
          variant={variant}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">{startAdornment}</InputAdornment>
            ),
            endAdornment:
              type === "password" ? (
                <PassWordAdroment
                  show={showPass}
                  onClick={() => setShowPassWord(!showPass)}
                />
              ) : (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ),
          }}
        />
        {helperText?.length > 0 && (
          <FormHelperText>{helperText}</FormHelperText>
        )}
      </FormControl>
    );
  }
);

LoginPageInput.defaultProps = {
  error: false,
  id: "textfield",
  value: "",
  onChange: () => {},
  variant: "outlined",
  endAdornment:null,
  startAdornment:null
};

LoginPageInput.propTypes = {
  error: PropTypes.bool || PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired || PropTypes.number.isRequired,
  onChange: PropTypes.func,
  variant: PropTypes.string,
  helperText: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  endAdornment:PropTypes.node,
  startAdornment:PropTypes.node
};

LoginPageInput.displayName = "LoginPageInput";

export default LoginPageInput;
