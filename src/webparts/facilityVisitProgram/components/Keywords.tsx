import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { service } from '../service/service';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, DialogTitle, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import { KeywordItem } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import KeywordForm from './KeywordForm';
import { orange } from '@material-ui/core/colors';
const styles = (theme: Theme) =>
    createStyles({
        button: {
            textTransform: 'none',
            color: "#006633",
        },
        viewtitle: {
            color: "#006633",
        },
        dialogroot: {
            width: '100%',
            //minWidth:'600',
            //maxWidth: '800',
            margin: theme.spacing(1),
            padding: theme.spacing(2),
        }
    });

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IDataTableState {
    ListData: KeywordItem[];
    showForm: boolean;
    _Item: KeywordItem;
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

class Keywords extends React.Component<IProps, IDataTableState>{
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];

    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            showForm: false,
            editForm: true,
            _Item: {
                Key: '',
                ID: null,
                Values: '',
            },

        };
        this._service = new service(props.context);
        this._selection = [];

        this.viewFields = [
            {
                name: 'Key',
                displayName: 'Key',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 150,
                render: (item: any) => {
                    return <Link style={{ color: '#006633' }}
                        onClick={() => {
                            this.openForm("Keywords", item['ID'], false);
                        }}
                    >{item['Key']}</Link>;
                }
            },
            {
                name: 'Values',
                displayName: 'Values',
                //linkPropertyName: 'c',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 250,
                render: (item: any) => {
                    var v = JSON.parse(item['Values']);
                    var v1 = [];
                    v.map(vitem => {
                        v1.push(vitem['Value']);
                    });

                    return (JSON.stringify(v1, null, 2));
                }
            },

        ];


    }
    private _getSelection = (items: KeywordItem[]) => {
        this._selection = items;
    }

    private getData(): void {
        this._service.getAllrecords("Keywords").then((items) => {
            this.setState({ ListData: items });
        });
    }

    private openForm(listname: string, id: number, edit: boolean): void {
        this._service.getItemById(listname, id).then((item) => { this.setState({ showForm: true, editForm: edit, _Item: item }); });
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
            _Item: {
                ID: null,
                Key: '',
                Values: '',
            }
        });
    }

    public render() {
        const { classes } = this.props;
        return (
            <>
                <div>
                    <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle} variant='subtitle2'>Keyword</Typography>
                    </Grid>
                    <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>New Keyword</Button>
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
                        <DialogTitle>Keyword</DialogTitle>
                        <DialogContent>

                            <KeywordForm
                                context={this.props.context}
                                formInitialValues={this.state._Item}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                editForm={this.state.editForm}
                            />

                        </DialogContent>
                        <DialogActions>
                            <Button color="primary" type="submit" form="KeywordForm" disabled={!this.state.editForm}> save</Button>
                            <Button color="primary" disabled={this.state.editForm} onClick={this.editForm.bind(this)}> Edit</Button>
                            <Button color="primary" onClick={this.closeForm.bind(this)}>Cancel</Button>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(Keywords);
