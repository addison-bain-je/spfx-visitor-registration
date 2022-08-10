import "@pnp/polyfill-ie11";
import { sp } from '@pnp/sp/presets/all';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { PageContext } from '@microsoft/sp-page-context';
import { fvpItem, newItem } from '../components/ItemDefine';
export class fvpService {
    constructor(context: WebPartContext, mypagecontext: PageContext) {
        sp.setup({
            spfxContext: context,
            sp: {
                headers: {
                    "Accept": "application/json; odata=verbose"
                }
            },
            ie11: false

        });

    }
    public async getAllrecords(listname: string): Promise<newItem> {
        const result: newItem = { listID: '', FvpItem: [] };
        return new Promise<newItem>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).get().then((l) => {
                // console.log("listID is " + l.Id);
                result.listID = l.Id;
                sp.web.lists.getByTitle(listname).items.getAll().then((items) => {
                    items.map((item) => {
                        result.FvpItem.push({
                            Applicant: item.Applicant,
                            BU: item.BU,
                            RequestNo: item.RequestNo,
                            SalesRegion: item.SalesRegion,
                            //SalesRegionDescription: item.SalesRegionDescription,
                            VisitorType: item.VisitorType,
                            //VisitingPurposeDescription: item.VisitingPurposeDescription,
                            Status: item.Status,
                            VisitingPurpose: item.VisitingPurpose,
                            //MotorSeries: item.MotorSeries,
                            Application: item.Application,
                            ID: item.ID,
                            CreatedDate: new Date(item.Created).toLocaleString(),
                            SubmittedDate: item.SubmittedDate,
                            CurrentHandler: item.CurrentHandler,
                        });
                    });
                    resolve(result);
                });
            });
        });
    }
    public async getListID(listname: string): Promise<any> {
        const result = [];
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).get().then((l) => {
                result.push(l.Id);
                resolve(result[0]);
            });
        });

    }
    public createItem(listname: string, values: fvpItem, attFile: []): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.add({
                Applicant: values.Applicant,
                MarketingCoordinator: values.MarketingCoordinator,
                MarketingCoordinatorDescription: values.MarketingCoordinatorDescription,
                FinalApprover: values.FinalApprover,
                FinalApproverDescription: values.FinalApproverDescription,
                GenerateRemark: values.GenerateRemark,
                ApplicantContactNumber: values.ApplicantContactNumber,
                BU: values.BU,
                BUDescription: values.BUDescription,
                BUSegment: values.BUSegment,
                BUSegmentDescription: values.BUSegmentDescription,
                RequestNo: values.RequestNo,
                SalesRegion: values.SalesRegion,
                SalesRegionDescription: values.SalesRegionDescription,
                VisitorType: values.VisitorType,
                VisitorTypeDescription: values.VisitorTypeDescription,
                VisitingPurpose: values.VisitingPurpose,
                VisitingPurposeDescription: values.VisitingPurposeDescription,
                Status: values.Status,
                //MotorSeries: values.MotorSeries,
                //MotorSeriesDescription: values.MotorSeriesDescription,
                Application: values.Application,
                ApplicationDescription: values.ApplicationDescription,
                HostName: values.HostName,
                HostContactNo: values.HostContactNo,
                HostJobTitleDept: values.HostJobTitleDept,
                Others: values.Others,
                VisitorDetails: values.VisitorDetails,
                TourPlan: values.TourPlan,
                Action: values.Action,
                SubmittedDate: values.SubmittedDate,

            }).then((r) => { r.item.attachmentFiles.addMultiple(attFile); }).then(() => { resolve(); });
        });
    }

    public updateItem(listname: string, values): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getById(values.ID).update({
                Applicant: values.Applicant,
                MarketingCoordinator: values.MarketingCoordinator,
                MarketingCoordinatorDescription: values.MarketingCoordinatorDescription,
                FinalApprover: values.FinalApprover,
                FinalApproverDescription: values.FinalApproverDescription,
                GenerateRemark: values.GenerateRemark,
                ApplicantContactNumber: values.ApplicantContactNumber,
                BU: values.BU,
                BUDescription: values.BUDescription,
                BUSegment: values.BUSegment,
                BUSegmentDescription: values.BUSegmentDescription,
                RequestNo: values.RequestNo,
                SalesRegion: values.SalesRegion,
                SalesRegionDescription: values.SalesRegionDescription,
                VisitorType: values.VisitorType,
                VisitorTypeDescription: values.VisitorTypeDescription,
                //SubVisitorType: values.SubVisitorType,
                //SubVisitorTypeDescription: values.SubVisitorTypeDescription,
                Status: values.Status,
                VisitingPurpose: values.VisitingPurpose,
                MotorSeries: values.MotorSeries,
                MotorSeriesDescription: values.MotorSeriesDescription,
                Application: values.Application,
                ApplicationDescription: values.ApplicationDescription,
                HostName: values.HostName,
                HostContactNo: values.HostContactNo,
                HostJobTitleDept: values.HostJobTitleDept,
                Others: values.Others,
                VisitorDetails: values.VisitorDetails,
                TourPlan: values.TourPlan,
                Action: values.Action,
            }).then(() => { resolve(); });
        });

    }

    public deleteItem(listname: string, ID: number): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getById(ID).delete().then(() => { resolve(); });
        });


    }
    public getItemById(listname: string, ID: number): Promise<fvpItem> {
        var result: fvpItem;
        return new Promise<fvpItem>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.getById(ID).get().then((values) => {
                result = {
                    ID: values.ID,
                    Applicant: values.Applicant,
                    MarketingCoordinator: values.MarketingCoordinator,
                    MarketingCoordinatorDescription: values.MarketingCoordinatorDescription,
                    FinalApprover: values.FinalApprover,
                    FinalApproverDescription: values.FinalApproverDescription,
                    GenerateRemark: values.GenerateRemark,
                    ApplicantContactNumber: values.ApplicantContactNumber,
                    BU: values.BU,
                    BUDescription: values.BUDescription,
                    BUSegment: values.BUSegment,
                    BUSegmentDescription: values.BUSegmentDescription,
                    RequestNo: values.RequestNo,
                    SalesRegion: values.SalesRegion,
                    SalesRegionDescription: values.SalesRegionDescription,
                    VisitorType: values.VisitorType,
                    VisitorTypeDescription: values.VisitorTypeDescription,
                    VisitingPurpose: values.VisitingPurpose,
                    VisitingPurposeDescription: values.VisitingPurposeDescription,
                    Status: values.Status,
                    //MotorSeries: values.MotorSeries,
                    //MotorSeriesDescription: values.MotorSeriesDescription,
                    Application: values.Application,
                    ApplicationDescription: values.ApplicationDescription,
                    HostName: values.HostName,
                    HostContactNo: values.HostContactNo,
                    HostJobTitleDept: values.HostJobTitleDept,
                    Others: values.Others,
                    VisitorDetails: values.VisitorDetails,
                    TourPlan: values.TourPlan,
                    CreatedDate: new Date(values.Created).toLocaleString(),
                    SubmittedDate: values.SubmittedDate,
                    CurrentHandler: values.CurrentHandler,
                    ApprovalHistory: values.ApprovalHistory,
                };
                resolve(result);
            });
        });

    }
    /**
  * Get the items from the list based on the search input
*/
    /*
        public filterItems(keyword): Promise<fvpItem[]> {
            if (!keyword)
                //    return this.getAllrecords("FVP");
                // here we are using the getAs operator so that our returned value will be typed
                console.log(keyword);
            return sp.web.lists.getByTitle("FVP").items
                .select("Id", "RequestNo", "SalesRegion", "Status", "BU")
                .filter(`substringof('${keyword}',Id)`)
                .get<fvpItem[]>();
    
        }
    */
    public async filterItems(listname: string, selectFields: string[], keyword: string): Promise<any[]> {

        return new Promise<any[]>(async (resolve, reject) => {
            sp.web.lists.getByTitle(listname).items.select(selectFields.toString())
                .filter(`substringof('${keyword}',Status)`).get().then((items) => {
                    resolve(items);
                });
        });
    }


}    