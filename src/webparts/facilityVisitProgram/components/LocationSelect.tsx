import * as React from "react";
import { ListView, IViewField, SelectionMode } from '@pnp/spfx-controls-react/lib/ListView';
import { Paper, Grid } from "@material-ui/core";
const viewFields: IViewField[] = [
    {
        name: 'Department',
        displayName: 'Department',
        //linkPropertyName: 'c',
        isResizable: true,
        sorting: true,
        minWidth: 200,
        maxWidth: 250
    },
    {
        name: 'PlantArea',
        displayName: 'Plant Area',
        //linkPropertyName: 'c',
        isResizable: true,
        sorting: true,
        minWidth: 300,
        maxWidth: 500
    },


    {
        name: 'AreaDescription',
        displayName: 'Area Description',
        //linkPropertyName: 'c',
        isResizable: true,
        sorting: true,
        minWidth: 400,
        maxWidth: 500
    },
    {
        name: 'LocationCode',
        displayName: 'Location Code',
        //linkPropertyName: 'c',
        isResizable: true,
        sorting: true,
        minWidth: 100,
        maxWidth: 250
    },

];

export default function LocationSelect(props) {
    const { data, _getSelection } = props;

    return (<>
        <Grid container>
            <Paper>
                <ListView
                    items={data}
                    showFilter={true}
                    filterPlaceHolder="Search..."
                    compact={false}
                    selectionMode={SelectionMode.single}
                    selection={_getSelection}
                    viewFields={viewFields}
                ></ListView>
            </Paper>
        </Grid>
    </>);
}