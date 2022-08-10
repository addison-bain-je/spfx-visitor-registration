import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'FacilityVisitProgramWebPartStrings';
import FacilityVisitProgram from './components/FacilityVisitProgram';
import { IFacilityVisitProgramProps } from './components/IFacilityVisitProgramProps';
import { SPPermission } from '@microsoft/sp-page-context';

export interface IFacilityVisitProgramWebPartProps {
  description: string;

}


export default class FacilityVisitProgramWebPart extends BaseClientSideWebPart<IFacilityVisitProgramWebPartProps> {
  public render(): void {
    let permission = new SPPermission(this.context.pageContext.web.permissions.value);
    const IsAdmin = permission.hasAllPermissions(SPPermission.manageWeb);
    const element: React.ReactElement<IFacilityVisitProgramProps> = React.createElement(
      FacilityVisitProgram,
      {
        description: this.properties.description,
        context: this.context,
        IsAdmin: IsAdmin
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
