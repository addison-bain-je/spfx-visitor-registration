import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { service } from '../service/service';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, DialogTitle, Button, Typography, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { GroupRoleItem, CheckBoxOptionItem, SelectOptionItem } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import UserForm from './GroupRoleForm';
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
            margin: theme.spacing(1),
            padding: theme.spacing(2),
        }
    });

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface IDataTableState {
    ListData: GroupRoleItem[];
    showForm: boolean;
    _GroupRoleItem: GroupRoleItem;
    editForm: boolean;
    CheckBoxGroupOptions: CheckBoxOptionItem[];

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

class GroupRoleDataTable extends React.Component<IProps, IDataTableState>{
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];
    private RoleOptions: CheckBoxOptionItem[];
    private UserGroupOptions: SelectOptionItem[];

    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            showForm: false,
            editForm: true,
            _GroupRoleItem: {
                UserGroup: '',
                ID: null,
                Role: '',
            },
            CheckBoxGroupOptions: [],
        };
        this._service = new service(props.context, props.context.pageContext);
        this.getRoles("Role", ["ID", "Name"]);
        this.getAllUserGroups();
        this._selection = [];
        this.viewFields = [
            
            {
                name: 'UserGroup',
                displayName: 'User Group',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return <Link style={{ color: 'orange' }}
                        onClick={() => {
                            this.openForm("GroupRole", item['ID'], false);
                        }}
                    >{this.getTitleById(item['UserGroup'], this.UserGroupOptions)}</Link>;
                }


            },

            {
                name: 'Role',
                displayName: 'Role',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250,
                render: (item: any) => {
                    return (JSON.parse(item.Role).toString());
                }
            },


        ];


    }

    private GenerateCheckBoxGroupOptions(Roles: string, Role: string[]): CheckBoxOptionItem[] {
        var r = [];
        JSON.parse(Roles).map(item => { r.push(item); });
        r.forEach(item => {
            if (Role.indexOf(item.value) != -1)
                item.checked = true;
        });
        return (r);
    }


    private _getSelection = (items: GroupRoleItem[]) => {
        this._selection = items;
    }

    private getData(): void {
        this._service.getAllrecords("GroupRole").then((result: GroupRoleItem[]) => {
            this.setState({ ListData: result });
        });

    }

    private getRoles(listName: string, selectFields: string[]): void {
        const result: CheckBoxOptionItem[] = [];
        this._service.filterItems(listName, selectFields).then((items) => {
            items.map((item) => {
                result.push({
                    checked: false,
                    value: item.Name,
                });
            });
            //console.log(result);
            this.RoleOptions = result;
        });

    }
    private getAllUserGroups(): void {

        this._service.getAllGroups().then(result => {
            var r = [];
            result.map((item) => {
                //console.log(item);
                r.push({ id: String(item.Id), title: item.Title });
            });
            this.UserGroupOptions = r;
            //console.log(JSON.stringify(r, null, 2));
        });

    }



    private getTitleById(ID: string, arrayName: SelectOptionItem[]): string {
        var v: SelectOptionItem[] = null;
        v = arrayName.filter(obj => obj.id == ID);
        return (v[0].title);
    }


    private openForm(listname: string, id: number, edit: boolean): void {
        this._service.getItemById(listname, id).then((item) => {

            this.setState({
                showForm: true,
                editForm: edit,
                _GroupRoleItem: item,
                CheckBoxGroupOptions: this.GenerateCheckBoxGroupOptions(JSON.stringify(this.RoleOptions, null, 2), JSON.parse(item.Role))
            });
        });
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
            _GroupRoleItem: {
                UserGroup: '',
                ID: null,
                Role: '',
            },
            CheckBoxGroupOptions: JSON.parse(JSON.stringify(this.RoleOptions, null, 2)),
        });
    }




    public render() {
        console.log(this.RoleOptions);
        const { classes } = this.props;
        return (
            <>
                <div>
                    <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle} variant='subtitle2'>Group/Role Mapping</Typography>
                    </Grid>
                    
                    <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => {
                            this.setState({ showForm: true, editForm: true, CheckBoxGroupOptions: JSON.parse(JSON.stringify(this.RoleOptions, null, 2)) });
                        }}>New Group/Role</Button>
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
                        <DialogTitle>Group/Role</DialogTitle>
                        <DialogContent>
                            <UserForm
                                context={this.props.context}
                                formInitialValues={this.state._GroupRoleItem}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                editForm={this.state.editForm}
                                RoleOptions={this.state.CheckBoxGroupOptions}
                                UserGroupOptions={this.UserGroupOptions}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="GroupRoleForm" disabled={!this.state.editForm}> Save</Button>
                            <Button color="primary" disabled={this.state.editForm} onClick={this.editForm.bind(this)}> Edit</Button>
                            <Button color="primary" onClick={this.closeForm.bind(this)}>Cancel</Button>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(GroupRoleDataTable);
