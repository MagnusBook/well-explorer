import * as React from 'react';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Types from 'Types';
import * as actions from '../../../store/actions/index';

class FileButton extends React.Component {
    render() {
        return (
            <div>
                <h1>Hi, I'm a button lmao</h1>
            </div>
        );
    }
}

const mapStateToProps = (state: Types.RootState) => ({
    hasHeader: state.plot.hasHeader,
});

const mapDispatchToProps = (dispatch: Dispatch<Types.RootAction>) => bindActionCreators({
    onFileChanged: actions.parsePlotData,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FileButton);
