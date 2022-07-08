import * as React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@material-ui/core';

export default function Select(props) {

    const { name, dname, label, value, error = null, onChange, options, setFieldValue, ...others } = props;

    return (
        <FormControl variant="outlined"
            {...(error && { error: true })}>
            <InputLabel>{label}</InputLabel>
            <MuiSelect
                label={label}
                name={name}
                value={value}
                onChange={(e) => {
                    onChange(e);
                    var v = options.filter(obj => obj.id == e.target.value);
                    if (v.length != 0)
                        setFieldValue(dname, options.filter(obj => obj.id == e.target.value)[0].title);
                    else
                        setFieldValue(dname, '');
                }}
                {...others}
            >
                <MenuItem value="">None</MenuItem>
                {
                    options.map(
                        item => (<MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>)
                        //item => (<MenuItem key={item.id} value={item.title}>{item.title}</MenuItem>)
                    )
                }

            </MuiSelect>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}
