import * as React from 'react';
import { FormControl, FormLabel, RadioGroup as MuiRadioGroup, FormControlLabel, Radio, FormHelperText } from '@material-ui/core';

export default function RadioGroup(props) {

    const { name, label, value, onChange, items, error, disabled } = props;

    return (
        <FormControl
            variant="outlined"
            disabled={disabled}
            {...(error && { error: true })}
        >
            <FormLabel>{label}</FormLabel>
            <MuiRadioGroup row
                name={name}
                value={value}
                onChange={onChange}
            >
                {
                    items.map(
                        item => (
                            <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.title} />
                        )
                    )
                }

            </MuiRadioGroup>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
    );
}
