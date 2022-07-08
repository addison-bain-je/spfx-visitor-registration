import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { FinalApproverItem, SelectOptionItem } from './ItemDefine';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import MuiFormControl from "@material-ui/core/FormControl";
import Controls from './controls/Controls';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '80%',
                margin: theme.spacing(1),
            }
        }
    });

interface finalApproverFormProps {
    context: WebPartContext;
    formInitialValues: FinalApproverItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
    VisitorTypeSelectOptions: SelectOptionItem[];
}

const validationSchema =
    Yup.object({
        VisitorType: Yup.string().required("required"),
        FinalApprover: Yup.string().required("required"),
    });

class FinalApproverForm extends React.Component<finalApproverFormProps> {
    private _service: service;
    private initialValues: FinalApproverItem;
    constructor(props: finalApproverFormProps) {
        super(props);
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context, this.props.context.pageContext);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
            setSubmitting(false);
            if (values.ID != null) {
                var v = {
                    VisitorType: values.VisitorType,
                    FinalApprover: values.FinalApprover
                };
                this._service.updateItem("FinalApprover", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else
                this._service.createItem("FinalApprover", values).then(() => { this.props.refreshData(); });
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
                        {({ errors, handleSubmit, touched, values, handleReset, setFieldValue, handleChange }) => (
                            <form id="FinalApproverForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Controls.Select
                                            name="VisitorType"
                                            label="Visitor Type"
                                            value={values.VisitorType}
                                            options={this.props.VisitorTypeSelectOptions}
                                            onChange={handleChange}
                                            error={errors.VisitorType && touched.VisitorType
                                                ? errors.VisitorType
                                                : null}
                                            disabled={!this.props.editForm}
                                        />


                                        <MuiFormControl
                                            variant="outlined"
                                            error={errors.FinalApprover != null}
                                            margin='dense'
                                            size='medium'
                                        >
                                            <FormLabel>Final Approver</FormLabel>
                                            <PeoplePicker
                                                context={this.props.context}
                                                personSelectionLimit={1}
                                                groupName={""} // Leave this blank in case you want to filter from all users
                                                showtooltip={true}
                                                isRequired={false}
                                                disabled={!this.props.editForm}
                                                ensureUser={true}
                                                selectedItems={(items) => {
                                                    if (items.length != 0) {
                                                        setFieldValue("FinalApprover", items[0].text);

                                                    }
                                                    else
                                                        setFieldValue("FinalApprover", "");
                                                }}
                                                showHiddenInUI={true}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                defaultSelectedUsers={[values.FinalApprover]}
                                            />
                                            <FormHelperText>{errors.FinalApprover}</FormHelperText>
                                        </MuiFormControl>


                                    </Grid>
                                </Grid>
                            </form>)}
                    </Formik>
                </Paper>
            </>
        );
    }
}
export default withStyles(styles)(FinalApproverForm);
