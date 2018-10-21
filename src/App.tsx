import * as React from 'react';

import Layout from './hoc/Layout/Layout';
import Plot from './containers/Plot/Plot';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Layout>
          <Plot />
        </Layout>
      </div>
    );
  }
}

export default App;
