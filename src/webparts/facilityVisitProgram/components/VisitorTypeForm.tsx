import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { VisitorTypeItem } from './ItemDefine';

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
    formInitialValues: VisitorTypeItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
}

const validationSchema =
    Yup.object({
        VisitorType: Yup.string().required("required"),
        Description: Yup.string().required("required"),
    });

class VisitorTypeForm extends React.Component<FormProps> {
    private _service: service;
    private initialValues: VisitorTypeItem;
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
                    VisitorType: values.VisitorType,
                    Description: values.Description
                };
                this._service.updateItem("VisitorType", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else
                this._service.createItem("VisitorType", values).then(() => { this.props.refreshData(); });
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
                            <form id="VisitorTypeForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Visitor Type"
                                            name="VisitorType"
                                            error={errors.VisitorType && touched.VisitorType}
                                            helperText={errors.VisitorType}
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
export default withStyles(styles)(VisitorTypeForm);
