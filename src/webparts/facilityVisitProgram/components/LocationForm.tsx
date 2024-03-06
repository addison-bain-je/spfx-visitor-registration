import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { LocationItem } from './ItemDefine';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import MuiFormControl from "@material-ui/core/FormControl";
import Controls from '../components/controls/Controls';
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
   // LocationApproverEmail: string;
}

interface FormProps {
    context: WebPartContext;
    formInitialValues: LocationItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
}
const HasRestrictAreaItems = [
    { id: 'Y', title: 'Y' },
    { id: 'N', title: 'N' },

];
const validationSchema =
    Yup.object({
        PlantArea: Yup.string().required("required"),
        AreaDescription: Yup.string().required("required"),
        Department: Yup.string().required("required"),
        LocationCode: Yup.string().required("required"),
        Block: Yup.string().required("required"),
        Floor: Yup.string().required("required"),
        Plant: Yup.string().required("required"),
        NameinEnglish: Yup.string().required("required"),
        NameinChinese: Yup.string().required("required"),
        ExtNo: Yup.string().required("required"),
        MobileNo: Yup.string().required("required"),
        AMSession: Yup.string().required("required"),
        PMSession: Yup.string().required("required"),
        LocationApprover: Yup.string().required("required"),
        HasRestrictArea: Yup.string().required("required"),
    });

class LocationForm extends React.Component<FormProps, formState> {
    private _service: service;
    private initialValues: LocationItem;
    constructor(props: FormProps) {
        super(props);
        this.state = {
          //  LocationApproverEmail: this.props.formInitialValues.LocationApproverEmail,
        };
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        //console.log(JSON.stringify(values, null, 2));
        setTimeout(() => {
            setSubmitting(false);
          //  values.LocationApproverEmail = this.state.LocationApproverEmail;
            var v = {
                PlantArea: values.PlantArea,
                AreaDescription: values.AreaDescription,
                Department: values.Department,
                LocationCode: values.LocationCode,
                Block: values.Block,
                Floor: values.Floor,
                Plant: values.Plant,
                NameinEnglish: values.NameinEnglish,
                NameinChinese: values.NameinChinese,
                ExtNo: values.ExtNo,
                MobileNo: values.MobileNo,
                AMSession: values.AMSession,
                PMSession: values.PMSession,
                LocationApprover: values.LocationApprover,
                HasRestrictArea: values.HasRestrictArea,
             //   LocationApproverEmail: values.LocationApproverEmail,
            };
            if (values.ID != null) {
                this._service.updateItem("Location", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else
                this._service.createItem("Location", values).then(() => { this.props.refreshData(); });
            //alert("submitted!");
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
                        {({ errors, handleChange, handleSubmit, touched, values, handleReset, isSubmitting, setFieldValue }) => (
                            <form id="locatoinForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Plant Area"
                                            name="PlantArea"
                                            error={errors.PlantArea && touched.PlantArea}
                                            helperText={errors.PlantArea}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Area Description"
                                            name="AreaDescription"
                                            error={errors.AreaDescription && touched.AreaDescription}
                                            helperText={errors.AreaDescription}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Department"
                                            name="Department"
                                            error={errors.Department && touched.Department}
                                            helperText={errors.Department}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Location Code"
                                            name="LocationCode"
                                            error={errors.LocationCode && touched.LocationCode}
                                            helperText={errors.LocationCode}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Block"
                                            name="Block"
                                            error={errors.LocationCode && touched.LocationCode}
                                            helperText={errors.LocationCode}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Floor"
                                            name="Floor"
                                            error={errors.Floor && touched.Floor}
                                            helperText={errors.Floor}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Plant"
                                            name="Plant"
                                            error={errors.Plant && touched.Plant}
                                            helperText={errors.Plant}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Name in English"
                                            name="NameinEnglish"
                                            error={errors.NameinEnglish && touched.NameinEnglish}
                                            helperText={errors.NameinEnglish}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Name in Chinese"
                                            name="NameinChinese"
                                            error={errors.NameinChinese && touched.NameinChinese}
                                            helperText={errors.NameinChinese}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Ext. No"
                                            name="ExtNo"
                                            error={errors.ExtNo && touched.ExtNo}
                                            helperText={errors.ExtNo}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="Mobile No"
                                            name="MobileNo"
                                            error={errors.MobileNo && touched.MobileNo}
                                            helperText={errors.MobileNo}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="AMSession"
                                            name="AMSession"
                                            error={errors.AMSession && touched.AMSession}
                                            helperText={errors.AMSession}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="outlined"
                                            label="PMSession"
                                            name="PMSession"
                                            error={errors.PMSession && touched.PMSession}
                                            helperText={errors.PMSession}
                                            disabled={!this.props.editForm}
                                            size="small"
                                        />

                                        <Controls.RadioGroup
                                            name="HasRestrictArea"
                                            label="Has Restrict Area?"
                                            value={values.HasRestrictArea}
                                            size="small"
                                            onChange={handleChange}
                                            items={HasRestrictAreaItems}
                                            error={errors.HasRestrictArea && touched.HasRestrictArea
                                                ? errors.HasRestrictArea
                                                : null}
                                            disabled={!this.props.editForm}
                                        />
                                    </Grid>

                                    <Grid item sm={12} xs={12}>
                                        <MuiFormControl
                                            variant="outlined"
                                            error={errors.LocationApprover != null}
                                            margin='dense'
                                            size='medium'
                                        >
                                            <FormLabel>Location Approver</FormLabel>
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
                                                        setFieldValue("LocationApprover", items[0].secondaryText.toString());
                                                       // this.setState({ LocationApproverEmail: items[0].secondaryText.toString() });
                                                    }
                                                    else {
                                                        setFieldValue("LocationApprover", "");
                                                      //  this.setState({ LocationApproverEmail: "" });
                                                    }
                                                }}
                                                showHiddenInUI={true}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                defaultSelectedUsers={[values.LocationApprover]}
                                            />
                                            <FormHelperText>{errors.LocationApprover}</FormHelperText>
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
export default withStyles(styles)(LocationForm);
