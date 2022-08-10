import { WebPartContext } from "@microsoft/sp-webpart-base";
import { fvpItem, SelectOptionItem, FinalApproverItem, LocationItem, KeywordItem } from './ItemDefine';

export interface fvpFormProps {
    context: WebPartContext;
    formInitialValues: fvpItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
    handleEdit: any;
    listID: string;
    ApplicationOptions: string[];
    LocationOptions: LocationItem[]; 
    userRoles: string[];
    keywords: KeywordItem[];
    // VisitorTypeOptions: SelectOptionItem[];
    // SalesRegionOptions: SelectOptionItem[];
    // BUOptions: SelectOptionItem[];
    // BUSegmentOptions: SelectOptionItem[];
    // VisitingPurposeOptions: SelectOptionItem[];
    // MotorSeriesOptions: string[];
    // MarketingCoordinator: string;
    // FinalApproverOptions: FinalApproverItem[];       
}