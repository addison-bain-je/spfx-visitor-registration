import { WebPartContext } from "@microsoft/sp-webpart-base";
import { fvpItem, SelectOptionItem, FinalApproverItem, LocationItem } from './ItemDefine';

export interface fvpFormProps {
    context: WebPartContext;
    formInitialValues: fvpItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
    handleEdit:any;
    listID: string;
    VisitorTypeOptions: SelectOptionItem[];
    SalesRegionOptions: SelectOptionItem[];
    BUOptions: SelectOptionItem[];
    BUSegmentOptions: SelectOptionItem[];
    VisitingPurposeOptions: SelectOptionItem[];
    MotorSeriesOptions: string[];
    ApplicationOptions: string[];
    MarketingCoordinator: string;
    FinalApproverOptions: FinalApproverItem[];
    LocationOptions: LocationItem[];
    userRoles:string[];
}