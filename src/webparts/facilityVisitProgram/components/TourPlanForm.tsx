import * as React from "react";
import * as Yup from 'yup';
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Formik, Field } from 'formik';
import { Grid, TextField, Divider, Paper, createStyles, Slide, DialogTitle, DialogContent, DialogActions, IconButton, Button, Tooltip, DialogContentText, Dialog, } from '@material-ui/core';
import Controls from "./controls/Controls";
import Menu from "@material-ui/icons/Menu";
import MuiDialog from '@material-ui/core/Dialog';
import { TransitionProps } from '@material-ui/core/transitions';
import LocationSelect from './LocationSelect';
import { orange } from '@material-ui/core/colors';
import { differenceInDays } from "date-fns";
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '80%',
                margin: theme.spacing(1),
            }
        },
        dialogroot: {
            width: '100%',
            maxWidth: '100%',
            margin: theme.spacing(1),
            padding: theme.spacing(2),
        },
        button: {
            color: theme.palette.getContrastText(orange[500]),
            backgroundColor: orange[500],
            '&:hover': {
                backgroundColor: orange[700],
            },
            //fontSize: 10,
            textTransform: 'none'
        }
    }),
);
const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="left" ref={ref} {...props} />;
});


const validationSchema =
    Yup.object({

        Date: Yup.string().required("required"),
        sTime: Yup.string().required("required"),
        eTime: Yup.string().required("required"),
        VisitArea: Yup.string().required("required"),
        PlantCode: Yup.string().required("required"),
        Block: Yup.string().required("required"),
        Floor: Yup.string().required("required"),
        Torguide: Yup.string().required("required"),
        ExtNo: Yup.string().required("required"),
        MobileNo: Yup.string().required("required"),
        LocationApprover: Yup.string().required("required"),

    });

export default function TourPlanForm(props) {
    const classes = useStyles();
    const { setClose, itemDetails, onRowAdd, onRowUpdate, edit, LocationOptions } = props;
    var selectedItem: any;
    const [showDialog, setshowDialog] = React.useState(false);
    const [showConfirmDialog, setshowConfirmDialog] = React.useState(false);
    //const [selectedItem, setSelectedItem] = React.useState({});
    const onSubmit = (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
            setSubmitting(false);
            
                if (edit) {
                    onRowUpdate(values, itemDetails);
                }
                else {
                    onRowAdd(values);
                }
                resetForm();
                setClose();


            

        }, 1000);
    };

    const setDialogOpen = () => {
        setshowDialog(true);
    };
    const setDialogClose = () => {
        setshowDialog(false);
    };

    const _getSelection = (item) => {
        selectedItem = item;
    };

    const handleOK = (formik) => {
        //console.log(selectedItem);
        if (selectedItem != null) {
            formik.values.Block = selectedItem[0].Block;
            formik.values.Floor = selectedItem[0].Floor;
           // formik.values.VisitArea = selectedItem[0].PlantArea+'-'+selectedItem[0].Department;
           formik.values.VisitArea = selectedItem[0].AreaDescription;
            formik.values.PlantCode = selectedItem[0].Plant;
            formik.values.ExtNo = selectedItem[0].ExtNo;
            formik.values.MobileNo = selectedItem[0].MobileNo;
            formik.values.Torguide = selectedItem[0].NameinEnglish;
            formik.values.LocationApprover = selectedItem[0].LocationApprover;
            formik.setValues(formik.values);
            setDialogClose();
        }
        else
            alert("Please choose one location or click 'cancel' button to cancel");
    };

    return (
        <>

            <Formik
                initialValues={itemDetails}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {(formik) => (
                    <>
                        <Paper>
                            <form id="TourPlanForm" className={classes.root} autoComplete="off" onReset={() => { formik.handleReset(); }} onSubmit={formik.handleSubmit} >

                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Grid container justify="flex-end">
                                            <Button
                                                className={classes.button}
                                                variant="contained"
                                                size="small"
                                                //color="primary"
                                                onClick={setDialogOpen}>
                                                Select Location
                                            </Button>
                                        </Grid>

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            name="Date"
                                        >
                                            {(fieldProps) => {
                                                return (
                                                    <Controls.DatePicker
                                                        label="Date"
                                                        name="Date"
                                                        size="small"
                                                        value={() => {
                                                            if (formik.values.Date == '')
                                                                return (new Date());
                                                            else
                                                                return (new Date(formik.values.Date));
                                                        }}
                                                        setFieldValue={fieldProps.form.setFieldValue}
                                                        error={formik.errors.Date && formik.touched.Date
                                                            ? formik.errors.Date
                                                            : null}
                                                    />
                                                );
                                            }}
                                        </Field>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <div>
                                            <Field
                                                as={TextField}
                                                variant="standard"
                                                label="Time Slot"
                                                name="sTime"
                                                style={{ width: '39%' }}
                                                type="time"
                                                defaultValue="00:00:00"
                                                error={formik.errors.sTime && formik.touched.sTime}
                                                helperText={formik.errors.sTime}
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                            />
                                            <Field
                                                as={TextField}
                                                variant="standard"
                                                label="   "
                                                name="eTime"
                                                style={{ width: '39%' }}
                                                type="time"
                                                defaultValue="00:00:00"
                                                error={formik.errors.eTime && formik.touched.eTime}
                                                helperText={formik.errors.eTime}
                                                size="small"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                inputProps={{
                                                    step: 300, // 5 min
                                                }}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>


                                <Grid container>

                                    <Grid item xs={12} sm={6}>

                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Plant Code"
                                            name="PlantCode"
                                            error={formik.errors.PlantCode && formik.touched.PlantCode}
                                            helperText={formik.errors.PlantCode}
                                            size="small"
                                            disabled
                                        />
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Floor"
                                            name="Floor"
                                            error={formik.errors.Floor && formik.touched.Floor}
                                            helperText={formik.errors.Floor}
                                            size="small"
                                            disabled
                                        />
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Ext No"
                                            name="ExtNo"
                                            error={formik.errors.ExtNo && formik.touched.ExtNo}
                                            helperText={formik.errors.ExtNo}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Location Approver"
                                            name="LocationApprover"
                                            error={formik.errors.LocationApprover && formik.touched.LocationApprover}
                                            helperText={formik.errors.LocationApprover}
                                            size="small"
                                            disabled
                                        />

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Visit Area"
                                            name="VisitArea"
                                            error={formik.errors.VisitArea && formik.touched.VisitArea}
                                            helperText={formik.errors.VisitArea}
                                            size="small"
                                            disabled
                                        />
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Block"
                                            name="Block"
                                            error={formik.errors.Block && formik.touched.Block}
                                            helperText={formik.errors.Block}
                                            size="small"
                                            disabled
                                        />
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Tour Guide"
                                            name="Torguide"
                                            error={formik.errors.Torguide && formik.touched.Torguide}
                                            helperText={formik.errors.Torguide}
                                            size="small"
                                        />
                                        <Field
                                            as={TextField}
                                            variant="standard"
                                            label="Mobile No"
                                            name="MobileNo"
                                            error={formik.errors.MobileNo && formik.touched.MobileNo}
                                            helperText={formik.errors.MobileNo}
                                            size="small"
                                        />

                                    </Grid>
                                </Grid>
                                <MuiDialog
                                    //className={classes.dialogroot}
                                    open={showDialog}
                                    TransitionComponent={Transition}
                                    fullWidth={true}
                                    maxWidth={"lg"}

                                >
                                    <DialogTitle>Please select a location:</DialogTitle>
                                    <DialogContent>
                                        <LocationSelect
                                            data={LocationOptions}
                                            _getSelection={_getSelection}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button color="primary" onClick={() => {
                                            handleOK(formik);
                                        }}>Ok</Button>
                                        <Button color="primary" onClick={setDialogClose}>Cancel</Button>
                                    </DialogActions>
                                </MuiDialog>



                                <Dialog
                                    open={showConfirmDialog}
                                    TransitionComponent={Transition}
                                    keepMounted
                                    aria-labelledby="alert-dialog-slide-title"
                                    aria-describedby="alert-dialog-slide-description"
                                >
                                    <DialogTitle id="alert-dialog-slide-title">{"Confirmation!"}</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText id="alert-dialog-slide-description">
                                        Visiting date should not be less than 3 days from the day of submision.You can only save it as draft and get email approval from your SVP.
                                        </DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button variant="contained" className={classes.button} onClick={(e)=>{formik.handleSubmit();setshowConfirmDialog(false);}}>Save anyway</Button>
                                        <Button variant="contained" className={classes.button} onClick={(e)=>setshowConfirmDialog(false)} >Back to modify</Button>
                                    </DialogActions>
                                </Dialog>





                            </form>
                        </Paper>
                        <DialogActions>
                            <Button color="primary" onClick={() => {
                                if (differenceInDays(new Date(formik.values.Date), new Date()) < 2) {
                                    setshowConfirmDialog(true);
                                }
                                else {
                                    //alert('validation passed!');
                                    formik.handleSubmit();
                                    //setClose();
                                }
                            }}>Ok</Button>
                            <Button color="primary" onClick={setClose}>Cancel</Button>
                        </DialogActions>



                    </>
                )}
            </Formik>


        </>
    );
}




/*
classes={{
                                    paper: classes.dialogroot,
                                  }}
                                                                       */