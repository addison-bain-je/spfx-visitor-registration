export interface fvpItem {
    ID?: number;
    ApplicantContactNumber?: string;
    RequestNo?: string;
    Status?: string;
    BU?: string;
    //BUDescription?: string;
    BUSegment?: string;
    //BUSegmentDescription?: string;
    VisitorType?: string;
    //VisitorTypeDescription?: string;
    SalesRegion?: string;
    //SalesRegionDescription?: string;
    VisitingPurpose?: string;
    //VisitingPurposeDescription?: string;
    //MotorSeries?: string;
    //MotorSeriesDescription?: string;
    Application?: string;
    //ApplicationDescription?: string;
    Applicant?: string;
    MarketingCoordinator?: string;
    //MarketingCoordinatorDescription?: string;
    FinalApprover?: string;
    //FinalApproverDescription?: string;
    GenerateRemark?: string;
    HostName?: string;
    HostContactNo?: string;
    HostJobTitleDept?: string;
    Others?: string;
    VisitorDetails?: string;
    TourPlan?: string;
    ApprovalHistory?: string;
    Action?: string;
    CreatedDate?: string;
    SubmittedDate?: string;
    CurrentHandler?: string;
    Title?: string;
    Product?: string;
    ApplicantEmail?: string;
    FVPVersion?: string;
    ApplicantComments?: string;
}
export interface HostItem {
    JohnsonHostName: string;
    Department: string;
    ExtNo: string;
    MobileNo: string;
}
export interface VisitorItem {
    CompanyName: string;
    VisitorName: string;
    JobTitle: string;
}

export interface TourPlanItem {
    Date: string;
    Time: string;
    VisitArea: string;
    PlantCode: string;
    Block: string;
    Floor: string;
    Torguide: string;
    ExtNo: string;
    MobileNo: string;
    LocationApprover: string;
}

export interface LocationItem {
    ID?: string;
    PlantArea?: string;
    AreaDescription?: string;
    Department?: string;
    LocationCode?: string;
    Block?: string;
    Floor?: string;
    Plant?: string;
    NameinEnglish?: string;
    NameinChinese?: string;
    ExtNo?: string;
    MobileNo?: string;
    AMSession?: string;
    PMSession?: string;
    LocationApprover?: string;
    HasRestrictArea?: string;
    LocationApproverEmail?: string;
}
export interface BUItem {
    ID?: string;
    Name: string;
    Description: string;
}
export interface BUSegmentItem {
    ID?: string;
    Name: string;
    Description: string;
}
export interface SalesRegionItem {
    ID?: string;
    Name: string;
    Description: string;
}

export interface newItem {
    listID: string;
    FvpItem: fvpItem[];
}

export interface VisitorTypeItem {
    ID?: string;
    VisitorType?: string;
    Description?: string;
}

export interface SubVisitorTypeItem {
    ID?: string;
    SubVisitorType?: string;
    Description?: string;
}
export interface FinalApproverItem {
    ID?: string;
    VisitorType?: string;
    FinalApprover?: string;
}
export interface MotorSeriesItem {
    ID?: string;
    Name?: string;
}
export interface ApplicationItem {
    ID?: string;
    Name?: string;
}
export interface SelectOptionItem {
    id: string;
    title: string;
}
export interface CheckBoxOptionItem {
    checked: boolean;
    value: string;
}
export interface MarketingCoordinatorItem {
    ID: string;
    MarketingCoordinator: string;
}
export interface RoleItem {
    ID: string;
    Name: string;
}
export interface GroupRoleItem {
    ID: string;
    UserGroup: string;
    Role: string;
}
export interface CEOItem {
    ID: string;
    CEO: string;
}
export interface QualityAuditApproverItem {
    ID: string;
    AuditApprover: string;
    QualityAuditType: string;
    AuditApproverEmail?: string;
}
export interface SequentialNumberItem {
    ID: string;
    FormName: string;
    Prefix: string;
    Year: string;
    SequentialNumber: string;
}
export interface KeywordItem {
    ID?: string;
    Key: string;
    Values: string;
}
