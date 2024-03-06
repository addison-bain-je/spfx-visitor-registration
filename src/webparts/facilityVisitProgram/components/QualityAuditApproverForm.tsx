import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { QualityAuditApproverItem, SelectOptionItem, KeywordItem } from './ItemDefine';
import MuiFormControl from "@material-ui/core/FormControl";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
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

export interface formState {
   // AuditApproverEmail: string;
}

interface FormProps {
    context: WebPartContext;
    formInitialValues: QualityAuditApproverItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
    //SubVisitorTypeOptions: SelectOptionItem[];
    Keywords: KeywordItem[];
}

const validationSchema =
    Yup.object({
        AuditApprover: Yup.string().required("required"),
        QualityAuditType: Yup.string().required("required"),
    });

class QualityAuditApproverForm extends React.Component<FormProps, formState> {
    private _service: service;
    private initialValues: QualityAuditApproverItem;
    constructor(props: FormProps) {
        super(props);
        this.state = {
          //  AuditApproverEmail: this.props.formInitialValues.AuditApproverEmail,
        };
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        //console.log(JSON.stringify(values, null, 2));
        setTimeout(() => {
            setSubmitting(false);
          //  values.AuditApproverEmail = this.state.AuditApproverEmail;
          //  console.log("this.state.AuditApproverEmail is "+this.state.AuditApproverEmail);
            var v = {
                AuditApprover: values.AuditApprover,
                QualityAuditType: values.QualityAuditType,
             //   AuditApproverEmail: values.AuditApproverEmail,
            };
            console.log("V is "+JSON.stringify(v,null,2));
            if (values.ID != null) {
                this._service.updateItem("QualityAuditApprover", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else
                this._service.createItem("QualityAuditApprover", values).then(() => { this.props.refreshData(); });
            resetForm();
            this.props.closeForm();
        }, 1000);
    }
    private FilterKeywords(FieldName: string): SelectOptionItem[] {
        //private FilterKeywords(FieldName: string): SelectSpecialOptionItem[] {
        var v: SelectOptionItem[] = [];
        //var v: SelectSpecialOptionItem[] = [];
        var kItem: KeywordItem[] = [];
        if (FieldName != '') {
            kItem = this.props.Keywords.filter(obj => obj.Key == FieldName);
            if (kItem.length > 0) {
                JSON.parse(kItem[0].Values).map((item: { Value: any; }) => {
                    v.push({
                        id: item.Value,
                        title: item.Value,
                    });
                });
            }
        }
        return (v);
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
                        {({ errors, handleSubmit, touched, setFieldValue, values, handleReset, isSubmitting, handleChange }) => (
                            <form id="QualityAuditApproverForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Controls.Select
                                            name="QualityAuditType"
                                            label="Visiting Purpose"
                                            value={values.QualityAuditType}
                                            options={this.FilterKeywords("Visiting Purpose")}
                                            onChange={handleChange}
                                            error={errors.QualityAuditType && touched.QualityAuditType
                                                ? errors.QualityAuditType
                                                : null}
                                            disabled={!this.props.editForm}
                                        />
                                        <MuiFormControl
                                            variant="outlined"
                                            error={errors.AuditApprover != null}
                                            margin='dense'
                                            size='medium'
                                        >
                                            <FormLabel>Quality Audit Approver</FormLabel>
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
                                                        setFieldValue("AuditApprover", items[0].secondaryText.toString());
                                                     //   this.setState({ AuditApproverEmail: items[0].secondaryText.toString() });
                                                    }
                                                    else {
                                                        setFieldValue("AuditApprover", "");
                                                     //   this.setState({ AuditApproverEmail: "" });
                                                    }
                                                }}
                                                showHiddenInUI={true}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                defaultSelectedUsers={[values.AuditApprover]}
                                            />
                                            <FormHelperText>{errors.AuditApprover}</FormHelperText>
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
export default withStyles(styles)(QualityAuditApproverForm);
