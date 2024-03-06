
import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { service } from '../service/service';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, DialogTitle, Button, Typography, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { LocationItem, } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import LocationForm from './LocationForm';
import { orange } from '@material-ui/core/colors';
const styles = (theme: Theme) =>
    createStyles({
        button: {
            textTransform: 'none',
            color: orange[500],
        },
        viewtitle: {
            color: orange[500],
        },
        dialogroot: {
            width: '100%',
            maxWidth: '100%',
            margin: theme.spacing(1),
            padding: theme.spacing(2),
        }
    });

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IDataTableState {
    ListData: LocationItem[];
    showForm: boolean;
    _LocationItem: LocationItem;
    editForm: boolean;
}

interface IProps {
    context: WebPartContext;
    classes?: any;
    IsAdmin: boolean;
}
/*
const groupByFields: IGrouping[] = [{
    name: 'BU',
    order: GroupOrder.descending
}];
*/

class LocationDataTable extends React.Component<IProps, IDataTableState>{
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];

    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            showForm: false,
            editForm: true,
            _LocationItem: {
                ID: null,
                PlantArea: '',
                AreaDescription: '',
                Department: '',
                LocationCode: '',
                Block: '',
                Floor: '',
                Plant: '',
                NameinEnglish: '',
                NameinChinese: '',
                ExtNo: '',
                MobileNo: '',
                AMSession: '',
                PMSession: '',
                LocationApprover: '',
                HasRestrictArea: '',
             //   LocationApproverEmail: '',
            },

        };
        this._service = new service(props.context);
        this._selection = [];

        this.viewFields = [

            {
                name: 'PlantArea',
                displayName: 'Plant Area',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return <Link style={{ color: 'orange' }}
                        onClick={() => {
                            this.openForm("Location", item['ID'], false);
                        }}
                    >{item['PlantArea']}</Link>;
                }
            },
            {
                name: 'AreaDescription',
                displayName: 'Area Description',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250
            },
            {
                name: 'Department',
                displayName: 'Department',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250
            },
            {
                name: 'LocationCode',
                displayName: 'LocationCode',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250
            },
            {
                name: 'LocationApprover',
                displayName: 'LocationApprover',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250
            },
            {
                name: 'HasRestrictArea',
                displayName: 'Has Restrict Area',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250
            },

        ];


    }
    private _getSelection = (items: LocationItem[]) => {
        this._selection = items;
    }

    private getData(): void {
        this._service.getAllrecords("Location").then((result: LocationItem[]) => {
            this.setState({ ListData: result });
        });

    }

    private openForm(listname: string, id: number, edit: boolean): void {
        this._service.getItemById(listname, id).then((item) => { this.setState({ showForm: true, editForm: edit, _LocationItem: item }); });
    }
    private editForm(): void {
        this.setState({ showForm: true, editForm: true });
    }

    public componentDidMount() {
        this.getData();
    }

    private closeForm(): void {
        this.setState({
            showForm: false,
            _LocationItem: {
                ID: null,
                PlantArea: '',
                AreaDescription: '',
                Department: '',
                LocationCode: '',
                Block: '',
                Floor: '',
                Plant: '',
                NameinEnglish: '',
                NameinChinese: '',
                ExtNo: '',
                MobileNo: '',
                AMSession: '',
                PMSession: '',
                LocationApprover: '',
                HasRestrictArea: '',
               // LocationApproverEmail: '',
            }
        });
    }

    public render() {
        const { classes } = this.props;
        return (
            <>
                <div>
                    <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle} variant='subtitle2'>Location Profile</Typography>
                    </Grid>
                    {!this.props.IsAdmin ? null : <div>
                        <Button
                            className={classes.button}
                            variant="text"
                            startIcon={<AddIcon />}
                            color="primary"
                            onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>
                            New Location
                        </Button>
                    </div>}
                    <ListView
                        items={this.state.ListData}
                        showFilter={true}
                        filterPlaceHolder="Search..."
                        compact={false}
                        selectionMode={SelectionMode.none}
                        selection={this._getSelection}
                        //groupByFields={groupByFields}
                        viewFields={this.viewFields}
                    ></ListView>


                    <MuiDialog
                        className={classes.dialogroot}
                        open={this.state.showForm}
                        TransitionComponent={Transition}
                        fullWidth={true}
                        maxWidth={"lg"}
                    >
                        <DialogTitle>Location Profile</DialogTitle>
                        <DialogContent>

                            <LocationForm
                                context={this.props.context}
                                formInitialValues={this.state._LocationItem}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                editForm={this.state.editForm}
                            />

                        </DialogContent>
                        <DialogActions>
                            {!this.props.IsAdmin ? null :
                                <div>
                                    <Button color="primary" type="submit" form="locatoinForm" disabled={!this.state.editForm}> save</Button>
                                    <Button color="primary" disabled={this.state.editForm} onClick={this.editForm.bind(this)}> Edit</Button>
                                </div>}
                            <Button color="primary" onClick={this.closeForm.bind(this)}>Close</Button>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(LocationDataTable);
