import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { fvpService } from '../service/fvpService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, AppBar, Toolbar, Grid, Typography, Button, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ExportIcon from '@material-ui/icons/GetApp';
import ExportAllIcon from '@material-ui/icons/ExitToApp';
import FvpForm from './FvpForm';
import { fvpItem, newItem, SelectOptionItem, FinalApproverItem, LocationItem, KeywordItem } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import { service } from '../service/service';
import orange from '@material-ui/core/colors/orange';
import dateformat from 'date-fns/format';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import * as moment from 'moment';
import * as XLSX from "xlsx";
import { saveAs } from 'file-saver';
import { uniq } from '@microsoft/sp-lodash-subset';

const styles = (theme: Theme) =>
    createStyles({
        appBar: {
            position: 'relative',
        },
        title: {
            marginLeft: theme.spacing(2),
            flex: 1,
        },
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

const initializeValues = (value) => {
    if (value != '' && value != null && value != 'undefined')
        return JSON.parse(value);
    else
        return ([]);
};

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
});

interface IDataTableState {
    ListData: fvpItem[];
    selectedItems: fvpItem[];
    showForm: boolean;
    _fvpItem: fvpItem;
    editForm: boolean;
    listID?: string;
    SalesRegionOptions: SelectOptionItem[];
    BUOptions: SelectOptionItem[];
    VisitorTypeOptions: SelectOptionItem[];
    VisitingPurposeOptions: SelectOptionItem[];
    MotorSeriesOptions: string[];
    ApplicationOptions: string[];
    MarketingCoordinator: string;
    FinalApproverOptions: FinalApproverItem[];
    LocationOptions: LocationItem[];
    BUSegmentOptions: SelectOptionItem[];
    Keywords: KeywordItem[];
    DataByApplicant: fvpItem[];
}

interface IProps {
    context: WebPartContext;
    classes?: any;
    userRoles: string[];
    IsAdmin: boolean;
}
const groupByFields: IGrouping[] = [{
    name: 'BU',
    order: GroupOrder.descending
}];


class _FVP_My_Requests extends React.Component<IProps, IDataTableState>{
    private _fvpService: fvpService;
    private _service: service;
    private _selection: any[];
    private viewFields: IViewField[];


    constructor(props: IProps, state: IDataTableState) {
        super(props);
        this.state = {
            ListData: [],
            showForm: false,
            editForm: true,
            listID: '',
            selectedItems: [],
            SalesRegionOptions: [],
            BUOptions: [],
            VisitorTypeOptions: [],
            VisitingPurposeOptions: [],
            MotorSeriesOptions: [],
            ApplicationOptions: [],
            MarketingCoordinator: '',
            FinalApproverOptions: [],
            LocationOptions: [],
            BUSegmentOptions: [],
            Keywords: [],
            _fvpItem: {
                ApplicantContactNumber: null,
                RequestNo: '',
                Status: 'Draft',
                BU: '',
                //Applicant: this.props.context.pageContext.user.displayName,
                Applicant: this.props.context.pageContext.user.displayName,
                MarketingCoordinator: '',
                FinalApprover: '',
                GenerateRemark: '',
                VisitorType: '',
                SalesRegion: '',
                VisitingPurpose: '',
                //MotorSeries: '',
                HostName: '',
                BUSegment: '',
                HostContactNo: '',
                HostJobTitleDept: '',
                Others: '',
                Application: '',
                VisitorDetails: '',
                TourPlan: '',
                Action: '',
                CurrentHandler: this.props.context.pageContext.user.email,
                Product: '',
                ApplicantEmail: this.props.context.pageContext.user.email,
                FVPVersion: 'FVP30',
                ApplicantComments: '',
            },
            DataByApplicant: [],
        };
        this._fvpService = new fvpService(props.context, props.context.pageContext);
        this._service = new service(props.context);
        this._selection = [];
        this.viewFields = [
            {
                name: 'RequestNo',
                displayName: 'Request No',
                isResizable: true,
                linkPropertyName: 'RequestNo.ServerRelativeUrl',
                sorting: true,
                minWidth: 80,
                maxWidth: 80,
                render: (item: any) => {
                    return <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                        onClick={() => {
                            this.openForm("FVP", item['ID'], false);
                        }}
                    >{(item['RequestNo']) ? item['RequestNo'] : '-----------'}</Link>;
                }
            },
            {
                name: '',
                displayName: '',
                isResizable: true,
                sorting: true,
                minWidth: 30,
                maxWidth: 30,
                render: (row: any) => {
                    return (<div>
                        <Tooltip title="Copy as New" arrow>
                            <IconButton size='small'
                                //style={{ color: 'orange', marginRight: '1' }}
                                onClick={
                                    () => {
                                        this._service.getItemById('FVP', row['ID']).then(item => {
                                            var copyitem =
                                            {
                                                ApplicantContactNumber: item.ApplicantContactNumber,
                                                RequestNo: '',
                                                Status: 'Draft',
                                                BU: (this.FilterKeywords("Business Unit").indexOf(JSON.parse(item.BU).join(',')) != -1) ? item.BU : "",
                                                Applicant: this.props.context.pageContext.user.displayName,
                                                MarketingCoordinator: item.MarketingCoordinator,
                                                FinalApprover: (this.FilterKeywords("Final Approver").indexOf(item.FinalApprover) != -1) ? item.FinalApprover : "",
                                                GenerateRemark: item.GenerateRemark,
                                                VisitorType: (this.FilterKeywords("Visitor Type").indexOf(item.VisitorType) !=-1) ? item.VisitorType : "",
                                                SalesRegion: (this.FilterKeywords("Sales Region").indexOf(JSON.parse(item.SalesRegion).join(',')) != -1) ? item.SalesRegion : "",
                                                VisitingPurpose: (this.FilterKeywords("Visiting Purpose").indexOf(item.VisitingPurpose) != -1) ? item.VisitingPurpose : "",
                                                HostName: item.HostName,
                                                BUSegment: (this.FilterKeywords("BU Segment").indexOf(JSON.parse(item.BUSegment).join(',')) != -1) ? item.BUSegment : "",
                                                HostContactNo: item.HostContactNo,
                                                HostJobTitleDept: item.HostJobTitleDept,
                                                Others: item.Others,
                                                Application: item.Application,
                                                VisitorDetails: item.VisitorDetails,
                                                TourPlan: item.TourPlan,
                                                // TourPlan: '',
                                                Action: '',
                                                CurrentHandler: this.props.context.pageContext.user.email,
                                                Product: item.Product,
                                                ApplicantEmail: this.props.context.pageContext.user.email,
                                                FVPVersion: 'FVP30',
                                                ApplicantComments: '',
                                            };
                                            //this.setState({copyItem:copyitem});
                                            this.setState({ showForm: true, editForm: true, _fvpItem: copyitem });
                                        });
                                    }
                                }>
                                <CopyIcon color="action" style={{ fontSize: 15 }} />
                            </IconButton>
                        </Tooltip></div>);
                }
            },
            {
                name: 'Status',
                displayName: 'Status',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 80,
                render: (item: any) => {
                    return (<Tooltip title={item['Status']} arrow>
                        <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                            onClick={() => {
                                this.openForm("FVP", item['ID'], false);
                            }}
                        >{(item['Status']) ? item['Status'] : '-----------'}</Link></Tooltip>);
                }
                // render: (item: any) => {
                //   return (<Tooltip title={item['Status']} arrow><div>
                //     {item['Status']}</div></Tooltip>);
                // }
            },
            {
                name: 'TourPlan',
                displayName: 'Visit Time',
                isResizable: true,
                sorting: true,
                minWidth: 140,
                maxWidth: 140,
                render: (item: any) => {
                    //console.log("TourPlan is "+item['TourPlan']);
                    if (item['TourPlan']) {
                        return (
                            <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                                onClick={() => {
                                    this.openForm("FVP", item['ID'], false);
                                }}
                            ><div>
                                    {/* {JSON.parse(item['TourPlan'])[0]['Date']}-{JSON.parse(item['TourPlan'])[JSON.parse(item['TourPlan']).length - 1]['Date']} */}
                                    {dateformat(new Date(JSON.parse(item['TourPlan']).sort((a, b) => (new Date(a.Date)).getTime() - (new Date(b.Date)).getTime())[0]['Date']), 'yyyy/MM/dd')}-{dateformat(new Date(JSON.parse(item['TourPlan']).sort((a, b) => (new Date(a.Date)).getTime() - (new Date(b.Date)).getTime())[JSON.parse(item['TourPlan']).length - 1]['Date']), 'yyyy/MM/dd')}
                                    {/* sort((a, b) => (new Date(a.Date)).getTime() - (new Date(b.Date)).getTime())) */}
                                </div>
                            </Link>
                        );
                    }
                    else {
                        return '';
                    }
                }
            },
            {
                name: 'VisitorDetails',
                displayName: 'Company Name',
                isResizable: true,
                sorting: true,
                minWidth: 90,
                maxWidth: 90,
                render: (item: any) => {
                    return (<Tooltip title={JSON.parse(item['VisitorDetails'])[0]['CompanyName']} arrow>
                        <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                            onClick={() => {
                                this.openForm("FVP", item['ID'], false);
                            }}
                        >
                            <div>{(item['VisitorDetails']) ? JSON.parse(item['VisitorDetails'])[0]['CompanyName'] : '-----------'}</div></Link></Tooltip>);
                }
            },
            {
                name: 'BU',
                displayName: 'BU',
                isResizable: true,
                sorting: true,
                minWidth: 90,
                maxWidth: 90,
                render: (item: any) => {
                    return (<Tooltip title={JSON.parse(item['BU']).join(',')} arrow>
                        <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                            onClick={() => {
                                this.openForm("FVP", item['ID'], false);
                            }}
                        >
                            <div>{(item['BU']) ? JSON.parse(item['BU']).join(',') : '-----------'}</div></Link></Tooltip>);
                }
            },
            {
                name: 'BUSegment',
                displayName: 'BU Segment',
                isResizable: true,
                sorting: true,
                minWidth: 90,
                maxWidth: 90,
                render: (item: any) => {
                    return (<Tooltip title={JSON.parse(item['BUSegment']).join(',')} arrow>
                        <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                            onClick={() => {
                                this.openForm("FVP", item['ID'], false);
                            }}
                        >
                            <div>{(item['BUSegment']) ? JSON.parse(item['BUSegment']).join(',') : '-----------'}</div></Link></Tooltip>);
                }
            },
            {
                name: 'Application',
                displayName: 'Application',
                isResizable: true,
                sorting: true,
                minWidth: 90,
                maxWidth: 90,
                render: (item: any) => {
                    return (<Tooltip title={item['Application']} arrow>
                        <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                            onClick={() => {
                                this.openForm("FVP", item['ID'], false);
                            }}
                        >
                            <div>{(item['Application']) ? item['Application'] : '-----------'}</div></Link></Tooltip>);
                }
            },
            {
                name: 'VisitingPurpose',
                displayName: 'Visiting Purpose',
                isResizable: true,
                sorting: true,
                minWidth: 90,
                maxWidth: 90,
                render: (item: any) => {
                    return <Tooltip title={item['VisitingPurpose']} arrow>
                        <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                            onClick={() => {
                                this.openForm("FVP", item['ID'], false);
                            }}
                        >{(item['VisitingPurpose']) ? item['VisitingPurpose'] : '-----------'}</Link></Tooltip>;
                }
            },
            {
                name: 'Applicant',
                displayName: 'Applicant',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 80,
                render: (item: any) => {
                    return <Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                        onClick={() => {
                            this.openForm("FVP", item['ID'], false);
                        }}
                    >{(item['Applicant']) ? item['Applicant'] : '-----------'}</Link>;
                }
            },
            {
                name: 'CurrentHandler',
                displayName: 'Current Approver',
                isResizable: true,
                sorting: true,
                minWidth: 80,
                maxWidth: 80,
                render: (item: any) => {
                    return <Tooltip title={item['CurrentHandler']} arrow><Link style={item['Status'] == 'Cancelled' || (item['Status']).indexOf('Reject') != -1 ? { color: 'grey' } : { color: 'orange' }}
                        onClick={() => {
                            this.openForm("FVP", item['ID'], false);
                        }}
                    >{(item['CurrentHandler']) ? item['CurrentHandler'] : '-----------'}</Link></Tooltip>;
                }
            },
        ];
    }

    private FilterKeywords(FieldName: string): string {
        var v: string = '';
        var kItem: KeywordItem[] = [];
        if (FieldName != '') {
            kItem = this.state.Keywords.filter(obj => obj.Key == FieldName);
            if (kItem.length > 0) {
                v = kItem[0].Values;
            }
        }
        return (v);
    }

    private getApplicationOptions(listName: string, selectFields: string[]): void {
        const result: string[] = [];
        this._service.filterItems(listName, selectFields).then((items: any[]) => {
            items.map((item) => {
                result.push(item.Name);
            });
            this.setState({ ApplicationOptions: result });
        });
    }

    private getLocationOptions(listName: string): void {
        const result: LocationItem[] = [];
        this._service.getAllrecords(listName).then((items: LocationItem[]) => {
            items.map((item) => {
                result.push({
                    ID: String(item.ID),
                    PlantArea: item.PlantArea,
                    AreaDescription: item.AreaDescription,
                    Department: item.Department,
                    LocationCode: item.LocationCode,
                    Block: item.Block,
                    Floor: item.Floor,
                    Plant: item.Plant,
                    NameinEnglish: item.NameinEnglish,
                    NameinChinese: item.NameinChinese,
                    ExtNo: item.ExtNo,
                    MobileNo: item.MobileNo,
                    AMSession: item.AMSession,
                    PMSession: item.PMSession,
                    LocationApprover: item.LocationApprover,
                    LocationApproverEmail: item.LocationApproverEmail,
                    HasRestrictArea: item.HasRestrictArea,
                });
            });
            var v = result.sort((a, b) => (a.Department > b.Department) ? 1 : ((b.Department > a.Department) ? -1 : 0));
            this.setState({ LocationOptions: v });
        });
    }

    private _getSelection = (items: fvpItem[]) => {
        // this._selection = items;
        this.setState({ selectedItems: items });
    }

    private getData(): void {
        this._fvpService.getAllrecords("FVP").then((result: newItem) => {
            let sortedInput = result.FvpItem.slice().sort((a, b) => b.ID - a.ID);
            this.setState({ ListData: sortedInput });
            this.setState({ listID: result.listID });
        });
    }

    private _get_Data_by_Applicant(): void {
        this._fvpService.getAllrecords("FVP").then((result: newItem) => {
            this.setState({ listID: result.listID });
            if (result.FvpItem.length > 0) {
                var FilteredItems_Applicant: fvpItem[] = [];
                FilteredItems_Applicant = result.FvpItem.filter((obj) => {
                    if (obj.ApplicantEmail != '' && obj.ApplicantEmail != null && obj.ApplicantEmail != 'undefined') {
                        return obj.ApplicantEmail.toString().indexOf((this.props.context.pageContext.user.email.toString())) >= 0;
                    }
                });
                if (FilteredItems_Applicant.length > 0) {
                    let sortedInput = FilteredItems_Applicant.slice().sort((a, b) => b.ID - a.ID);
                    // console.log("sortedInput 2 is " + JSON.stringify(sortedInput, null, 2));
                    this.setState({ DataByApplicant: sortedInput });
                }
            }
        });
    }

    private openForm(listname: string, id: number, edit: boolean): void {
        this._fvpService.getItemById(listname, id).then((item) => { this.setState({ showForm: true, editForm: edit, _fvpItem: item }); });
    }
    private editForm(): void {
        this.setState({ showForm: true, editForm: true });
    }

    private getKeywords(listName: string, selectFields: string[]): void {
        this._service.filterItems(listName, selectFields).then((items: any[]) => {
            this.setState({ Keywords: items });
        });
    }

    public componentDidMount() {
        this.getApplicationOptions("Application", ["Name"]);
        this.getLocationOptions("Location");
        this.getKeywords("Keywords", ["Key", "Values"]);
        //this.getData();
        this._get_Data_by_Applicant();

    }

    private exportToExcel = () => {
        var result: any[] = [];
        (this.state.selectedItems).map(item => {
            var obj = {};
            if (initializeValues(item.TourPlan).length > 0 && initializeValues(item.VisitorDetails).length > 0) {
                initializeValues(item.TourPlan).map(subItem => {
                    obj = {
                        "FVP#": item.RequestNo,
                        "Status": item.Status,
                        "BU Segument": (item.BUSegment) ? JSON.parse(item['BUSegment']).join(',') : '',
                        "Customer": (JSON.parse(item.VisitorDetails)).map((item1) => { return item1.CompanyName; }).filter((value, index, array) => array.indexOf(value) === index).join(","),
                        "Visitor Name": (JSON.parse(item.VisitorDetails)).map((item2) => { return item2.VisitorName; }).join(","),
                        "Visitor Title": (JSON.parse(item.VisitorDetails)).map((item3) => { return item3.JobTitle; }).join(","),
                        "JE Coordinator": item.HostName,
                        "JE Dept.": item.HostJobTitleDept,
                        "Date": dateformat(new Date(subItem.Date), 'yyyy/MM/dd'),
                        "Time": subItem.sTime + " - " + subItem.eTime,
                        "Plant": subItem.PlantCode,
                        "Location": subItem.VisitArea,
                        "Visit purpose details": item.GenerateRemark,
                        "Product": item.Product,
                        "Application or Program": item.Application,
                    };
                    result.push(obj);
                });
            }
        });
        //console.log("export selected items are " + JSON.stringify(result, null, 2));
        if (result.length > 0) {
            const ws = XLSX.utils.book_new();
            XLSX.utils.sheet_add_json(ws, result);
            const wb = { Sheets: { 'FVP Requests': ws }, SheetNames: ['FVP Requests'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            saveAs(data, 'FVPRequests' + '.xlsx');
        }
        else {
            alert('Please select at least Premium Freight Request to export!');
        }
        //console.log(result);
    }
    private exportAllToExcel = () => {
        var result: any[] = [];
        (this.state.DataByApplicant).map(item => {
            var obj = {};
            if (item.Status != "Draft" && item.Status != "Cancelled" && (item.Status).indexOf("Reject") == -1) {
                if (initializeValues(item.TourPlan).length > 0 && initializeValues(item.VisitorDetails).length > 0) {
                    initializeValues(item.TourPlan).map(subItem => {
                        obj = {
                            "FVP#": item.RequestNo,
                            "Status": item.Status,
                            "BU Segument": (item.BUSegment) ? JSON.parse(item['BUSegment']).join(',') : '',
                            "Customer": (JSON.parse(item.VisitorDetails)).map((item1) => { return item1.CompanyName; }).filter((value, index, array) => array.indexOf(value) === index).join(","),
                            "Visitor Name": (JSON.parse(item.VisitorDetails)).map((item2) => { return item2.VisitorName; }).join(","),
                            "Visitor Title": (JSON.parse(item.VisitorDetails)).map((item3) => { return item3.JobTitle; }).join(","),
                            "JE Coordinator": item.HostName,
                            "JE Dept.": item.HostJobTitleDept,
                            "Date": dateformat(new Date(subItem.Date), 'yyyy/MM/dd'),
                            "Time": subItem.sTime + " - " + subItem.eTime,
                            "Plant": subItem.PlantCode,
                            "Location": subItem.VisitArea,
                            "Visit purpose details": item.GenerateRemark,
                            "Product": item.Product,
                            "Application or Program": item.Application,
                        };
                        result.push(obj);
                    });
                }
            }
        });
        //console.log("export all items are " + JSON.stringify(result, null, 2));
        if (result.length > 0) {
            const ws = XLSX.utils.book_new();
            XLSX.utils.sheet_add_json(ws, result);
            const wb = { Sheets: { 'FVP Requests': ws }, SheetNames: ['FVP Requests'] };
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            saveAs(data, 'AllFVPRequests' + '.xlsx');
        }
        else {
            alert('No FVP Request!');
        }
        //console.log(result);
    }

    private closeForm(): void {
        this.setState({
            showForm: false,
            _fvpItem: {
                ID: null,
                ApplicantContactNumber: null,
                RequestNo: '',
                Status: 'Draft',
                BU: '',
                Applicant: this.props.context.pageContext.user.displayName,
                MarketingCoordinator: '',
                FinalApprover: '',
                GenerateRemark: '',
                VisitorType: '',
                SalesRegion: '',
                VisitingPurpose: '',
                //MotorSeries: '',
                HostName: '',
                BUSegment: '',
                HostContactNo: '',
                HostJobTitleDept: '',
                Others: '',
                Application: '',
                VisitorDetails: '',
                TourPlan: '',
                Action: '',
                CurrentHandler: this.props.context.pageContext.user.email,
                Product: '',
                ApplicantEmail: '',
                FVPVersion: '',
                ApplicantComments: '',
            }
        });
    }

    public render() {
        //console.log(this.VisitorTypeOptions);

        const { classes } = this.props;
        return (
            <>
                <div>
                    {/* <Grid container justify="flex-end">
                        <Typography className={classes.viewtitle} variant='subtitle2'>My FVPs</Typography>
                    </Grid> */}

                    <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>New FVP Request</Button>
                    <Button className={classes.button} variant="text" startIcon={<ExportIcon />} color="primary" onClick={() => { this.exportToExcel(); }}>Export Selected</Button>
                    {!this.props.IsAdmin ? null : <Button className={classes.button} variant="text" startIcon={<ExportAllIcon />} color="primary" onClick={() => { this.exportAllToExcel(); }}>Export All</Button>}
                    <ListView
                        items={this.state.DataByApplicant}
                        showFilter={true}
                        filterPlaceHolder="Search..."
                        compact={false}
                        selectionMode={SelectionMode.multiple}
                        selection={this._getSelection}
                        //groupByFields={groupByFields}
                        viewFields={this.viewFields}
                    ></ListView>

                    <MuiDialog
                        fullScreen
                        open={this.state.showForm}
                        TransitionComponent={Transition}
                    >
                        <DialogContent>
                            <FvpForm
                                userRoles={this.props.userRoles}
                                context={this.props.context}
                                formInitialValues={this.state._fvpItem}
                                closeForm={this.closeForm.bind(this)}
                                refreshData={this.getData.bind(this)}
                                editForm={this.state.editForm}
                                handleEdit={this.editForm.bind(this)}
                                listID={this.state.listID}
                                ApplicationOptions={this.state.ApplicationOptions}
                                LocationOptions={this.state.LocationOptions}
                                keywords={this.state.Keywords}
                                IsAdmin={this.props.IsAdmin}
                            />
                        </DialogContent>
                        <DialogActions>
                        </DialogActions>
                    </MuiDialog>
                </div>
            </>
        );
    }
}

export default withStyles(styles)(_FVP_My_Requests);