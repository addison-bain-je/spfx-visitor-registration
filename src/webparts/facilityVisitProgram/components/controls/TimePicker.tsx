import 'date-fns';
import * as React from 'react';
import DateFnsUtils from '@date-io/date-fns';

import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
} from '@material-ui/pickers';
import { FormControl, FormHelperText } from '@material-ui/core';

export default function TimePicker(props) {

    const { name, label, setFieldValue, value, error, ...others } = props;
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(value);

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
        if (date != null)
            setFieldValue(name, date.toUTCString());
        else
            setFieldValue(name, '');
    };

    return (
        <div>
            <FormControl
                variant="standard"
                {...(error && { error: true })}
                {...others}>

                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label={label}
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />

                </MuiPickersUtilsProvider>
                {error && <FormHelperText style={{ marginLeft: '9px' }}>{error}</FormHelperText>}
            </FormControl >

        </div>
    );
}
