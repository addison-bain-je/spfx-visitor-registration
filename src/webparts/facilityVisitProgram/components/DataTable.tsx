import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { fvpService } from '../service/fvpService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, AppBar, Toolbar, Grid, Typography, Button, Tooltip } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FvpForm from './FvpForm';
import { fvpItem, newItem, SelectOptionItem, FinalApproverItem, LocationItem, KeywordItem } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import { service } from '../service/service';
import orange from '@material-ui/core/colors/orange';
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

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface IDataTableState {
  ListData: fvpItem[];
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
}

interface IProps {
  context: WebPartContext;
  classes?: any;
  userRoles: string[];

}
const groupByFields: IGrouping[] = [{
  name: 'BU',
  order: GroupOrder.descending
}];


class DataTable extends React.Component<IProps, IDataTableState>{
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
      },
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
        minWidth: 150,
        maxWidth: 150,
        render: (item: any) => {
          return <Link style={{ color: 'orange' }}
            onClick={() => {
              this.openForm("FVP", item['ID'], false);
            }}
          >{(item['RequestNo']) ? item['RequestNo'] : '-----------'}</Link>;
        }
      },
      {
        name: 'Applicant',
        displayName: 'Applicant',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 250
      },
      {
        name: 'Status',
        displayName: 'Status',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150
      },
      {
        name: 'BU',
        displayName: 'BU',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,
        render: (item: any) => {
          if (item['BU']) {
            return (<Tooltip title={JSON.parse(item['BU']).join(',')} arrow><div>
              {JSON.parse(item['BU']).join(',')}</div></Tooltip>);
          }
          else
            return '';
        }
      },
      {
        name: 'SalesRegion',
        displayName: 'Sales Region',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,
        render: (item: any) => {
          if (item['SalesRegion']) {
            return (<Tooltip title={JSON.parse(item['SalesRegion']).join(',')} arrow><div>
              {JSON.parse(item['SalesRegion']).join(',')}</div></Tooltip>);
          }
          else
            return '';
        }
      },

      {
        name: 'Application',
        displayName: 'Application',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,
        render: (item: any) => {
          if (item['Application']) {
            return (<Tooltip title={item['Application']} arrow><div>
              {item['Application']}</div></Tooltip>);
          }
          else
            return '';
        }
      },
      {
        name: 'VisitorType',
        displayName: 'Visitor Type',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,
      },
      {
        name: 'VisitingPurpose',
        displayName: 'Visiting Purpose',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,

      },
      {
        name: 'CreatedDate',
        displayName: 'Created Date',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,

      },
      {
        name: 'CurrentHandler',
        displayName: 'Current Approver',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,

      },
      {
        name: 'SubmittedDate',
        displayName: 'Submitted Date',
        isResizable: true,
        sorting: true,
        minWidth: 150,
        maxWidth: 150,

      },

    ];


  }



  // private getTitleByIdList(elements: string[], array: SelectOptionItem[]): string {
  //   const r: string[] = [];
  //   elements.map((item => {
  //     r.push(array.filter(obj => obj.id == item)[0].title);
  //   }));
  //   return r.join(', ');
  // }

  // private getTitleById(ID: string, arrayName: SelectOptionItem[]): string {
  //   var v: SelectOptionItem[] = [];
  //   v = arrayName.filter(obj => obj.id == ID);
  //   return (v[0].title);
  // }

  // private getVisitorTypeOptions(listName: string, selectFields: string[]): void {
  //   const result: SelectOptionItem[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push({
  //         id: String(item.ID),
  //         title: item.VisitorType,
  //       });
  //     });
  //     this.setState({ VisitorTypeOptions: result });
  //   });
  // }

  // private getSalesRegionOptions(listName: string, selectFields: string[]): void {
  //   const result: SelectOptionItem[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push({
  //         id: String(item.ID),
  //         title: item.Name,
  //       });
  //     });
  //     this.setState({ SalesRegionOptions: result });
  //   });
  // }

  // private getBUOptions(listName: string, selectFields: string[]): void {
  //   const result: SelectOptionItem[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push({
  //         id: item.ID,
  //         title: item.Name,
  //       });
  //     });
  //     this.setState({ BUOptions: result });
  //   });
  // }

  // private getBUSegmentOptions(listName: string, selectFields: string[]): void {
  //   const result: SelectOptionItem[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push({
  //         id: item.ID,
  //         title: item.Name,
  //       });
  //     });
  //     this.setState({ BUSegmentOptions: result });
  //   });
  // }


  // private getVisitingPurposeOptions(listName: string, selectFields: string[]): void {
  //   const result: SelectOptionItem[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push({
  //         id: String(item.ID),
  //         title: item.SubVisitorType,
  //       });
  //     });
  //     this.setState({ VisitingPurposeOptions: result });
  //   });
  // }

  // private getMotorSeriesOptions(listName: string, selectFields: string[]): void {
  //   const result: string[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push(item.Name);
  //     });
  //     this.setState({ MotorSeriesOptions: result });
  //   });
  // }

  // private getMarketingCoordinator(listName: string, selectFields: string[]): void {
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     this.setState({ MarketingCoordinator: items[0].MarketingCoordinator });
  //   });
  // }

  // private getFinalApproverOptions(listName: string, selectFields: string[]): void {
  //   const result: FinalApproverItem[] = [];
  //   this._service.filterItems(listName, selectFields).then((items: any[]) => {
  //     items.map((item) => {
  //       result.push({
  //         ID: String(item.ID),
  //         FinalApprover: item.FinalApprover,
  //         VisitorType: item.VisitorType,
  //       });
  //     });
  //     this.setState({ FinalApproverOptions: result });
  //   });
  // }

  /*
    private getApplicationOptions(listName: string, selectFields: string[]): void {
      const result: SelectOptionItem[] = [];
      this._service.filterItems(listName, selectFields).then((items: any[]) => {
        items.map((item) => {
          result.push({
            id: String(item.ID),
            title: item.Name,
          });
        });
        this.setState({ ApplicationOptions: result });
      });
    }
  */

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
          HasRestrictArea: item.HasRestrictArea,
        });
      });
      var v = result.sort((a, b) => (a.Department > b.Department) ? 1 : ((b.Department > a.Department) ? -1 : 0));
      this.setState({ LocationOptions: v });
    });
  }

  private _getSelection = (items: fvpItem[]) => {
    this._selection = items;
  }

  private getData(): void {
    this._fvpService.getAllrecords("FVP").then((result: newItem) => {
      this.setState({ ListData: result.FvpItem });
      this.setState({ listID: result.listID });
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
    this.getData();
    // this.getVisitorTypeOptions("VisitorType", ["ID", "VisitorType"]);
    // this.getSalesRegionOptions("SalesRegion", ["ID", "Name"]);
    // this.getBUOptions("BU", ["ID", "Name"]);
    // this.getBUSegmentOptions("BUSegment", ["ID", "Name"]);
    // this.getVisitingPurposeOptions("SubVisitorType", ["ID", "SubVisitorType"]);
    // this.getMotorSeriesOptions("MotorSeries", ["Name"]);
    // this.getMarketingCoordinator("MarketingCoordinator", ["ID", "MarketingCoordinator"]);
    // this.getFinalApproverOptions("FinalApprover", ["ID", "VisitorType", "FinalApprover"]);
    //console.log(this.VisitorTypeOptions);

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
      }
    });
  }

  public render() {
    //console.log(this.VisitorTypeOptions);

    const { classes } = this.props;
    return (
      <>
        <div>
          <Grid container justify="flex-end">
            <Typography className={classes.viewtitle} variant='subtitle2'>Facility Visit Program</Typography>
          </Grid>

          <Button className={classes.button} variant="text" startIcon={<AddIcon />} color="primary" onClick={() => { this.setState({ showForm: true, editForm: true, }); }}>New FVP Request</Button>
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
                // VisitorTypeOptions={this.state.VisitorTypeOptions}
                // SalesRegionOptions={this.state.SalesRegionOptions}
                // BUOptions={this.state.BUOptions}
                // VisitingPurposeOptions={this.state.VisitingPurposeOptions}
                // MotorSeriesOptions={this.state.MotorSeriesOptions}
                // MarketingCoordinator={this.state.MarketingCoordinator}
                // FinalApproverOptions={this.state.FinalApproverOptions}
                // BUSegmentOptions={this.state.BUSegmentOptions}               
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

export default withStyles(styles)(DataTable);