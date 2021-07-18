import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';

function Example() {
    return (
        <Fragment>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card">
                            <div className="card-header">Test Komponente</div>

                            <div className="card-body">Bitte weitergehen! Das ist nur ein Test!</div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Example;

if (document.getElementById('example')) {
    ReactDOM.render(<Example />, document.getElementById('example'));
}
