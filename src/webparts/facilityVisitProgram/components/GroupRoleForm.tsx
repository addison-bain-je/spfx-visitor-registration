import * as React from 'react';
import * as Yup from 'yup';
import { Grid, TextField, Divider, Paper, FormControl, InputLabel, FormLabel, FilledInput, FormHelperText, Input } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { service } from '../service/service';
import { createStyles, Theme } from "@material-ui/core/styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { GroupRoleItem, CheckBoxOptionItem, SelectOptionItem } from './ItemDefine';
import Controls from './controls/Controls';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                width: '100%',
                margin: theme.spacing(0.5),
            }
        }
    });

interface FormProps {
    context: WebPartContext;
    formInitialValues: GroupRoleItem;
    closeForm: any;
    refreshData: any;
    classes?: any;
    editForm: boolean;
    RoleOptions: CheckBoxOptionItem[];
    UserGroupOptions: SelectOptionItem[];
}

const validationSchema =
    Yup.object({
        UserGroup: Yup.string().required("required"),
        Role: Yup.string().required("required"),
    });

class GroupRoleForm extends React.Component<FormProps> {
    private _service: service;
    private initialValues: GroupRoleItem;
    constructor(props: FormProps) {
        super(props);
        this.initialValues = this.props.formInitialValues;
        this._service = new service(this.props.context);
    }

    private onSubmit = (values, { setSubmitting, resetForm }) => {
        setTimeout(() => {
            JSON.stringify(values, null, 2);
            setSubmitting(false);
            if (values.ID != null) {
                var v = {
                    UserGroup: values.UserGroup,
                    Role: values.Role,
                };
                this._service.updateItem("GroupRole", v, Number(values.ID)).then(() => { this.props.refreshData(); });
            }
            else
                this._service.createItem("GroupRole", values).then(() => { this.props.refreshData(); });
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
                        {(formik) => (
                            <form id="GroupRoleForm" className={classes.root} autoComplete="off" onReset={() => { formik.handleReset(); }} onSubmit={formik.handleSubmit} >
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        <Controls.Select
                                            name="UserGroup"
                                            label="User Group"
                                            value={formik.values.UserGroup}
                                            options={this.props.UserGroupOptions}
                                            onChange={formik.handleChange}
                                            error={formik.errors.UserGroup && formik.touched.UserGroup
                                                ? formik.errors.UserGroup
                                                : null}
                                            disabled={!this.props.editForm}
                                        />

                                        <Field
                                            name="Role"
                                        >
                                            {(fieldProps) => {
                                                return (
                                                    <Controls.CheckBoxGroup
                                                        onChange={(checkedValues) => {
                                                            if (checkedValues.length == 0)
                                                                fieldProps.form.setFieldValue("Role", '');
                                                            else
                                                                fieldProps.form.setFieldValue("Role", JSON.stringify(checkedValues, null, 2));
                                                        }}
                                                        data={this.props.RoleOptions}
                                                        label="Role"
                                                        error={formik.errors.Role && formik.touched.Role
                                                            ? formik.errors.Role
                                                            : null}
                                                        disabled={!this.props.editForm}
                                                    />);

                                            }}
                                        </Field>


                                    </Grid>
                                </Grid>
                            </form>)}
                    </Formik>
                </Paper>
            </>
        );
    }
}
export default withStyles(styles)(GroupRoleForm);


/*
<MuiFormControl
                                            variant="outlined"
                                            error={errors.Name != null}
                                            margin='dense'
                                            size='medium'
                                        >
                                            <FormLabel>Name</FormLabel>
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
                                                        setFieldValue("Name", items[0].text);
                                                    }
                                                    else
                                                        setFieldValue("Name", "");
                                                }}
                                                showHiddenInUI={true}
                                                principalTypes={[PrincipalType.User]}
                                                resolveDelay={1000}
                                                defaultSelectedUsers={[values.Name]}
                                            />
                                            <FormHelperText>{errors.Name}</FormHelperText>
                                        </MuiFormControl>
                                        */