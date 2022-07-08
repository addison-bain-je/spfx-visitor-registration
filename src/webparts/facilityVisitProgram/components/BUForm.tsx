import * as React from 'react';
import * as Yup from 'yup';
import { Grid, InputBase, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { BUItem } from './ItemDefine';

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
    formInitialValues: BUItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
}

const validationSchema =
    Yup.object({
        Name: Yup.string().required("required"),
        Description: Yup.string().required("required"),
    });

class BUForm extends React.Component<FormProps> {
    private _service: service;
    private initialValues: BUItem;
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
                    Name: values.Name,
                    Description: values.Description
                };
                this._service.updateItem("BU", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else {

                this._service.createItem("BU", values).then(() => { this.props.refreshData(); });

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
                            <form id="BUForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Name"
                                            name="Name"
                                            error={errors.Name && touched.Name}
                                            helperText={errors.Name}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />

                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Description"
                                            name="Description"
                                            error={errors.Description && touched.Description}
                                            helperText={errors.Description}
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
export default withStyles(styles)(BUForm);
