import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Types from 'Types';
import * as actions from '../../store/actions/index';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme: any) => ({
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    button: {
        margin: theme.spacing.unit,
    },
    input: {
        display: 'none',
    },
});

class Layout extends React.Component {
    render() {
        const { classes } = this.props as any;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" color="inherit" className={classes.grow}>
                            Well Explorer
                        </Typography>
                        <input
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                            application/vnd.ms-excel"
                            className={classes.input}
                            id="contained-button-file"
                            type="file"
                            onChange={(event) => (this.props as any).onFileChanged(event.target.files, false)}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span" color="secondary" className={classes.button}>
                                Load Data
                            </Button>
                        </label>
                    </Toolbar>
                </AppBar>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Types.RootAction>) => bindActionCreators({
    onFileChanged: actions.parsePlotData,
}, dispatch);

export default withStyles(styles)(connect(null, mapDispatchToProps)(Layout));
