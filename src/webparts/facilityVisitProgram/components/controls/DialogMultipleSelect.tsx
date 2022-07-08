import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MuiDialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import { DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    dialog: {
      position: 'relative',

    }
  }),
);

export default function DialogMultipleSelect(props) {
  const { options, handleOK, title, handleCancel, open } = props;
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);

  const handleToggle = (value: string) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

  };

  return (<>
    <MuiDialog
      //className={classes.dialogroot}
      open={open}
    //TransitionComponent={Transition}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <List className={classes.root}>
          {options.map((value) => {
            const labelId = `checkbox-list-label-${value}`;

            return (
              <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    color="primary"
                    checked={checked.indexOf(value) !== -1}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText primary={value} />

              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={() => {
          handleOK(checked);
          setChecked([]);
        }}>Ok</Button>
        <Button color="primary" onClick={handleCancel}>Cancel</Button>
      </DialogActions>
    </MuiDialog>
  </>
  );
}
