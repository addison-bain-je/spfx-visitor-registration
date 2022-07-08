import * as React from "react";
import { Grid, IconButton, Typography, TablePagination, DialogTitle, DialogContent, Slide, DialogActions, Button } from '@material-ui/core';
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
import Check from "@material-ui/icons/Check";
import Clear from "@material-ui/icons/Clear";
const useStyles = makeStyles((theme: Theme) => ({
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
    }

}));
const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});


export default function TourPlan_Read(props) {
    const [state, setState] = React.useState({
        data: props.data,
    });
    const [showDialog, setshowDialog] = React.useState(false);
    const [itemDetails, setItemDetails] = React.useState({
        Date: '',
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
            props.setFieldValue(props.fieldName, data);
            return { ...prevState, data };
        });
    };
    const onRowUpdate = (nData, oData) => {

        setState((prevState) => {
            const data = [...prevState.data];
            data[data.indexOf(oData)] = nData;
            props.setFieldValue(props.fieldName, data);
            return { ...prevState, data };
        });

    };
    const onRowDelete = (dData) => {
        setState((prevState) => {
            const data = [...prevState.data];
            data.splice(data.indexOf(dData), 1);
            props.setFieldValue(props.fieldName, data);
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
    
    const classes = useStyles();
    return (
        <>
            <Paper className={classes.root}>
                <div className={classes.title}>
                    <Grid container justify="flex-start">
                        <Typography variant='h6'>Tour Plans</Typography>
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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {state.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                        <TableRow>
                                            <TableCell align="left">{row.Date}</TableCell>
                                            <TableCell align="left">{row.sTime+"--"+row.eTime}</TableCell>
                                            <TableCell align="left">{row.VisitArea}</TableCell>
                                            <TableCell align="left">{row.PlantCode}</TableCell>
                                            <TableCell align="left">{row.Block}</TableCell>
                                            <TableCell align="left">{row.Floor}</TableCell>
                                            <TableCell align="left">{row.Torguide}</TableCell>
                                            <TableCell align="left">{row.ExtNo}</TableCell>
                                            <TableCell align="left">{row.MobileNo}</TableCell>
                                            <TableCell align="left">{row.LocationApprover}</TableCell>
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
            >
                <DialogTitle>Tour Plan</DialogTitle>
                <DialogContent>
                    <TourPlanForm
                        setClose={setClose}
                        itemDetails={itemDetails}
                        onRowAdd={onRowAdd}
                        onRowUpdate={onRowUpdate}
                        edit={edit}
                    />

                </DialogContent>
                <DialogActions>
                    <Button color="primary" type="submit" form="TourPlanForm"> save</Button>
                    <Button color="primary" onClick={setClose}>Cancel</Button>
                </DialogActions>
            </MuiDialog>
        </>
    );
}
