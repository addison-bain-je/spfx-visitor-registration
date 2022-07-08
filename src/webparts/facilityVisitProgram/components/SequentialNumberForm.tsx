import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SequentialNumberItem } from './ItemDefine';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '80%',
                margin: theme.spacing(1),
            }
        }
    });

interface FormProps {
    context: WebPartContext;
    formInitialValues: SequentialNumberItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
}

const validationSchema =
    Yup.object({
        FormName: Yup.string().required("required"),
        Prefix: Yup.string().required("required"),
        Year: Yup.string().required("required"),
        SequentialNumber: Yup.string().required("required"),
    });

class SequentialNumberForm extends React.Component<FormProps> {
    private _service: service;
    private initialValues: SequentialNumberItem;
    constructor(props: FormProps) {
        super(props);
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context, this.props.context.pageContext);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        //console.log(JSON.stringify(values, null, 2));
        setTimeout(() => {
            setSubmitting(false);
            if (values.ID != null) {
                var v = {
                    FormName: values.FormName,
                    Prefix: values.Prefix,
                    Year: values.Year,
                    SequentialNumber: values.SequentialNumber
                };
                this._service.updateItem("SequentialNumberProfile", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else {

                this._service.createItem("SequentialNumberProfile", values).then(() => { this.props.refreshData(); });

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
                            <form id="SequentialNumberForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="FormName"
                                            name="FormName"
                                            error={errors.FormName && touched.FormName}
                                            helperText={errors.FormName}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Prefix"
                                            name="Prefix"
                                            error={errors.Prefix && touched.Prefix}
                                            helperText={errors.Prefix}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Year"
                                            name="Year"
                                            error={errors.Year && touched.Year}
                                            helperText={errors.Year}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="SequentialNumber"
                                            name="SequentialNumber"
                                            error={errors.SequentialNumber && touched.SequentialNumber}
                                            helperText={errors.SequentialNumber}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>
                            </form>)}
                    </Formik>
                </Paper>
            </>
        );
    }
}
export default withStyles(styles)(SequentialNumberForm);
