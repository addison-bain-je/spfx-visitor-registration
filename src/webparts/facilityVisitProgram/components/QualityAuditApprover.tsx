
import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { service } from '../service/service';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, DialogTitle, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { QualityAuditApproverItem, SelectOptionItem, } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import QualityAuditApproverForm from './QualityAuditApproverForm';
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
    ListData: QualityAuditApproverItem[];
    showForm: boolean;
    _QualityAuditApproverItem: QualityAuditApproverItem;
    editForm: boolean;
    SubVisitorTypeOptions: SelectOptionItem[];
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

class QualityAuditApproverDataTable extends React.Component<IProps, IDataTableState>{
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];

    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            SubVisitorTypeOptions: [],
            showForm: false,
            editForm: true,
            _QualityAuditApproverItem: {
                ID: null,
                AuditApprover: '',
                QualityAuditType: '',
            },

        };
        this._service = new service(props.context, props.context.pageContext);
        this._selection = [];
        this.getSubVisitorTypeOptions("SubVisitorType", ["ID", "SubVisitorType"]);
        this.viewFields = [
            {
                name: 'AuditApprover',
                displayName: 'Audit Approver',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return <Link style={{ color: 'orange' }}
                        onClick={() => {
                            this.openForm("QualityAuditApprover", item['ID'], false);
                        }}
                    >{item['AuditApprover']}</Link>;
                }
            },
            {
                name: 'QualityAuditType',
                displayName: 'QualityAuditType',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return this.getTitleById(item['QualityAuditType'], this.state.SubVisitorTypeOptions);
                }
            },
            


        ];


    }
    private getTitleById(ID: string, arrayName: SelectOptionItem[]): string {
        var v: SelectOptionItem[] = [];
        v = arrayName.filter(obj => obj.id == ID);
        return (v[0].title);
    }
    private _getSelection = (items: QualityAuditApproverItem[]) => {
        this._selection = items;
    }

    private getData(): void {
        this._service.getAllrecords("QualityAuditApprover").then((result: QualityAuditApproverItem[]) => {
            this.setState({ ListData: result });
        });

    }

    private openForm(listname: string, id: number, edit: boolean): void {
        this._service.getItemById(listname, id).then((item) => { this.setState({ showForm: true, editForm: edit, _QualityAuditApproverItem: item }); });
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
            _QualityAuditApproverItem: {
                ID: null,
                AuditApprover: '',
                QualityAuditType: '',
            }
        });
    }
    private getSubVisitorTypeOptions(listName: string, selectFields: string[]): void {
        const result: SelectOptionItem[] = [];
        this._service.filterItems(listName, selectFields).then((items: any[]) => {
            items.map((item) => {
                result.push({
                    id: String(item.ID),
                    title: item.SubVisitorType,

                });
            });
            this.setState({ SubVisitorTypeOptions: result });
        });
    }
    public render() {
        const { classes } = this.props;
        return (
            <>
                <div>
                    <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle} variant='subtitle2'>Quality Audit Approver Profile</Typography>
                    </Grid>
                    
                    <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>New Quality Audit Approver</Button>
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
                        <DialogTitle>Quality Audit Approver Profile</DialogTitle>
                        <DialogContent>

                            <QualityAuditApproverForm
                                context={this.props.context}
                                formInitialValues={this.state._QualityAuditApproverItem}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                SubVisitorTypeOptions={this.state.SubVisitorTypeOptions}
                                editForm={this.state.editForm}

                            />

                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="QualityAuditApproverForm" disabled={!this.state.editForm}> save</Button>
                            <Button color="primary" disabled={this.state.editForm} onClick={this.editForm.bind(this)}> Edit</Button>
                            <Button color="primary" onClick={this.closeForm.bind(this)}>Cancel</Button>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(QualityAuditApproverDataTable);
