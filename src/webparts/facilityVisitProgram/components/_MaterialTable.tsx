import * as React from "react";
import MaterialTable from "material-table";
import { forwardRef } from "react";
import AddBox from "@material-ui/icons/AddBox";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import Check from "@material-ui/icons/Check";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import Clear from "@material-ui/icons/Clear";
import DeleteOutline from "@material-ui/icons/DeleteOutline";
import Edit from "@material-ui/icons/Edit";
import FilterList from "@material-ui/icons/FilterList";
import FirstPage from "@material-ui/icons/FirstPage";
import LastPage from "@material-ui/icons/LastPage";
import Remove from "@material-ui/icons/Remove";
import SaveAlt from "@material-ui/icons/SaveAlt";
import Search from "@material-ui/icons/Search";
import ViewColumn from "@material-ui/icons/ViewColumn";
import { FormControl, FormHelperText, TextField, Button, makeStyles, createStyles, Theme } from '@material-ui/core';
import { orange } from "@material-ui/core/colors";


const useStyles = makeStyles((theme: Theme) => createStyles({
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


export default function _MaterialTable(fprops) {
    const { error, validate } = fprops;
    const [state, setState] = React.useState({
        columns: fprops.columns,
        data: fprops.data,
        verror: false,
        verrormsg: '',
        //fieldName: props.fieldName,
        //Title: props.Title,
        //edit: props.edit
    });


    const [verror, setverror] = React.useState(false);
    const [verrormsg, setverrormsg] = React.useState('');
    React.useEffect(
        () => {
            setState({ ...state, data: fprops.data });
        }, [fprops.data]
    );


    const classes = useStyles();

    const AddIcon = (props) => { return (<Button className={classes.button}>Add</Button>); };
    const tableIcons = {
        Add: forwardRef<SVGSVGElement>((props, ref) => <AddIcon {...props} ref={ref} />),
        Check: forwardRef<SVGSVGElement>((props, ref) => <Check {...props} ref={ref} />),
        Clear: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
        Delete: forwardRef<SVGSVGElement>((props, ref) => <DeleteOutline {...props} ref={ref} />),
        DetailPanel: forwardRef<SVGSVGElement>((props, ref) => (
            <ChevronRight {...props} ref={ref} />
        )),
    
        Edit: forwardRef<SVGSVGElement>((props, ref) => <Edit {...props} ref={ref} />),
        Export: forwardRef<SVGSVGElement>((props, ref) => <SaveAlt {...props} ref={ref} />),
        Filter: forwardRef<SVGSVGElement>((props, ref) => <FilterList {...props} ref={ref} />),
        FirstPage: forwardRef<SVGSVGElement>((props, ref) => <FirstPage {...props} ref={ref} />),
        LastPage: forwardRef<SVGSVGElement>((props, ref) => <LastPage {...props} ref={ref} />),
        NextPage: forwardRef<SVGSVGElement>((props, ref) => <ChevronRight {...props} ref={ref} />),
        PreviousPage: forwardRef<SVGSVGElement>((props, ref) => (
            <ChevronLeft {...props} ref={ref} />
        )),
        ResetSearch: forwardRef<SVGSVGElement>((props, ref) => <Clear {...props} ref={ref} />),
        Search: forwardRef<SVGSVGElement>((props, ref) => <Search {...props} ref={ref} />),
        SortArrow: forwardRef<SVGSVGElement>((props, ref) => <ArrowDownward {...props} ref={ref} />),
        ThirdStateCheck: forwardRef<SVGSVGElement>((props, ref) => <Remove {...props} ref={ref} />),
        ViewColumn: forwardRef<SVGSVGElement>((props, ref) => <ViewColumn {...props} ref={ref} />)
    };

    return (
        <>
            <FormControl {...(error && { error: true })}>
                {error && <FormHelperText>{error}</FormHelperText>}
            </FormControl>
            <FormControl error={verror}>
                <FormHelperText>{verrormsg}</FormHelperText>
            </FormControl>

            <MaterialTable
                icons={tableIcons}
                title={fprops.Title}
                options={{
                    search: false,
                    searchFieldStyle: { width: "50%" },
                    searchFieldAlignment: 'right',
                    paging: true,
                    actionsColumnIndex:-1,
                }
                }
                columns={state.columns}
                data={state.data}
                editable={
                    {
                        onRowAdd: (newData) =>
                            new Promise((resolve, reject) => {
                                var v = validate(newData);
                                if (v.length == 0) {
                                    setverror(false);
                                    setverrormsg('');
                                    setTimeout(() => {
                                        resolve();
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            data.push(newData);
                                            fprops.setFieldValue(fprops.fieldName, JSON.stringify(data, null, 2));
                                            return { ...prevState, data };
                                        });
                                    }, 600);
                                }
                                else {
                                    setverror(true);
                                    setverrormsg(v.join(','));
                                    reject();
                                }
                            }),
                        onRowUpdate: (newData, oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    if (oldData) {
                                        setState((prevState) => {
                                            const data = [...prevState.data];
                                            data[data.indexOf(oldData)] = newData;
                                            fprops.setFieldValue(fprops.fieldName, JSON.stringify(data, null, 2));
                                            return { ...prevState, data };
                                        });
                                    }
                                }, 600);
                            }),

                        onRowDelete: (oldData) =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                    setState((prevState) => {
                                        const data = [...prevState.data];
                                        data.splice(data.indexOf(oldData), 1);
                                        if (data.length > 0)
                                            fprops.setFieldValue(fprops.fieldName, JSON.stringify(data, null, 2));
                                        else
                                            fprops.setFieldValue(fprops.fieldName, '');
                                        return { ...prevState, data };
                                    });
                                }, 600);
                            })
                    }
                }
            />
        </>
    );

}
