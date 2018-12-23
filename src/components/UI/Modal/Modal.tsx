import * as React from 'react';

import { withStyles } from '@material-ui/core/styles';

import Aux from '../../../hoc/Auxilary/Auxilary';
import Backdrop from '../Backdrop/Backdrop';

const styles = {
    modal: {
        position: 'fixed' as 'fixed',
        zIndex: 500,
        backgroundColor: 'white',
        width: '70%',
        border: '1px solid #ccc',
        boxShadow: '1px 1px 1px black',
        padding: '16px',
        left: '15%',
        top: '30%',
        boxSizing: 'border-box' as 'border-box',
        transition: 'all 0.3s ease - out',
    },
};

class Modal extends React.Component<{ show: boolean; modalClosed: any }> {
    render() {
        const { classes } = this.props as any;
        return (
            <Aux>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div
                    className={classes.modal}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-100vh)',
                        opacity: this.props.show ? 1 : 0,
                    }}
                >
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default withStyles(styles)(Modal);
