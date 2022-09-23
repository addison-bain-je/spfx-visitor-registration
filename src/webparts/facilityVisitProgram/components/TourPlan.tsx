import * as React from "react";
import { Grid, IconButton, Typography, TablePagination, DialogTitle, DialogContent, Slide, DialogActions, Button, Divider, Tooltip, createStyles } from '@material-ui/core';
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import AddBox from "@material-ui/icons/AddBox";
import Edit from "@material-ui/icons/Edit";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MuiDialog from '@material-ui/core/Dialog';
import { TransitionProps } from '@material-ui/core/transitions';
import TourPlanForm from './TourPlanForm';
import { FormControl, FormHelperText } from '@material-ui/core';
import { orange } from "@material-ui/core/colors";
const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        width: '100%',
    },
    title: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(1.2)
    },
    table: {
        minWidth: 1300,
    },
    container: {
        maxHeight: 840,
        minHeight: 300,

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
        fontSize: 14,
        textTransform: 'none',
        padding: 0,
        minWidth: 40,
    }

}));
const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function TourPlan(props) {
    const { error } = props;
    const [state, setState] = React.useState({
        data: props.data,
    });

    const [showDialog, setshowDialog] = React.useState(false);
    const [itemDetails, setItemDetails] = React.useState({
        Date: new Date().toDateString(),
        sTime: '',
        eTime: '',
        VisitArea: '',
        PlantCode: '',
        Block: '',
        Floor: '',
        Torguide: '',
        ExtNo: '',
        MobileNo: '',
        LocationApprover: '',
    });
    const [edit, setEdit] = React.useState(false);
    React.useEffect(
        () => {
            setState({ ...state, data: props.data });
        }, [props.data]
    );
    const onRowAdd = (newData) => {
        setState((prevState) => {
            const data = [...prevState.data];
            data.push(newData);
            props.setFieldValue(props.fieldName, JSON.stringify(data, null, 2));
            return { ...prevState, data };
        });
    };
    const onRowUpdate = (nData, oData) => {

        setState((prevState) => {
            const data = [...prevState.data];
            data[data.indexOf(oData)] = nData;
            props.setFieldValue(props.fieldName, JSON.stringify(data, null, 2));
            return { ...prevState, data };
        });

    };
    const onRowDelete = (dData) => {
        setState((prevState) => {
            const data = [...prevState.data];
            data.splice(data.indexOf(dData), 1);
            if (data.length > 0)
                props.setFieldValue(props.fieldName, JSON.stringify(data, null, 2));
            else
                props.setFieldValue(props.fieldName, '');
            return { ...prevState, data };
        });
    };


    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const setClose = () => {
        setshowDialog(false);
        // setState({ ...state, showDialog: false });
        setEdit(false);
        setItemDetails({
            Date: new Date().toDateString(),
            sTime: '',
            eTime: '',
            VisitArea: '',
            PlantCode: '',
            Block: '',
            Floor: '',
            Torguide: '',
            ExtNo: '',
            MobileNo: '',
            LocationApprover: '',
        });

    };
    const setOpen = () => {
        setshowDialog(true);
        //setState({ ...state, showDialog: true });
    };

    const classes = useStyles();
    return (
        <>
            <FormControl {...(error && { error: true })}>
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
            <Paper className={classes.root}>
                <div className={classes.title}>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Grid container justify="flex-start">
                                <Typography variant='h6'>Tour Plans</Typography>
                            </Grid>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Grid container justify="flex-end">
                                <Tooltip title='Add'>
                                    <IconButton onClick={setOpen}>
                                        <Button className={classes.button} >Add</Button>
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
                <Grid container>
                    <Grid item xs={12} sm={12}>
                        <TableContainer className={classes.container}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Date</TableCell>
                                        <TableCell align="left">Time</TableCell>
                                        <TableCell align="left">Visit Area</TableCell>
                                        <TableCell align="left">Plant Code</TableCell>
                                        <TableCell align="left">Block</TableCell>
                                        <TableCell align="left">Floor</TableCell>
                                        <TableCell align="left">Tour Guide</TableCell>
                                        <TableCell align="left">Ext No</TableCell>
                                        <TableCell align="left">Mobile No</TableCell>
                                        <TableCell align="left">Location Approver</TableCell>
                                        <TableCell align="left">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow hover key={row.Date + row.sTime + row.eTime + row.VisitArea}>
                                            <TableCell align="left">{row.Date}</TableCell>
                                            <TableCell align="left">{row.sTime + "--" + row.eTime}</TableCell>
                                            <TableCell align="left">{row.VisitArea}</TableCell>
                                            <TableCell align="left">{row.PlantCode}</TableCell>
                                            <TableCell align="left">{row.Block}</TableCell>
                                            <TableCell align="left">{row.Floor}</TableCell>
                                            <TableCell align="left">{row.Torguide}</TableCell>
                                            <TableCell align="left">{row.ExtNo}</TableCell>
                                            <TableCell align="left">{row.MobileNo}</TableCell>
                                            <TableCell align="left">{row.LocationApprover}</TableCell>
                                            <TableCell align="left">
                                                <Grid container>
                                                    <Grid item>
                                                        <IconButton size="small" >
                                                            <Edit fontSize="small" onClick={() => { setItemDetails(row); setEdit(true); setOpen(); }} />
                                                        </IconButton>
                                                        <IconButton size="small" >
                                                            <DeleteOutline fontSize="small" onClick={() => { onRowDelete(row); }} />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 20]}
                            component="div"
                            count={state.data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <MuiDialog
                className={classes.dialogroot}
                open={showDialog}
                TransitionComponent={Transition}
                fullWidth={true}
                maxWidth={"md"}
            >
                <DialogTitle>Tour Plan</DialogTitle>
                <DialogContent>
                    <TourPlanForm
                        setClose={setClose}
                        itemDetails={itemDetails}
                        onRowAdd={onRowAdd}
                        onRowUpdate={onRowUpdate}
                        edit={edit}
                        LocationOptions={props.LocationOptions}
                    />
                </DialogContent>

            </MuiDialog>
        </>
    );
}

/*
<Tooltip title='Add'>
                                    <IconButton>
                                        <AddBox fontSize="default" onClick={setOpen} />
                                    </IconButton>
                                </Tooltip>
                                */