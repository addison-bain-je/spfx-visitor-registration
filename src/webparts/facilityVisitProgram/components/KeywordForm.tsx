import * as React from 'react';
import * as Yup from 'yup';
import { Grid, InputBase, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { KeywordItem } from './ItemDefine';
import _MaterialTable from './_MaterialTable';
import _MaterialTable_Read from './_MaterialTable_Read';
const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '80%',
                margin: theme.spacing(1),
            }
        },
        inputbase: {
            border: "1px solid blue",
            borderRadius: theme.shape.borderRadius
        }
    });

interface FormProps {
    context: WebPartContext;
    formInitialValues: KeywordItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
}

const validationSchema =
    Yup.object({
        Key: Yup.string().required("Key is required"),
        Values: Yup.string().required("At least value is required"),
    });
const initializeValues = (value) => {
    if (value != '' && value != null && value != 'undefined')
        return JSON.parse(value);
    else
        return ([]);
};
const MTColumns = [
    { title: "Value", field: "Value", validate: rowData => rowData.Value === '' ? 'At least value is required' : '', },
];
const MTValidation = (newData) => {
    var errors = [];
    if (!newData.Value)
        errors.push("Value is required!");
    return (errors);
};
class KeywordForm extends React.Component<FormProps> {
    private _service: service;
    private initialValues: KeywordItem;
    constructor(props: FormProps) {
        super(props);
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        console.log(JSON.stringify(values, null, 2));
        setTimeout(() => {
            setSubmitting(false);
            if (values.ID != null) {
                var v = {
                    Key: values.Key,
                    Values: values.Values
                };
                this._service.updateItem("Keywords", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else {

                this._service.createItem("Keywords", values).then(() => { this.props.refreshData(); });

            }
            resetForm();
            this.props.closeForm();
        }, 1000);
    }

    public render() {

        const { classes } = this.props;
        return (
            <>
                <Paper>
                    <Formik
                        initialValues={this.initialValues}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmit}
                    >
                        {({ errors, handleSubmit, touched, values, handleReset, isSubmitting }) => (
                            <form id="KeywordForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Key"
                                            name="Key"
                                            error={errors.Key && touched.Key}
                                            helperText={errors.Key}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                       
                                        <Grid item xs={12} sm={12}>
                                            <Field
                                                name="Values"
                                            >
                                                {(fieldProps) => {
                                                    if (this.props.editForm)
                                                        return (
                                                            <_MaterialTable
                                                                Title=""
                                                                data={initializeValues(fieldProps.field.value)}
                                                                setFieldValue={fieldProps.form.setFieldValue}
                                                                fieldName="Values"
                                                                columns={MTColumns}
                                                                validate={MTValidation}
                                                                error={errors.Values && touched.Values
                                                                    ? errors.Values
                                                                    : null}
                                                            />);
                                                    else
                                                        return (
                                                            <_MaterialTable_Read
                                                                Title=""
                                                                data={initializeValues(fieldProps.field.value)}
                                                                columns={MTColumns}
                                                            />);
                                                }}
                                            </Field>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </form>)}
                    </Formik>
                </Paper>
            </>
        );
    }
}
export default withStyles(styles)(KeywordForm);
