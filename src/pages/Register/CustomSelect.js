// Not used
import React from "react";
import { TextField } from "@mui/material";

const CustomSelect = ({ field, form, ...props }) => {
    const { name } = field;
    const { touched, errors, setFieldValue } = form;

    const handleChange = (event) => {
        const { value } = event.target;
        setFieldValue(name, value);
    };

    return (
        <TextField
            {...field}
            {...props}
            select
            variant="outlined"
            fullWidth
            error={touched[name] && !!errors[name]}
            helperText={touched[name] && errors[name]}
            onChange={handleChange}
        >
            {props.children}
        </TextField>
    );
};

export default CustomSelect;