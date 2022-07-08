import * as React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import { FormControlLabel, Grid, FormLabel, FormControl, FormHelperText } from '@material-ui/core';
interface IProps {
    data: any;
    onChange: any;
    label: string;
    error: any;
    disabled: boolean;
}
interface IState {
    data: any;

}
class CheckboxGroup extends React.Component<IProps, IState> {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data
        };
    }

    private handleChange = (name, index) => event => {
        let { data } = this.state;
        let { onChange } = this.props;
        data[index].checked = event.target.checked;
        this.setState({
            data: data
        }, () => {
            let checkedValues = [];
            this.state.data.forEach(item => {
                if (item.checked) {
                    checkedValues.push(item.value);
                }
            });
            onChange(checkedValues);
        });
    }
    /*
    public componentWillReceiveProps(nextprops) {
        if (nextprops.data != this.props.data) {
            console.log("compare pros.data change or not....");
            return true;
        }
        else
            return false;
    }
    */
    public render() {
        let { label, error, disabled } = this.props;
        return (
            <div className="root">
                <FormControl
                    variant="outlined"

                    {...(error && { error: true })}
                >
                    <FormLabel>{label}</FormLabel>
                    {

                        this.state.data.map((checkbox, index) => {
                            return (
                                //<Grid item>
                                <FormControlLabel control={<Checkbox
                                    key={index}
                                    checked={checkbox.checked}
                                    onChange={this.handleChange('', index)}
                                    value={checkbox.value}
                                    color="primary"
                                    disabled={disabled}
                                />} label={checkbox.value} />
                                //</Grid>
                            );
                        })
                    }
                    {error && <FormHelperText>{error}</FormHelperText>}
                </FormControl>
            </div>
        );
    }
}

export default CheckboxGroup;