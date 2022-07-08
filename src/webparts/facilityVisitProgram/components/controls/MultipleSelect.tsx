import * as React from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ListItemText from '@material-ui/core/ListItemText';
import Select from '@material-ui/core/Select';
import Checkbox from '@material-ui/core/Checkbox';
import { FormHelperText, TextField } from '@material-ui/core';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};


export default function MultipleSelect(props) {
    const { label, options, fieldName, dname, fieldValue, setFieldValue, error, ...other } = props;

    const [state, setState] = React.useState({
        SelectedItems: fieldValue,
    });


    React.useEffect(
        () => {
            setState({ ...state, SelectedItems: props.fieldValue });
        }, [props.fieldValue]
    );
    const handleChange = (event: React.ChangeEvent<{ value: string[] }>) => {

        setState({ ...state, SelectedItems: event.target.value as string[] });
        if (event.target.value.length != 0) {
            setFieldValue(fieldName, JSON.stringify(event.target.value as string[], null, 2));
            const r: string[] = [];
            event.target.value.map((item => {
                r.push(options.filter(obj => obj.id == item)[0].title);
            }));
            setFieldValue(dname, JSON.stringify(r, null, 2));
        }
        else {
            setFieldValue(fieldName, '');
            setFieldValue(dname, '');
        }
    };

    return (
        <FormControl
            variant="outlined"
            //style={{ width: '60%' }}
            {...(error && { error: true })}
            {...other}>
            <InputLabel>{label}</InputLabel>

            <Select
                //style={{width:'100%'}}
                labelId="mutiple-checkbox-label"
                id="mutiple-checkbox"
                multiple
                value={state.SelectedItems}
                onChange={handleChange}
                //input={<Input />}
                //input={<Input name="circle" id="circle" />}
                renderValue={(selected: string[]) => {
                    const r: string[] = [];
                    selected.map((item => {
                        r.push(options.filter(obj => obj.id == item)[0].title);
                    }));
                    return r.join(', ');
                }}
                MenuProps={MenuProps}
            >
                {props.options.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                        <Checkbox color='primary' checked={state.SelectedItems.indexOf(item.id) > -1} />
                        <ListItemText primary={item.title} />
                    </MenuItem>
                ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>

    );
}