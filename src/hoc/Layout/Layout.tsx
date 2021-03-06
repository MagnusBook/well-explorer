import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import Modal from '../../components/UI/Modal/Modal';
import DataConfigurator from '../../containers/DataConfigurator/DataConfigurator';

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
    state = {
        configuring: false,
        data: '',
    };

    configurationCancelledHandler = () => {
        this.setState({configuring: false});
    }

    fileChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({configuring: true});
        const reader = new FileReader();
        reader.onload = e => {
            this.setState({data: reader.result});
        };
        if (event.target.files) {
            reader.readAsText(event.target.files[0]);
        }
    }

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
                            onChange={this.fileChangedHandler}
                        />
                        <label htmlFor="contained-button-file">
                            <Button variant="contained" component="span" color="secondary" className={classes.button}>
                                Load Data
                            </Button>
                        </label>
                    </Toolbar>
                </AppBar>
                <main className={classes.Content}>
                    <Modal show={this.state.configuring} modalClosed={this.configurationCancelledHandler}>
                        <DataConfigurator data={this.state.data}/>
                    </Modal>
                    {this.props.children}
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(Layout);
