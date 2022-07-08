import * as React from "react";
import { fvpService } from '../service/fvpService';
import PageHeader from "./PageHeader";
import PeopleOutlineTwoToneIcon from '@material-ui/icons/PeopleOutlineTwoTone';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Grid, TextField } from "@material-ui/core";
import _MaterialTable_Read from "./_MaterialTable_Read";
import TourPlan_Read from "./TourPlan_Read";
//import { ListItemAttachments } from "@pnp/spfx-controls-react/lib/ListItemAttachments";
import MuiTypography from '@material-ui/core/Typography';
import { ListItemAttachments } from "@pnp/spfx-controls-react/lib/controls/listItemAttachments";
const useStyles = makeStyles((theme: Theme) => ({
    root: {
        '& .MuiFormControl-root': {
            width: '80%',
            margin: theme.spacing(1),
        }
    },

}));
const VisitorDetailsColumns = [
    { title: "Company Name", field: "CompanyName", },
    { title: "Visitor Name", field: "VisitorName", },
    { title: "Job Title", field: "JobTitle", },
];


const HostDetailsColumns = [
    { title: "Johnson Host Name", field: "JohnsonHostName", },
    { title: "Department", field: "Department", },
    { title: "Ext No", field: "ExtNo", },
    { title: "Mobile No", field: "MobileNo", },
];

const initializeValues = (value) => {
    if (value)
        return JSON.parse(value);
    else
        return ([]);
};
export default function QueryFvp(props) {
    const { id, context } = props;
    const [state, setState] = React.useState({
        Fvpdetail: null,
        ListID: '',
        id: props.id,
    });

    React.useEffect(
        () => {
            setState({ ...state, id: props.id });
            const _fvpService = new fvpService(context, context.pageContext);
            _fvpService.getItemById("FVP", Number(id)).then((item) => {
                _fvpService.getListID("FVP").then((result) => {
                    setState({ ...state, ListID: result, Fvpdetail: item });
                });

            });

        }, [props.id]
    );

    const classes = useStyles();
    return (<>
        <form id="FvpForm" className={classes.root} autoComplete="off">
            <PageHeader
                title="FVP Form"
                icon={<PeopleOutlineTwoToneIcon fontSize="large" />}
            />

            <Grid container>
                <Grid item xs={12} sm={6}>
                    <TextField
                        name="RequestNo"
                        label="Request No"
                        variant="standard"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.RequestNo : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Applicant"
                        name="Applicant"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.Applicant : ''}
                    />
                    <TextField
                        variant="standard"
                        label="SalesRegion"
                        name="SalesRegionDescription"
                        disabled={true}
                        value={state.Fvpdetail ? initializeValues(state.Fvpdetail.SalesRegionDescription).join(',') : ''}
                    />
                    <TextField
                        variant="standard"
                        label="BU"
                        name="BUDescription"
                        disabled={true}
                        value={state.Fvpdetail ? initializeValues(state.Fvpdetail.BUDescription).join(',') : ''}
                    />
                    <TextField
                        variant="standard"
                        label="Visiting Type"
                        name="VisitorTypeDescription"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.VisitorTypeDescription : ''}
                    />
                    <TextField
                        variant="standard"
                        label="Sub Visiting Type"
                        name="SubVisitorTypeDescription"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.SubVisitorTypeDescription : ''}
                    />
                    <TextField
                        variant="standard"
                        label="Marketing Coordinator"
                        name="MarketingCoordinatorDescription"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.MarketingCoordinatorDescription : ''}
                    />

                </Grid>


                <Grid item xs={12} sm={6}>
                    <TextField
                        name="Status"
                        label="Status"
                        variant="standard"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.Status : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Applicant Contact Number"
                        name="ApplicantContactNumber"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.ApplicantContactNumber : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Visit Purpose"
                        name="VisitPurpose"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.VisitPurpose : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Motor Series"
                        name="MotorSeries"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.MotorSeries : ''}
                        //value={state.Fvpdetail ? initializeValues(state.Fvpdetail.MotorSeriesDescription).join(',') : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Application"
                        name="Application"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.Application : ''}
                        //value={state.Fvpdetail ? initializeValues(state.Fvpdetail.ApplicationDescription).join(',') : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Additional Information"
                        name="GenerateRemark"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.GenerateRemark : ''}
                    />

                    <TextField
                        variant="standard"
                        label="Final Approver"
                        name="FinalApproverDescription"
                        disabled={true}
                        value={state.Fvpdetail ? state.Fvpdetail.FinalApproverDescription : ''}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <_MaterialTable_Read
                        Title="Visitor Details"
                        data={state.Fvpdetail ? initializeValues(state.Fvpdetail.VisitorDetails) : []}
                        columns={VisitorDetailsColumns}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <_MaterialTable_Read
                        Title="Host Details"
                        data={state.Fvpdetail ? initializeValues(state.Fvpdetail.HostDetails) : []}
                        columns={HostDetailsColumns}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    <TourPlan_Read
                        data={state.Fvpdetail ? initializeValues(state.Fvpdetail.TourPlan) : []}
                    />
                </Grid>
                <Grid item xs={12} sm={12}>
                    {(state.id && state.ListID) ?
                        <div>
                            <ListItemAttachments listId={state.ListID}
                                itemId={state.id}
                                context={props.context}
                                disabled={true}
                                openAttachmentsInNewWindow={true}
                            />
                        </div> : ''
                    }
                </Grid>
                <Grid item xs={12} sm={12}>
                    <MuiTypography>
                        <pre style={{ fontFamily: 'inherit' }}>
                            {state.Fvpdetail ? state.Fvpdetail.ApprovalHistory : ''}
                        </pre>
                    </MuiTypography>
                </Grid>
            </Grid>

        </form>
    </>);
}