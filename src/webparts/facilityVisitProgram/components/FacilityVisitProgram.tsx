import * as React from 'react';
import { IFacilityVisitProgramProps } from './IFacilityVisitProgramProps';
import Main from './main';
import { service } from '../service/service';
interface IFacilityVisitProgramState {
  currentUserGroups: any[];
  allRoles: any[];
  userRoles: string;
}
export default class FacilityVisitProgram extends React.Component<IFacilityVisitProgramProps, IFacilityVisitProgramState> {
  private _service: service;
  constructor(props: IFacilityVisitProgramProps, state: IFacilityVisitProgramState) {
    super(props);
    this.state = {
      currentUserGroups: [],
      allRoles: [],
      userRoles: ''
    };
    this._service = new service(this.props.context, this.props.context.pageContext);
    
  }

  private async getUserGroups(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._service.getCurrentUserGroups().then((items: any[]) => {
        const result = [];
        items.map((item) => {
          result.push(String(item.Id));
        });
        this.setState({ currentUserGroups: result });
        resolve();
      });
    });
  }

  private async getAllGroupsRoles(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      this._service.getAllrecords("GroupRole").then((items: any[]) => {
        const result = [];
        items.map((item) => {
          result.push({
            UserGroup: String(item.UserGroup),
            Role: item.Role,
          });
        });
        this.setState({ allRoles: result });
        resolve();
      });
    });
  }

  public componentDidMount() {
    this.getAllGroupsRoles().then(() => {
      this.getUserGroups().then(() => {
        const result = [];
        this.state.allRoles.forEach(item => {
          if (this.state.currentUserGroups.indexOf(item.UserGroup) != -1)
            result.push(item.Role);
        });
        this.setState({ userRoles: result.toString() });
      });
    });
  }
  public render(): React.ReactElement<IFacilityVisitProgramProps> {
    return (
      <Main context={this.props.context} userRoles={this.state.userRoles} />
    );
  }
}
