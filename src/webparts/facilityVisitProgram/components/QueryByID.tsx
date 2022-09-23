import * as React from 'react';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from '@pnp/spfx-controls-react/lib/ListView';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IconButton, AppBar, Toolbar, Grid, Typography, Button, Paper, Divider } from '@material-ui/core';
import { Link } from 'react-router-dom';
import AddIcon from '@material-ui/icons/Add';
import ExportIcon from '@material-ui/icons/GetApp';
import CopyIcon from '@material-ui/icons/FileCopy';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import FvpForm from './FvpForm';
import { fvpItem, newItem, SelectOptionItem, FinalApproverItem, LocationItem, KeywordItem } from './ItemDefine';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import MuiDialog from '@material-ui/core/Dialog';
import { fvpService } from '../service/fvpService';
import { service } from '../service/service';
import orange from '@material-ui/core/colors/orange';
import * as moment from 'moment';
//import * as XLSX from "xlsx";
//import { saveAs } from 'file-saver';
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
    viewTitle: {
      color: orange[500],
    },
    dialogRoot: {
      width: '100%',
      maxWidth: '100%',
      margin: theme.spacing(1),
      padding: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(1),
      textAlign: "left",
      color: theme.palette.text.secondary,
    },
    margin: {
      margin: theme.spacing(1),
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: '20ch',
    },
    selectEmpty: {
      marginTop: theme.spacing(1),
    },
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
  id: string;
  IsAdmin: boolean;
}

const groupByFields: IGrouping[] = [{
  name: 'BU',
  order: GroupOrder.descending
}];


class QueryByID extends React.Component<IProps, IDataTableState>{
  private _fvpService: fvpService;
  private _service: service;

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

  }

  private getData(): void {
  }

  private openFormByID(): void {
    this._service.getListID("FVP").then((_listID: any) => {
      // this.setState({ ListData: result.PfaItem });
      this.setState({ listID: _listID }, () => {
        this.openForm("FVP", Number(this.props.id), false);
      });
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

  public componentDidMount() {
    this.getApplicationOptions("Application", ["Name"]);
   // this.getLocationOptions("Location");
    this.getKeywords("Keywords", ["Key", "Values"]);
    this.getData();
    this.openFormByID();
  }

  private closeFormAndWindow(): void {
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
    }, () => { window.close(); });
  }


  public render() {

    const { classes } = this.props;
    return (
      <>
        <div>
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
               closeForm={this.closeFormAndWindow.bind(this)}
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

export default withStyles(styles)(QueryByID);