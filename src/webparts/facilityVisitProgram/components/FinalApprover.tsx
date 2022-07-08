
import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { service } from '../service/service';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, DialogTitle, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { FinalApproverItem, SelectOptionItem } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import FinalApproverForm from './FinalApproverForm';
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
            //width: '100%',
            //maxWidth: '100%',
            margin: theme.spacing(1),
            padding: theme.spacing(2),
        }
    });

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});


interface IDataTableState {
    ListData: FinalApproverItem[];
    showForm: boolean;
    _finalApproverItem: FinalApproverItem;
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

class FinalApproverDataTable extends React.Component<IProps, IDataTableState>{
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];
    private VisitorTypeOptions: SelectOptionItem[];

    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            showForm: false,
            editForm: true,
            _finalApproverItem: {
                VisitorType: '',
                ID: null,
                FinalApprover: '',
            },

        };
        this._service = new service(props.context, props.context.pageContext);
        this.getVisitorTypes("VisitorType", ["ID", "VisitorType"]);
        this._selection = [];
        this.viewFields = [
            {
                name: 'FinalApprover',
                displayName: 'Final Approver',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return <Link style={{ color: 'orange' }}
                        onClick={() => {
                            this.openForm("FinalApprover", item['ID'], false);
                        }}
                    >{item['FinalApprover']}</Link>;
                }
            },

            {
                name: 'VisitorType',
                displayName: 'Visitor Type',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250,
                render: (item: any) => {
                    return this.getTitleById(item['VisitorType'], this.VisitorTypeOptions);
                }
            },


        ];


    }
    private _getSelection = (items: FinalApproverItem[]) => {
        this._selection = items;
    }

    private getData(): void {
        this._service.getAllrecords("FinalApprover").then((result: FinalApproverItem[]) => {
            this.setState({ ListData: result });
        });

    }

    private getVisitorTypes(listName: string, selectFields: string[]): void {
        const result: SelectOptionItem[] = [];
        this._service.filterItems(listName, selectFields).then((items) => {
            items.map((item) => {
                result.push({
                    id: String(item.ID),
                    title: item.VisitorType,
                });
            });
            this.VisitorTypeOptions = result;
        });

    }

    private getTitleById(ID: string, arrayName: SelectOptionItem[]): string {
        var v: SelectOptionItem[] = null;
        v = arrayName.filter(obj => obj.id == ID);
        return (v[0].title);
    }

    private openForm(listname: string, id: number, edit: boolean): void {
        this._service.getItemById(listname, id).then((item) => { this.setState({ showForm: true, editForm: edit, _finalApproverItem: item }); });
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
            _finalApproverItem: {
                VisitorType: '',
                ID: null,
                FinalApprover: '',
            }
        });
    }

    public render() {
        const { classes } = this.props;
        return (
            <>
                <div>
                    <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle} variant='subtitle2'>Final Approver Profile</Typography>
                    </Grid>
                    <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>New Final Approver</Button>
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
                        <DialogTitle>Final Approver Profile</DialogTitle>
                        <DialogContent>

                            <FinalApproverForm
                                context={this.props.context}
                                formInitialValues={this.state._finalApproverItem}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                editForm={this.state.editForm}
                                VisitorTypeSelectOptions={this.VisitorTypeOptions}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="FinalApproverForm" disabled={!this.state.editForm}> save</Button>
                            <Button color="primary" disabled={this.state.editForm} onClick={this.editForm.bind(this)}> Edit</Button>
                            <Button color="primary" onClick={this.closeForm.bind(this)}>Cancel</Button>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(FinalApproverDataTable);
