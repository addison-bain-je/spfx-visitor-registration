import * as React from 'react';
import * as Yup from 'yup';
import { fvpFormProps } from './fvpFormProps';
import { Grid, TextField, Paper, AppBar, Toolbar, IconButton, Tooltip, InputLabel, styled, FormLabel, FormControlLabel } from '@material-ui/core';
import Controls from './controls/Controls';
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import PageHeader from './PageHeader';
import { Formik, Field } from 'formik';
import { fvpService } from '../service/fvpService';
import { fvpItem, SelectOptionItem, FinalApproverItem, KeywordItem } from './ItemDefine';
import _MaterialTable from './_MaterialTable';
import _MaterialTable_Read from './_MaterialTable_Read';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import MuiTypography from '@material-ui/core/Typography';
import { ListItemAttachments } from "@pnp/spfx-controls-react/lib";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//import CloseIcon from '@material-ui/icons/Close';
import TourPlan from './TourPlan';
import TourPlan_Read from './TourPlan_Read';
import { differenceInDays } from 'date-fns';
import Menu from "@material-ui/icons/Menu";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faEdit, faRedoAlt, faSave, faBan, faTimes } from '@fortawesome/free-solid-svg-icons';
import orange from '@material-ui/core/colors/orange';
import green from '@material-ui/core/colors/green';
const submitIcon = <FontAwesomeIcon icon={faPaperPlane} />;
const editIcon = <FontAwesomeIcon icon={faEdit} />;
const resetIcon = <FontAwesomeIcon icon={faRedoAlt} />;
const saveIcon = <FontAwesomeIcon icon={faSave} />;
const cancelIcon = <FontAwesomeIcon icon={faBan} />;
const closeIcon = <FontAwesomeIcon icon={faTimes} />;
const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '60%',
                //margin: theme.spacing(1),
                marginLeft: theme.spacing(1),
                marginBottom: theme.spacing(1),
                marginTop: theme.spacing(1),
            },
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderRadius: `50px 50px 50px 50px`,
                },
            }
        },

        input: {
            display: 'none',
        },
        button: {
            margin: theme.spacing(1),
            backgroundColor: orange[500],
            //color: 'white',
            textTransform: 'none',
            color: theme.palette.getContrastText(orange[500]),
            '&:hover': {
                backgroundColor: orange[800],

            }
        },

        toolbarButton: {
            margin: theme.spacing(1),
            backgroundColor: orange[500],
            textTransform: 'none',
            color: theme.palette.getContrastText(orange[500]),
            '&:hover': {
                backgroundColor: orange[800],
            },
            '.MuiButton-label': {
                fontSize: 'smaller'
            }
        },
        textField: {
            '& .MuiOutlinedInput-root': {
                '& fieldset': {
                    borderRadius: `50px 50px 50px 50px`,
                },
            },
        },
        controlLabel: {
            width: '90%',
            display: "flex",
            justifyContent: "space-between",
        },
        appBar: {
            position: 'fixed',
            marginBottom: theme.spacing(2),
            backgroundColor: orange[500],
            color: theme.palette.getContrastText(orange[500]),
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
        dialogroot: {
            width: '100%',
            maxWidth: '100%',
            margin: theme.spacing(1),
            padding: theme.spacing(2),
        }
    });

const VisitorDetailsColumns = [
    { title: "Company Name", field: "CompanyName", validate: rowData => rowData.CompanyName === '' ? 'Company Name cannot be empty' : '', },
    { title: "Visitor Name", field: "VisitorName", validate: rowData => rowData.VisitorName === '' ? 'Visitor Name cannot be empty' : '', },
    { title: "Job Title", field: "JobTitle", validate: rowData => rowData.JobTitle === '' ? 'Job Title cannot be empty' : '', },
];

const initializeValues = (value) => {
    if (value != '' && value != null && value != 'undefined')
        return JSON.parse(value);
    else
        return ([]);
};

// const objComparator = function (a, b) {
//     if (a.id < b.id) {
//         return -1;
//     }
//     if (a.id > b.id) {
//         return 1;
//     }
//     return 0;
// };

const validationSchema =
    Yup.object({
        ApplicantContactNumber: Yup.string().required("required").nullable(),
        BU: Yup.string().required("required").nullable(),
        BUSegment: Yup.string().required("required").nullable(),
        SalesRegion: Yup.string().required("required").nullable(),
        GenerateRemark: Yup.string().required("required").nullable(),
        VisitorType: Yup.string()
            .required('required').nullable(),
        // VisitorTypeDescription: Yup.string()
        //     .required('required').nullable(),
        VisitingPurpose: Yup.string().when('VisitorType', {
            is: 'BU Customer',
            then: Yup.string().required('required').nullable(),
            otherwise: Yup.string().notRequired().nullable(),
        }),
        Application: Yup.string()
            .required('required').nullable(),
        FinalApprover: Yup.string()
            .required('required').nullable(),
        HostName: Yup.string()
            .required('required').nullable(),
        HostContactNo: Yup.string()
            .required('required').nullable(),
        HostJobTitleDept: Yup.string()
            .required('required').nullable(),
        VisitorDetails: Yup.string()
            .required('please finish visitor details').nullable(),
        TourPlan: Yup.string().test('TourPlan', 'please finish tour plan',
            (value) => {
                return !(value == '' || value == 'undefined' || value == null);
            }
        ).test('TourPlan', 'Visiting date should not be less than 3 days from the day of submision.You can only save it as draft and get email approval from your SVP.', (value) => {
            var v = initializeValues(value);
            var v1 = [];
            if (v.length > 0) {
                v.map((item) => {
                    //console.log(differenceInDays(new Date(item.Date), new Date()));
                    if (differenceInDays(new Date(item.Date), new Date()) < 2)
                        v1.push(true);
                });
            }
            return v.length > 0 && v1.length == 0;
        }).nullable(),
    });
const validateVisitingDate = (value) => {
    var v = initializeValues(value);
    var v1 = [];
    if (v.length > 0) {
        v.map((item) => {
            if (differenceInDays(new Date(item.Date), new Date()) < 2)
                v1.push(true);
        });
    }
    return (v1.length);
};

const validateVisitorDetail = (newData) => {
    var errors = [];
    if (newData.CompanyName == null || newData.CompanyName == '' || newData.CompanyName == 'undefined')
        errors.push("Company Name can not be empty!");
    if (newData.VisitorName == null || newData.VisitorName == '' || newData.VisitorName == 'undefined')
        errors.push("Visitor Name can not be empty!");
    if (newData.JobTitle == null || newData.JobTitle == '' || newData.JobTitle == 'undefined')
        errors.push("Job Title can not be empty!");
    return (errors);
};

export interface formState {
    fileinfos: any;
    FilteredFinalApproverOptions: SelectOptionItem[];
    open: boolean;
    options: string[];
    fieldName: string;
    title: string;
    openAlert: boolean;
}

class FvpForm extends React.Component<fvpFormProps, formState> {
    private _fvpservice: fvpService;
    private initialValues: fvpItem;
    constructor(props: fvpFormProps) {
        super(props);
        this.state = {
            fileinfos: [],
            FilteredFinalApproverOptions: [],
            open: false,
            options: [],
            fieldName: '',
            title: '',
            openAlert: false,
        };
        this.initialValues = this.props.formInitialValues;
        this._fvpservice = new fvpService(this.props.context, this.props.context.pageContext);
    }
    private setOpen = (fieldname: string, poptions: string[], title) => {
        this.setState({ open: true, options: poptions, fieldName: fieldname, title: title });
    }
    private handleCancel = () => {
        this.setState({ open: false, options: [], fieldName: '', title: '' });
    }
    private handleOK = () => {
        this.setState({ openAlert: false });
    }

    private FilterKeywords(FieldName: string): SelectOptionItem[] {
        //private FilterKeywords(FieldName: string): SelectSpecialOptionItem[] {
        var v: SelectOptionItem[] = [];
        //var v: SelectSpecialOptionItem[] = [];
        var kItem: KeywordItem[] = [];
        if (FieldName != '') {
            kItem = this.props.keywords.filter(obj => obj.Key == FieldName);
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

    private onSubmit = (values, { setSubmitting, resetForm }) => {

        if (confirm("Are you sure to submit?")) {

            setTimeout(() => {
                //values.MarketingCoordinator = this.FilterKeywords("Marketing Coordinator");
                values.Action = "submit";
                values.Status = "Submitted";
                //console.log("Submitted values is " + JSON.stringify(values, null, 2));
                //values.SubmittedDate = new Date().toLocaleString();
                setSubmitting(false);
                if (values.ID != null) {
                    this._fvpservice.updateItem("FVP", values).then(() => { this.props.refreshData(); });
                }
                else
                    this._fvpservice.createItem("FVP", values, this.state.fileinfos).then(() => { this.props.refreshData(); });
                //alert("Submitted successfully!");
                resetForm();
                this.props.closeForm();
            }, 0);
        }
        else
            setSubmitting(false);
    }
    private onSave(formik): void {
        if (confirm("Are you sure to save?")) {
            //formik.values.MarketingCoordinator = this.FilterKeywords("Marketing Coordinator");
            formik.values.Action = "save";
            formik.values.CurrentHandler = this.props.context.pageContext.user.email;
            //console.log("Saved values is " + JSON.stringify(formik.values, null, 2));
            setTimeout(() => {
                formik.setSubmitting(false);
                if (formik.values.ID != null) {
                    this._fvpservice.updateItem("FVP", formik.values).then(() => { this.props.refreshData(); });
                }
                else
                    this._fvpservice.createItem("FVP", formik.values, this.state.fileinfos).then(() => { this.props.refreshData(); });
                formik.resetForm();
                this.props.closeForm();
            }, 0);
        }
        else
            formik.setSubmitting(false);
    }

    private onCancel(formik): void {
        if (confirm("Are you sure to cancel?")) {
            formik.values.Action = "cancel";
            formik.values.Status = "Cancelled";
            formik.values.CurrentHandler = "";
         //   console.log(JSON.stringify(formik.values, null, 2));
            setTimeout(() => {
                formik.setSubmitting(false);
                this._fvpservice.updateItem("FVP", formik.values).then(() => { this.props.refreshData(); });
                formik.resetForm();
                this.props.closeForm();
                formik.setSubmitting(false);
            }, 1000);
        }
        else
            formik.setSubmitting(false);
    }

    private onApprove(formik): void {
        if (confirm("Are you sure to approve?")) {
            formik.values.Action = "onapprove";
            formik.values.Status = "Ready";
            formik.values.CurrentHandler = "";
           // console.log(JSON.stringify(formik.values, null, 2));
            setTimeout(() => {
                formik.setSubmitting(false);
                this._fvpservice.updateItem("FVP", formik.values).then(() => { this.props.refreshData(); });
                formik.resetForm();
                this.props.closeForm();
                formik.setSubmitting(false);
            }, 1000);
        }
        else
            formik.setSubmitting(false);
    }

    // private onApprove(formik): void {
    //     formik.values.Action = "approve";
    //     formik.submitForm();
    // }

    private addFile = (event) => {
        //Push file name and content into the array of fileinfos
        let resultFile = event.target.files;
        let fileinfos = [];
        for (var i = 0; i < resultFile.length; i++) {
            var fileName = resultFile[i].name;
            var file = resultFile[i];
            var reader = new FileReader();
            reader.onload = ((afile) => {
                return (e) => {
                    //Push the converted file into array
                    fileinfos.push({
                        "name": afile.name,
                        "content": e.target.result
                    });
                };
            })(file);
            reader.readAsArrayBuffer(file);
        }
        this.setState({ fileinfos });
        // display the file names after uploading the files via clicking "UPLOAD" button
        if (resultFile.length > 0) {
            var output = document.getElementById('fileList');
            var children = "";
            for (var j = 0; j < resultFile.length; ++j) {
                children += '<li>' + resultFile.item(j).name + '</li>';
            }
            output.innerHTML = '<ul>' + children + '</ul>';
        }
    }

    // private FilterFinalApproverOptions(VisitorType: string): SelectOptionItem[] {
    //     var v: SelectOptionItem[] = [];
    //     var v1: FinalApproverItem[] = [];
    //     if (VisitorType != '') {
    //         v1 = this.props.FinalApproverOptions.filter(obj => obj.VisitorType == VisitorType);
    //         v1.map((item) => {
    //             v.push({
    //                 id: String(item.ID),
    //                 title: item.FinalApprover,
    //             });
    //         });
    //     }
    //     return (v);
    // }

    public render() {
        const { classes } = this.props;
        return (
            <>
                <Paper variant='outlined' elevation={1}>

                    <Formik
                        initialValues={this.initialValues}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmit}
                    >
                        {(formik) => (

                            <form id="FvpForm" className={classes.root} autoComplete="off" onReset={() => { if (confirm("Are you sure to reset?")) formik.handleReset(); }} onSubmit={formik.handleSubmit} >
                                <AppBar className={classes.appBar}>
                                    <Toolbar>

                                        <Typography noWrap={true} variant="subtitle1" className={classes.title}>Facility Visit Program Form</Typography>
                                        {((formik.values.CurrentHandler == this.props.context.pageContext.user.email) && formik.values.Status == "Draft") ? <div><Button
                                            autoFocus
                                            size="small"
                                            color="inherit"
                                            className={classes.toolbarButton}
                                            startIcon={submitIcon}
                                            disabled={!this.props.editForm || formik.isSubmitting}
                                            onClick={() => {

                                                if (validateVisitingDate(formik.values.TourPlan) == 0)
                                                    formik.handleSubmit();
                                                else
                                                    //alert("Visiting date should not be less than 3 days from the day of submision.You can only save it as draft and get email approval from your SVP.");
                                                    this.setState({ openAlert: true });
                                            }}
                                        >
                                            Submit  </Button>
                                            <Button
                                                autoFocus
                                                size="small"
                                                className={classes.toolbarButton}
                                                startIcon={saveIcon}
                                                color="inherit"
                                                disabled={!this.props.editForm || formik.isSubmitting}
                                                onClick={() => { formik.setSubmitting(true); this.onSave(formik); }}
                                            >
                                                Save  </Button>

                                            {/* <Button
                                            autoFocus
                                            size="small"
                                            className={classes.toolbarButton}
                                            startIcon={resetIcon}
                                            color="inherit"
                                            type="reset"
                                            form="FvpForm"
                                            disabled={!this.props.editForm || formik.isSubmitting}
                                        >
                                            Reset  </Button> */}
                                            <Button
                                                autoFocus
                                                className={classes.toolbarButton}
                                                size="small"
                                                startIcon={editIcon}
                                                color="inherit"
                                                disabled={this.props.editForm || formik.values.Status != "Draft"}
                                                onClick={this.props.handleEdit}
                                            >
                                                Edit  </Button></div> : null}
                                        {/* <Button
                                            autoFocus
                                            className={classes.toolbarButton}

                                            size="small"
                                            startIcon={cancelIcon}
                                            color="inherit"
                                            disabled={!(!this.props.editForm && ((formik.values.Status.includes("In Progress") && this.props.context.pageContext.user.displayName == formik.values.Applicant) || (this.props.userRoles.indexOf("Admin") != -1 && !formik.values.Status.includes("Cancelled"))))}
                                            onClick={() => { formik.setSubmitting(true); this.onCancel(formik); }}
                                        >Cancel</Button> */}
                                        {!(this.props.context.pageContext.user.displayName == formik.values.Applicant) ? null :
                                            <div>
                                                {formik.values.Status == "Cancelled" ? null :
                                                    <Button
                                                        autoFocus
                                                        className={classes.toolbarButton}
                                                        size="small"
                                                        startIcon={cancelIcon}
                                                        color="inherit"
                                                        //disabled={!this.props.editForm || formik.isSubmitting}
                                                        disabled={false}
                                                        onClick={() => { formik.setSubmitting(true); this.onCancel(formik); }}
                                                    >Cancel</Button>
                                                }
                                            </div>}
                                        {!this.props.IsAdmin ? null :
                                            <div>
                                                {formik.values.Status != "Draft" ? null :
                                                    <Button
                                                        autoFocus
                                                        className={classes.toolbarButton}
                                                        size="small"
                                                        startIcon={submitIcon}
                                                        color="inherit"
                                                        disabled={!this.props.editForm || formik.isSubmitting}
                                                        onClick={() => { formik.setSubmitting(true); this.onApprove(formik); }}
                                                    >Approve</Button>
                                                }
                                                {formik.values.Status == "Cancelled" ? null :
                                                    <Button
                                                        autoFocus
                                                        className={classes.toolbarButton}
                                                        size="small"
                                                        startIcon={cancelIcon}
                                                        color="inherit"
                                                        disabled={!this.props.editForm || formik.isSubmitting}
                                                        onClick={() => { formik.setSubmitting(true); this.onCancel(formik); }}
                                                    >Cancel</Button>
                                                }
                                                <Button
                                                    autoFocus
                                                    size="small"
                                                    className={classes.toolbarButton}
                                                    startIcon={saveIcon}
                                                    color="inherit"
                                                    disabled={!this.props.editForm || formik.isSubmitting}
                                                    onClick={() => { formik.setSubmitting(true); this.onSave(formik); }}
                                                >
                                                    Save by Owner </Button>
                                                <Button
                                                    autoFocus
                                                    className={classes.toolbarButton}
                                                    size="small"
                                                    startIcon={editIcon}
                                                    color="inherit"
                                                    disabled={this.props.editForm}
                                                    onClick={this.props.handleEdit}
                                                >
                                                    Edit by Owner  </Button>
                                            </div>
                                        }
                                        <Button
                                            autoFocus
                                            className={classes.toolbarButton}

                                            size="small"
                                            startIcon={closeIcon}
                                            color="inherit"
                                            //disabled={!(!this.props.editForm && ((formik.values.Status.includes("In Progress") && this.props.context.pageContext.user.displayName == formik.values.Applicant) || (this.props.userRoles.indexOf("Admin") != -1 && !formik.values.Status.includes("Cancelled"))))}
                                            onClick={this.props.closeForm}
                                        >Close</Button>


                                    </Toolbar>
                                </AppBar>

                                <PageHeader
                                    title="FVP Form"
                                    icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
                                />

                                <Paper variant='outlined' elevation={1}>
                                    <Grid container>

                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    name="RequestNo"
                                                    //label="Request No"
                                                    variant="outlined"
                                                    disabled={true}
                                                    value={formik.values.RequestNo}
                                                />}
                                                labelPlacement="start"
                                                label={"Request No"}
                                                className={classes.controlLabel}
                                            />

                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    //label="Applicant"
                                                    name="Applicant"
                                                    disabled={true}
                                                />}
                                                labelPlacement="start"
                                                label={"Applicant"}
                                                className={classes.controlLabel}
                                            />
                                            <Tooltip title={formik.values.BU ? JSON.parse(formik.values.BU).join(',') : "Empty"} arrow placement="right">
                                                <div>
                                                    <FormControlLabel
                                                        disabled={!this.props.editForm}
                                                        control={
                                                            <Field
                                                                name="BU">
                                                                {(fieldProps) => {
                                                                    return (
                                                                        <Controls.MultipleSelect
                                                                            fieldName="BU"
                                                                            //label="Business Unit"
                                                                            setFieldValue={fieldProps.form.setFieldValue}
                                                                            ////dname="BUDescription"
                                                                            fieldValue={initializeValues(fieldProps.field.value)}
                                                                            options={this.FilterKeywords('Business Unit')}
                                                                            //onChange={formik.handleChange}
                                                                            error={formik.errors.BU && formik.touched.BU
                                                                                ? formik.errors.BU
                                                                                : null}
                                                                            disabled={!this.props.editForm}
                                                                        />
                                                                    );
                                                                }}
                                                            </Field>
                                                        }
                                                        labelPlacement="start"
                                                        label={"Business Unit"}
                                                        className={classes.controlLabel}
                                                    />
                                                </div>
                                            </Tooltip>
                                            {/* 
                                            <Controls.Select
                                                name="PickFrom"
                                                label="Pick up from"
                                                value={formik.values.PickFrom}
                                                options={this.FilterKeywords('PickFrom')}
                                                onChange={formik.handleChange}
                                                setFieldValue={formik.setFieldValue}
                                                error={formik.errors.PickFrom && formik.touched.PickFrom
                                                    ? formik.errors.PickFrom
                                                    : null}
                                                disabled={!this.props.editForm}
                                            /> */}
                                            <Tooltip title={formik.values.BUSegment ? JSON.parse(formik.values.BUSegment).join(',') : "Empty"} arrow placement="right">
                                                <div>
                                                    <FormControlLabel
                                                        disabled={!this.props.editForm}
                                                        control={<Field
                                                            name="BUSegment">
                                                            {(fieldProps) => {
                                                                return (
                                                                    <Controls.MultipleSelect
                                                                        fieldName="BUSegment"
                                                                        //label="BU Segment"
                                                                        setFieldValue={fieldProps.form.setFieldValue}
                                                                        ////dname="BUSegmentDescription"
                                                                        fieldValue={initializeValues(fieldProps.field.value)}
                                                                        options={this.FilterKeywords('BU Segment')}
                                                                        //onChange={formik.handleChange}
                                                                        error={formik.errors.BUSegment && formik.touched.BUSegment
                                                                            ? formik.errors.BUSegment
                                                                            : null}
                                                                        disabled={!this.props.editForm}
                                                                    />
                                                                );
                                                            }}
                                                        </Field>}
                                                        labelPlacement="start"
                                                        label={"BU Segment"}
                                                        className={classes.controlLabel}
                                                    />
                                                </div>
                                            </Tooltip>

                                            <Paper variant='outlined' elevation={1}>

                                                <FormControlLabel
                                                    control={<Controls.Select
                                                        name="VisitorType"
                                                        //label="Visitor Type"
                                                        value={formik.values.VisitorType}
                                                        options={this.FilterKeywords('Visitor Type')}
                                                        onChange={(e) => { formik.handleChange(e); formik.setFieldValue("VisitingPurpose", ""); }}
                                                        setFieldValue={formik.setFieldValue}
                                                        //dname="VisitorTypeDescription"
                                                        error={formik.errors.VisitorType && formik.touched.VisitorType
                                                            ? formik.errors.VisitorType
                                                            : null}
                                                        disabled={!this.props.editForm}
                                                    />}
                                                    labelPlacement="start"
                                                    label={"Visitor Type"}
                                                    className={classes.controlLabel}
                                                />

                                                <FormControlLabel
                                                    control={<Controls.Select
                                                        name="VisitingPurpose"
                                                        //label="Visiting Purpose"
                                                        value={formik.values.VisitingPurpose}
                                                        options={this.FilterKeywords('Visiting Purpose')}
                                                        onChange={formik.handleChange}
                                                        setFieldValue={formik.setFieldValue}
                                                        //dname="VisitingPurposeDescription"
                                                        error={formik.errors.VisitingPurpose && formik.touched.VisitingPurpose
                                                            ? formik.errors.VisitingPurpose
                                                            : null}
                                                        disabled={!this.props.editForm || formik.values.VisitorType != 'BU Customer'}
                                                    />}
                                                    labelPlacement="start"
                                                    label={"Visiting Purpose"}
                                                    className={classes.controlLabel}
                                                />
                                                <div>
                                                    <FormControlLabel
                                                        control={<Field
                                                            as={TextField}
                                                            name="Product"
                                                            variant="outlined"
                                                            error={formik.errors.Product && formik.touched.Product
                                                                ? formik.errors.Product
                                                                : null}
                                                            helperText={formik.errors.Product}
                                                            disabled={!this.props.editForm}
                                                        // multiline
                                                        // rows={3}
                                                        />}
                                                        labelPlacement="start"
                                                        label={"Product"}
                                                        className={classes.controlLabel}
                                                    />
                                                </div>
                                                <Grid item>
                                                    <Tooltip title={formik.values.Application ? formik.values.Application : "Empty"} arrow placement="right">
                                                        <div>
                                                            <FormControlLabel
                                                                disabled={!this.props.editForm}
                                                                control={<Grid item>
                                                                    <Tooltip title='Details'>
                                                                        <IconButton disabled={!this.props.editForm} onClick={() => { this.setOpen("Application", this.props.ApplicationOptions, "Application"); }}>
                                                                            <Menu fontSize="small" />
                                                                        </IconButton>
                                                                    </Tooltip>
                                                                    <Field
                                                                        as={TextField}
                                                                        variant="outlined"
                                                                        style={{ minWidth: 300, maxWidth: 700 }}
                                                                        //label="Application"
                                                                        name="Application"
                                                                        error={formik.errors.Application && formik.touched.Application
                                                                            ? formik.errors.Application
                                                                            : null}
                                                                        helperText={formik.errors.Application}
                                                                        disabled={!this.props.editForm}
                                                                    />
                                                                </Grid>
                                                                }
                                                                labelPlacement="start"
                                                                label={"Application"}
                                                                className={classes.controlLabel}
                                                            />
                                                        </div>
                                                    </Tooltip>
                                                </Grid>

                                                <div>
                                                    <FormControlLabel
                                                        control={<Field
                                                            as={TextField}
                                                            name="GenerateRemark"
                                                            variant="outlined"
                                                            error={formik.errors.GenerateRemark && formik.touched.GenerateRemark
                                                                ? formik.errors.GenerateRemark
                                                                : null}
                                                            helperText={formik.errors.GenerateRemark}
                                                            disabled={!this.props.editForm}
                                                            multiline
                                                            rows={3}
                                                        />}
                                                        labelPlacement="start"
                                                        label={"Visit purpose details"}
                                                        className={classes.controlLabel}
                                                    />
                                                </div>
                                            </Paper>
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    name="CreatedDate"
                                                    variant="outlined"
                                                    disabled={true}
                                                    value={formik.values.CreatedDate}
                                                />}
                                                labelPlacement="start"
                                                label={"Created Date"}
                                                className={classes.controlLabel}
                                            />

                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    //label="Status"
                                                    name="Status"
                                                    disabled={true}
                                                />}
                                                labelPlacement="start"
                                                label={"Status"}
                                                className={classes.controlLabel}
                                            />
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    //className={classes.textField}
                                                    //style={{'border-radius': '50px,50px,0,0'}}
                                                    //label="Applicant Contact Number"
                                                    name="ApplicantContactNumber"
                                                    error={formik.errors.ApplicantContactNumber && formik.touched.ApplicantContactNumber
                                                        ? formik.errors.ApplicantContactNumber
                                                        : null}
                                                    helperText={formik.errors.ApplicantContactNumber}
                                                    disabled={!this.props.editForm}
                                                />}
                                                labelPlacement="start"
                                                label={"Applicant Contact Number"}
                                                className={classes.controlLabel}
                                            />
                                            <Tooltip title={formik.values.SalesRegion ? JSON.parse(formik.values.SalesRegion).join(',') : "Empty"} arrow placement="top">
                                                <span>
                                                    <FormControlLabel
                                                        disabled={!this.props.editForm}
                                                        control={<Field
                                                            name="SalesRegion">
                                                            {(fieldProps) => {
                                                                return (
                                                                    <Controls.MultipleSelect
                                                                        fieldName="SalesRegion"
                                                                        //label="Sales Region"
                                                                        setFieldValue={fieldProps.form.setFieldValue}
                                                                        ////dname="SalesRegionDescription"
                                                                        fieldValue={initializeValues(fieldProps.field.value)}
                                                                        options={this.FilterKeywords('Sales Region')}
                                                                        //onChange={formik.handleChange}
                                                                        error={formik.errors.SalesRegion && formik.touched.SalesRegion
                                                                            ? formik.errors.SalesRegion
                                                                            : null}
                                                                        disabled={!this.props.editForm}
                                                                    />
                                                                );
                                                            }}

                                                        </Field>}
                                                        labelPlacement="start"
                                                        label={"Sales Region"}
                                                        className={classes.controlLabel}
                                                    />
                                                </span>
                                            </Tooltip>
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    required
                                                    name="HostName"
                                                    error={formik.errors.HostName && formik.touched.HostName
                                                        ? formik.errors.HostName
                                                        : null}
                                                    helperText={formik.errors.HostName}
                                                    disabled={!this.props.editForm}
                                                />}
                                                labelPlacement="start"
                                                label={"Host Name"}
                                                className={classes.controlLabel}
                                            />
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    name="HostContactNo"
                                                    error={formik.errors.HostContactNo && formik.touched.HostContactNo
                                                        ? formik.errors.HostContactNo
                                                        : null}
                                                    helperText={formik.errors.HostContactNo}
                                                    disabled={!this.props.editForm}
                                                />}
                                                labelPlacement="start"
                                                label={"Host Contact No."}
                                                className={classes.controlLabel}
                                            />
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    name="HostJobTitleDept"
                                                    error={formik.errors.HostJobTitleDept && formik.touched.HostJobTitleDept
                                                        ? formik.errors.HostJobTitleDept
                                                        : null}
                                                    helperText={formik.errors.HostJobTitleDept}
                                                    disabled={!this.props.editForm}
                                                />}
                                                labelPlacement="start"
                                                label={"Host Job Title/Dept."}
                                                className={classes.controlLabel}
                                            />
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    variant="outlined"
                                                    name="Others"
                                                    error={formik.errors.Others && formik.touched.Others
                                                        ? formik.errors.Others
                                                        : null}
                                                    helperText={formik.errors.Others}
                                                    disabled={!this.props.editForm}
                                                />}
                                                labelPlacement="start"
                                                label={"Others"}
                                                className={classes.controlLabel}
                                            />
                                            <FormControlLabel
                                                control={<Controls.Select
                                                    name="FinalApprover"
                                                    value={formik.values.FinalApprover}
                                                    //options={this.FilterFinalApproverOptions(formik.values.VisitorType)}
                                                    options={this.FilterKeywords("Final Approver")}
                                                    onChange={formik.handleChange}
                                                    setFieldValue={formik.setFieldValue}
                                                    //dname="FinalApproverDescription"
                                                    error={formik.errors.FinalApprover && formik.touched.FinalApprover
                                                        ? formik.errors.FinalApprover
                                                        : null}
                                                    disabled={!this.props.editForm}
                                                />}
                                                labelPlacement="start"
                                                label={"Final Approver"}
                                                className={classes.controlLabel}
                                            />
                                            <FormControlLabel
                                                control={<Field
                                                    as={TextField}
                                                    name="SubmittedDate"
                                                    variant="outlined"
                                                    disabled={true}
                                                    value={formik.values.SubmittedDate}
                                                />}
                                                labelPlacement="start"
                                                label={"Submitted Date"}
                                                className={classes.controlLabel}
                                            />
                                        </Grid>
                                    </Grid>
                                </Paper>
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            name="VisitorDetails"
                                        >
                                            {(fieldProps) => {
                                                if (this.props.editForm)
                                                    return (
                                                        <_MaterialTable
                                                            Title="Visitor Details"
                                                            data={initializeValues(fieldProps.field.value)}
                                                            setFieldValue={fieldProps.form.setFieldValue}
                                                            fieldName="VisitorDetails"
                                                            columns={VisitorDetailsColumns}
                                                            validate={validateVisitorDetail}
                                                            error={formik.errors.VisitorDetails && formik.touched.VisitorDetails
                                                                ? formik.errors.VisitorDetails
                                                                : null}
                                                        />);
                                                else
                                                    return (
                                                        <_MaterialTable_Read
                                                            Title="Visitor Details"
                                                            data={initializeValues(fieldProps.field.value)}
                                                            columns={VisitorDetailsColumns}
                                                        />);
                                            }}
                                        </Field>
                                    </Grid>

                                    <Grid item xs={12} sm={12}>
                                        <Field
                                            name="TourPlan"
                                        >
                                            {(fieldProps) => {
                                                if (this.props.editForm)
                                                    return (
                                                        <TourPlan
                                                            data={initializeValues(fieldProps.field.value)}
                                                            setFieldValue={fieldProps.form.setFieldValue}
                                                            fieldName="TourPlan"
                                                            LocationOptions={this.props.LocationOptions}
                                                            error={formik.errors.TourPlan && formik.touched.TourPlan
                                                                ? formik.errors.TourPlan
                                                                : null}
                                                        />
                                                    );
                                                else
                                                    return (
                                                        <TourPlan_Read
                                                            data={initializeValues(fieldProps.field.value)}
                                                            setFieldValue={fieldProps.form.setFieldValue}
                                                            fieldName="TourPlan"
                                                            LocationOptions={this.props.LocationOptions}
                                                        />
                                                    );
                                            }}
                                        </Field>
                                    </Grid>
                                </Grid>

                                <Controls.DialogMultipleSelect
                                    options={this.state.options}
                                    title={this.state.title}
                                    open={this.state.open}
                                    handleCancel={this.handleCancel}
                                    handleOK={(checked) => {
                                        formik.setFieldValue(this.state.fieldName, checked.join(','));
                                        this.setState({ open: false, options: [], fieldName: '', title: '' });
                                    }} />

                                <Controls.AlertDialogSlide open={this.state.openAlert} HandleOK={this.handleOK} message="Visiting date should not be less than 3 days from the day of submision.You can only save it as draft and get email approval from your SVP." />
                            </form>)}

                    </Formik>
                    <Grid item>
                        {!(this.initialValues.ID == null) ? '' :
                            <div className={classes.root}>
                                <input className={classes.input} id="file"
                                    multiple={true}
                                    type="file"
                                    onChange={this.addFile.bind(this)} required />
                                <label htmlFor="file">
                                    <div>
                                        <Button variant="contained" component="span"
                                            className={classes.button}
                                            startIcon={<CloudUploadIcon />}>
                                            Upload</Button>
                                        <span style={{ fontSize: 14 }}>You may upload your agenda, hotel and logistics arrangement, tour plan, Health Declaration Form, and other related information, preferrably in WORD, PPT, PDF, or JPEG format.</span>
                                    </div>
                                </label>
                                <p>Selected Attachments:</p>
                                <div id="fileList"></div>
                            </div>
                        }
                        {(this.initialValues.ID == null) ? '' :
                            <div>
                                <ListItemAttachments listId={this.props.listID}
                                    itemId={this.initialValues.ID}
                                    context={this.props.context}
                                    disabled={!this.props.editForm}
                                    openAttachmentsInNewWindow={true}
                                />
                            </div>
                        }
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <MuiTypography>
                            <pre style={{ fontFamily: 'inherit' }}>
                                {this.initialValues.ApprovalHistory}
                            </pre>
                        </MuiTypography>
                    </Grid>
                </Paper>


            </>
        );
    }
}
export default withStyles(styles)(FvpForm);


/*
<IconButton edge="start"
                                            color="inherit"
                                            onClick={this.props.closeForm}
                                            aria-label="close">
                                            <CloseIcon /> </IconButton>
*/


/*
<Button
                                            autoFocus
                                            color="inherit"
                                            disabled
                                            //disabled={!(this.props.userRoles.indexOf("Admin") != -1 && formik.values.Status.includes("Draft") && !formik.isSubmitting)}
                                            onClick={() => { this.onApprove(formik); }}
                                        >Approve</Button>
*/


/*
<div>
                                            <Field
                                                as={TextField}
                                                variant="standard"
                                                label="Motor Series"
                                                name="MotorSeries"
                                                error={formik.errors.MotorSeries && formik.touched.MotorSeries
                                                    ? formik.errors.MotorSeries
                                                    : null}
                                                helperText={formik.errors.MotorSeries}
                                                disabled={!this.props.editForm}
                                            /> <Tooltip title='Motor Series Details'>
                                                <IconButton disabled={!this.props.editForm}>
                                                    <Menu fontSize="small" onClick={() => { this.setOpen("MotorSeries", this.props.MotorSeriesOptions, "Motor Series"); }} />
                                                </IconButton>
                                            </Tooltip>
                                        </div>
*/

/*
<Controls.Select
                                            name="MarketingCoordinator"
                                            label="Marketing Coordinator"
                                            value={formik.values.MarketingCoordinator}
                                            options={this.props.MarketingCoordinatorOptions}
                                            onChange={formik.handleChange}
                                            setFieldValue={formik.setFieldValue}
                                            dname="MarketingCoordinatorDescription"
                                            error={formik.errors.MarketingCoordinator && formik.touched.MarketingCoordinator
                                                ? formik.errors.MarketingCoordinator
                                                : null}
                                            disabled={!this.props.editForm}
                                        />
*/