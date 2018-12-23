import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import * as actions from '../../store/actions/index';

const styles = (theme: any) => ({
    container: {
        width: '100%',
        height: '100%',
        display: 'flex' as 'flex',
    },
    preview: {
        width: '75%',
        padding: '5px',
        marginRight: '5px',
    },
    options: {
        width: '25%',
        display: 'flex' as 'flex',
        padding: '5px',
        flexDirection: 'column' as 'column',
    },
    tableRoot: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto' as 'auto',
    },
    table: {
        minWidth: 700,
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
    submitButton: {
        margin: theme.spacing.unit,
        marginTop: 'auto' as 'auto',
    },
});

class DataConfigurator extends React.Component<{ data: string }> {
    state = {
        timeIndex: -1,
        pressureIndex: -1,
        flowIndex: -1,
    };

    handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSubmit = () => {
        const firstRow = this.props.data.split('\n', 1)[0].split(',');
        const config = {
            hasHeader: firstRow.every(cell => isNaN(+cell)),
            ...this.state,
        };
        (this.props as any).onConfigChanged(this.props.data, config);
    }

    render() {
        const { classes } = this.props as any;
        const preview = this.props.data.split('\n', 10);
        return (
            <div className={classes.container}>
                <div className={classes.preview}>
                    <Paper className={classes.tableRoot}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Row/Column</TableCell>
                                    {preview[0].split(',').map((element, i) => (
                                        <TableCell key={`col-${i}`}>{i}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {preview.map((row, i) => (
                                    <TableRow key={`row-${i}`}>
                                        <TableCell>{i}</TableCell>
                                        {row.split(',').map((element, j) => (
                                            <TableCell key={`${i}-${j}`}>{element}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
                <div className={classes.options}>
                    <form autoComplete="off" autoCorrect="off">
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="time-helper">Time Column</InputLabel>
                            <Select
                                value={this.state.timeIndex}
                                onChange={this.handleChange}
                                input={<Input name="timeIndex" id="time-helper" />}
                            >
                                <MenuItem value={-1}>
                                    <em>None</em>
                                </MenuItem>
                                {preview[0].split(',').map((element, i) => (
                                    <MenuItem value={i} key={`time-${i}`}>{i.toString()}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Select the column containing the time data</FormHelperText>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="pressure-helper">Pressure Column</InputLabel>
                            <Select
                                value={this.state.pressureIndex}
                                onChange={this.handleChange}
                                input={<Input name="pressureIndex" id="pressure-helper" />}
                            >
                                <MenuItem value={-1}>
                                    <em>None</em>
                                </MenuItem>
                                {preview[0].split(',').map((element, i) => (
                                    <MenuItem value={i} key={`pressure-${i}`}>{i.toString()}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Select the column containing the pressure data</FormHelperText>
                        </FormControl>
                        <FormControl className={classes.formControl}>
                            <InputLabel htmlFor="flow-helper">Flow Column</InputLabel>
                            <Select
                                value={this.state.flowIndex}
                                onChange={this.handleChange}
                                input={<Input name="flowIndex" id="flow-helper" />}
                            >
                                <MenuItem value={-1}>
                                    <em>None</em>
                                </MenuItem>
                                {preview[0].split(',').map((element, i) => (
                                    <MenuItem value={i} key={`flow-${i}`}>{i.toString()}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>Select the column containing the flow data</FormHelperText>
                        </FormControl>
                    </form>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.submitButton}
                        onClick={this.handleSubmit}
                        disabled={this.state.timeIndex < 0 || this.state.pressureIndex < 0 || this.state.flowIndex < 0}
                    >
                        Plot Data
                    </Button>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    onConfigChanged: actions.parsePlotData,
}, dispatch);

export default withStyles(styles)(connect(null, mapDispatchToProps)(DataConfigurator));
