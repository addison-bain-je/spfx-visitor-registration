import * as React from 'react';
import clsx from 'clsx';
import { makeStyles, createStyles } from '@material-ui/core/styles';
//import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
// import PieIcon from '@material-ui/icons/PieChartOutlined';
// import SupervisorIcon from '@material-ui/icons/SupervisorAccount';
// import PersonIcon from '@material-ui/icons/Person';
import HighQualityIcon from '@material-ui/icons/HighQuality';
//import PersonPinIcon from '@material-ui/icons/PersonPinCircle';
import AppsIcon from '@material-ui/icons/Apps';
import LocationIcon from '@material-ui/icons/LocationOn';
// import ListIcon from '@material-ui/icons/List';
// import BusinessIcon from '@material-ui/icons/Business';
// import BusinesssCenterIcon from '@material-ui/icons/BusinessCenter';
// import BusinesssCenterIcon1 from '@material-ui/icons/BusinessCenterOutlined';
// import AccountBoxIcon from '@material-ui/icons/AccountBox';
//import GroupWorkIcon from '@material-ui/icons/GroupWork';
//import BUSegIcon from '@material-ui/icons/AccountBalance';
import Container from '@material-ui/core/Container';
import KeyIcon from '@material-ui/icons/VpnKey';
import Grid from '@material-ui/core/Grid';
import { Route, Link, BrowserRouter as Router, HashRouter } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import _FVP_All from './_FVP_All';
import _FVP_My_Actions from './_FVP_My_Actions';
import _FVP_My_Requests from './_FVP_My_Requests';
//import BU from './BU';
//import BUSegment from './BUSegment';
//import SalesRegion from './SalesRegion';
import Location from './Location';
//import VisitorType from './VisitorType';
// import SubVisitorType from './SubVisitorType';
// import FinalApprover from './FinalApprover';
// import MotorSeries from './MotorSeries';
import Application from './Application';
// import MarketingCoordinator from './MarketingCoordinator';
// import Role from './Role';
// import GroupRole from './GroupRole';
// import CEO from './CEO';
import QualityAuditApprover from './QualityAuditApprover';
import SequentialNumber from './SequentialNumber';
import Keywords from './Keywords';
import QueryFvp from './QueryFvp';
import Scheduled from './Scheduled';
import QueryByID from './QueryByID';
import { Button, Tooltip } from '@material-ui/core';
import Dummy from './Dummy';
import orange from '@material-ui/core/colors/orange';
const drawerWidth = 240;

const useStyles = makeStyles((theme) => createStyles({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    backgroundColor: orange[500],
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  navList: {
    width: '100%',
    maxWidth: 240,
    backgroundColor: theme.palette.background.paper,
  },
  ListItem: {
    color: orange[500],

  },
}));



export default function Main(props) {
  //const isNotAdmin = (props.userRoles.indexOf("Admin") == -1);//default true
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  //const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const Query = (queryprops) => {
    return (<QueryFvp id={queryprops.match.params.id} context={props.context} />);
  };
  const FVPQuery = (queryprops) => {
    return (<QueryByID id={queryprops.match.params.id} context={props.context} {...props} />);
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  return (
    < div className={classes.root} >
      <HashRouter>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              Facility Visit Program
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <div className={classes.navList}>
            <List component="nav">

              <ListItem
                className={classes.ListItem}
                button
                component={Link}
                to='/'
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0)}>
                <Tooltip title="All FVPs">
                  <ListItemIcon className={classes.ListItem}>
                    <HomeIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="All FVPs"></ListItemText>
              </ListItem>

              <ListItem
                className={classes.ListItem}
                button component={Link} to='/MyActions'
                selected={selectedIndex === 1}
                onClick={(event) => handleListItemClick(event, 1)}>
                <Tooltip title={"My Actions"+" => "+"Go to Approval Center for further action"}>
                  <ListItemIcon className={classes.ListItem}>
                    <AccountBoxIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="My Actions"></ListItemText>
              </ListItem>
              
              <ListItem
                className={classes.ListItem}
                button component={Link} to='/MyFVPs'
                selected={selectedIndex === 2}
                onClick={(event) => handleListItemClick(event, 2)}>
                <Tooltip title="My FVPs">
                  <ListItemIcon className={classes.ListItem}>
                    <GroupWorkIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="My FVPs"></ListItemText>
              </ListItem>

              <ListItem
                className={classes.ListItem}
                button component={Link} to='/scheduled'
                selected={selectedIndex === 3}
                onClick={(event) => handleListItemClick(event, 3)}>
                <Tooltip title="Scheduled">
                  <ListItemIcon className={classes.ListItem}>
                    <ScheduleIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Scheduled"></ListItemText>
              </ListItem>      
              {!props.IsAdmin ? null : <div>
                <Divider />
                <ListItem className={classes.ListItem} button component={Link} to='/Location'
                selected={selectedIndex === 4}
                onClick={(event) => handleListItemClick(event, 4)}>
                <Tooltip title="Location">
                  <ListItemIcon className={classes.ListItem}>
                    <LocationIcon />
                  </ListItemIcon>
                </Tooltip>
                <ListItemText primary="Location"></ListItemText>
              </ListItem>
                <ListItem className={classes.ListItem} button component={Link} to='/Keywords'
                  selected={selectedIndex === 5}
                  onClick={(event) => handleListItemClick(event, 5)}>
                  <Tooltip title="Keywords">
                    <ListItemIcon className={classes.ListItem}>
                      <KeyIcon />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Keywords"></ListItemText>
                </ListItem>
                <ListItem className={classes.ListItem} button component={Link} to='/QualityAuditApprover'
                  selected={selectedIndex === 6}
                  onClick={(event) => handleListItemClick(event, 6)}>
                  <Tooltip title="Quality Audit Approver">
                    <ListItemIcon className={classes.ListItem}>
                      <HighQualityIcon />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Quality Audit Approver"></ListItemText>
                </ListItem>
                <ListItem className={classes.ListItem} button component={Link} to='/Application'
                  selected={selectedIndex === 7}
                  onClick={(event) => handleListItemClick(event, 7)}>
                  <Tooltip title="Application">
                    <ListItemIcon className={classes.ListItem}>
                      <AppsIcon />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Application"></ListItemText>
                </ListItem>
                <ListItem className={classes.ListItem} button component={Link} to='/SequentialNumber'
                  selected={selectedIndex === 8}
                  onClick={(event) => handleListItemClick(event, 8)}>
                  <Tooltip title="Sequential Number">
                    <ListItemIcon className={classes.ListItem}>
                      <TrendingUpIcon />
                    </ListItemIcon>
                  </Tooltip>
                  <ListItemText primary="Sequential Number"></ListItemText>
                </ListItem>
              </div>}

            </List>
          </div>

        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth='lg' className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12}>
                <Paper className={classes.paper}>
                  <Route exact path='/' component={() => <_FVP_All {...props} />} />
                  <Route exact path='/MyActions' component={() => <_FVP_My_Actions {...props} />} />
                  <Route exact path='/MyFVPs' component={() => <_FVP_My_Requests {...props} />} />
                  <Route exact path='/Scheduled' component={() => <Scheduled {...props} />} />
                  <Route exact path='/Location' component={() => <Location {...props} />} />
                  <Route exact path='/Keywords' component={() => <Keywords {...props} />} />
                  <Route exact path='/QualityAuditApprover' component={() => <QualityAuditApprover {...props} />} />
                  <Route exact path='/Application' component={() => <Application {...props} />} />
                  <Route exact path='/SequentialNumber' component={() => <SequentialNumber {...props} />} />
                  {/* <Route exact path="/fvp/:id" component={Query} /> */}
                  <Route exact path="/fvp/:id" component={FVPQuery} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </main>
      </HashRouter>
    </div >
  );
}
