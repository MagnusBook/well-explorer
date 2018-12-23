import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    backdrop: {
        width: '100%',
        height: '100%',
        position: 'fixed' as 'fixed',
        zIndex: 100,
        left: 0,
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
};

class Backdrop extends React.Component<{ show: boolean; clicked: any }> {
    render() {
        const { classes } = this.props as any;
        return this.props.show ? <div className={classes.backdrop} onClick={this.props.clicked} /> : null;
    }
}

export default withStyles(styles)(Backdrop);
