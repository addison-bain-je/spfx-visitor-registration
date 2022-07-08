import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MarketingCoordinatorItem } from './ItemDefine';
import MuiFormControl from "@material-ui/core/FormControl";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '80%',
                margin: theme.spacing(1),
            }
        }
    });

interface FormProps {
    context: WebPartContext;
    formInitialValues: MarketingCoordinatorItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
}

const validationSchema =
    Yup.object({
        MarketingCoordinator: Yup.string().required("required"),
    });

class MarketingCoordinatorForm extends React.Component<FormProps> {
    private _service: service;
    private initialValues: MarketingCoordinatorItem;
    constructor(props: FormProps) {
        super(props);
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context, this.props.context.pageContext);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        //console.log(JSON.stringify(values, null, 2));
        setTimeout(() => {
            setSubmitting(false);
            if (values.ID != null) {
                var v = {
                    MarketingCoordinator: values.MarketingCoordinator,
                };
                this._service.updateItem("MarketingCoordinator", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else
                this._service.createItem("MarketingCoordinator", values).then(() => { this.props.refreshData(); });
            resetForm();
            this.props.closeForm();
        }, 1000);
    }

    public render() {

        const { classes } = this.props;
        return (
            <>
                <Paper>
                    <Formik
                        initialValues={this.initialValues}
                        validationSchema={validationSchema}
                        onSubmit={this.onSubmit}
                    >
                        {({ errors, handleSubmit, touched, setFieldValue, values, handleReset, isSubmitting }) => (
                            <form id="MarketingCoordinatorForm" className={classes.root} autoComplete="off" onReset={() => { handleReset(); }} onSubmit={handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <MuiFormControl
                                            variant="outlined"
                                            error={errors.MarketingCoordinator != null}
                                            margin='dense'
                                            size='medium'
                                            
                                        >
                                            <FormLabel>Marketing Coordinator</FormLabel>
                                            <PeoplePicker
                                                context={this.props.context}
                                                personSelectionLimit={1}
                                                groupName={""} // Leave this blank in case you want to filter from all users
                                                showtooltip={true}
                                                isRequired={false}
                                                disabled={!this.props.editForm}
                                                ensureUser={true}
                                                selectedItems={(items) => {
                                                    if (items.length != 0) {
                                                        setFieldValue("MarketingCoordinator", items[0].text);

                                                    }
                                                    else
                                                        setFieldValue("MarketingCoordinator", "");
                                                }}
                                                showHiddenInUI={true}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                defaultSelectedUsers={[values.MarketingCoordinator]}
                                            />
                                            <FormHelperText>{errors.MarketingCoordinator}</FormHelperText>
                                        </MuiFormControl>


                                    </Grid>
                                </Grid>
                            </form>)}
                    </Formik>
                </Paper>
            </>
        );
    }
}
export default withStyles(styles)(MarketingCoordinatorForm);
