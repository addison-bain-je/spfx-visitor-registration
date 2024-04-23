import * as React from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import { fvpService } from '../service/fvpService';
import * as moment from 'moment';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { Grid, Button, Typography } from '@material-ui/core';
import Tooltip, { TooltipProps } from '@material-ui/core/Tooltip';
import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import './styles.css';
import dateformat from 'date-fns/format';
// moment.locale("en-GB");
// Calendar.momentLocalizer(moment);



const localizer = momentLocalizer(moment);
const HtmlTooltip = withStyles((theme: Theme) => ({
    tooltip: {
        //backgroundColor: '#f5f5f9',
        backgroundColor: '#eaf6ff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 320,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);
interface IProps {
    context: WebPartContext;
}


interface IState {
    events: any[];
    location: string;
    showModal: boolean;
}
class Scheduled extends React.Component<IProps, IState> {
    private _fvpService: fvpService;
    constructor(props: IProps, state: IState) {
        super(props);
        this.state = { events: [], location: '', showModal: false };
        this._fvpService = new fvpService(props.context, props.context.pageContext);
    }

    private getTourPlans(listName: string, selectFields: string[], keyword: string): void {
        const result = [];
        this._fvpService.filterItems(listName, selectFields, keyword).then((items: any[]) => {
            let sortedInput = items.slice().sort((a, b) => b.ID - a.ID);
            sortedInput.map((item) => {
                JSON.parse(item.TourPlan).map(element => {
                    const localizedStartDate = dateformat(new Date(element.Date + ' ' + element.sTime), 'MM/dd/yyyy HH:mm').toString();
                    const localizedSEndDate = dateformat(new Date(element.Date + ' ' + element.eTime), 'MM/dd/yyyy HH:mm').toString();
                    result.push({
                        title: element.PlantCode + ", " + element.VisitArea + ", " + element.Floor + "F/" + element.Block + "B",
                        start: new Date(Date.parse(localizedStartDate)), end: new Date(Date.parse(localizedSEndDate)), resource: element
                    });
                    //result.push({ title: element.PlantCode + ", " + element.VisitArea + ", " + element.Floor + "F/" + element.Block + "B", start: new Date(element.Date + ' ' + element.sTime), end: new Date(element.Date + ' ' + element.eTime), resource: element });
                });

            });
            console.log("schedule " + JSON.stringify(result, null, 2));
            this.setState({ events: result });
        });
    }

    private Event({ event }) {
        return (
            <HtmlTooltip
                placement='left'
                arrow
                title={
                    <React.Fragment>
                        <Typography color="inherit">Tour Plan</Typography>
                        <em>Date:{event.resource.Date}</em><br />
                        <em>Time:{event.resource.sTime}-{event.resource.eTime}</em><br />
                        <em>Plant Code:{event.resource.PlantCode}</em><br />
                        <em>Visit Area:{event.resource.VisitArea}</em><br />
                        <em>Block:{event.resource.Block}</em><br />
                        <em>Floor:{event.resource.Floor}</em><br />
                    </React.Fragment>
                }
            >
                <span>{event.title}</span>
            </HtmlTooltip>
        );
    }
    public componentDidMount() {
        this.getTourPlans("FVP", ["TourPlan"], "Ready");
    }

    public render() {
        // console.log(this.state.events);
        return (
            <>
                <Calendar
                    localizer={localizer}
                    events={this.state.events}
                    defaultView={Views.work_week}
                    scrollToTime={new Date(2020, 1, 1, 6)}
                    defaultDate={moment().startOf('day').toDate()}
                    //defaultDate={moment().toDate()}
                    //onSelectEvent={event => alert(event.title)}
                    titleAccessor={event => event.title}
                    tooltipAccessor={null}
                    startAccessor="start"
                    endAccessor="end"
                    components={{
                        event: this.Event,
                    }}
                    //onShowMore={(events, date) => this.setState({ showModal: true, events })}
                    views={['month', 'week', 'day', 'agenda']}
                />
            </>
        );
    }
}

export default Scheduled;