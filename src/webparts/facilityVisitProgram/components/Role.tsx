
import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { service } from '../service/service';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, DialogTitle, Button, Typography, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { RoleItem, } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import VisitorTypeForm from './VisitorTypeForm';
import RoleForm from './RoleForm';
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
    ListData: RoleItem[];
    showForm: boolean;
    _RoleItem: RoleItem;
    editForm: boolean;
}

interface IProps {
    context: WebPartContext;
    classes?: any;
}
/*
const groupByFields: IGrouping[] = [{
    name: 'BU',
    order: GroupOrder.descending
}];
*/

class VisitorTypeDataTable extends React.Component<IProps, IDataTableState>{
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];

    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            showForm: false,
            editForm: true,
            _RoleItem: {
                Name: '',
                ID: null,
            },

        };
        this._service = new service(props.context, props.context.pageContext);
        this._selection = [];

        this.viewFields = [
            
            {
                name: 'Name',
                displayName: 'Name',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return <Link style={{ color: 'orange' }}
                        onClick={() => {
                            this.openForm("Role", item['ID'], false);
                        }}
                    >{item['Name']}</Link>;
                }
            },


        ];


    }
    private _getSelection = (items: RoleItem[]) => {
        this._selection = items;
    }

    private getData(): void {
        this._service.getAllrecords("Role").then((result: RoleItem[]) => {
            this.setState({ ListData: result });
        });

    }

    private openForm(listname: string, id: number, edit: boolean): void {
        this._service.getItemById(listname, id).then((item) => { this.setState({ showForm: true, editForm: edit, _RoleItem: item }); });
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
            _RoleItem: {
                ID: null,
                Name: '',
            }
        });
    }

    public render() {
        const { classes } = this.props;
        return (
            <>
                <div>
                    <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle}variant='subtitle2'>Role</Typography>
                    </Grid>
                    
                    <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>New Role</Button>
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
                    >
                        <DialogTitle>Role</DialogTitle>
                        <DialogContent>

                            <RoleForm
                                context={this.props.context}
                                formInitialValues={this.state._RoleItem}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                editForm={this.state.editForm}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="RoleForm" disabled={!this.state.editForm}> save</Button>
                            <Button color="primary" disabled={this.state.editForm} onClick={this.editForm.bind(this)}> Edit</Button>
                            <Button color="primary" onClick={this.closeForm.bind(this)}>Cancel</Button>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(VisitorTypeDataTable);
