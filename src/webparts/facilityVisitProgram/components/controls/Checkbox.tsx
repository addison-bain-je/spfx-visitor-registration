import * as React from 'react';
import { FormControl, FormControlLabel, Checkbox as MuiCheckbox } from '@material-ui/core';

export default function Checkbox(props) {

    const { name, label, value, onChange } = props;


    const convertToDefEventPara = (aname, avalue) => ({
        target: {
            name: aname, value: avalue
        }
    });

    return (
        <FormControl>
            <FormControlLabel
                control={<MuiCheckbox
                    name={name}
                    color="primary"
                    checked={value}
                    onChange={e => onChange(convertToDefEventPara(name, e.target.checked))}
                   
                />}
                label={label}
            />
        </FormControl>
    );
}
