import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import Home from '../views/Home'
import Test from '../views/Test'
import Navbar from '../components/Navbar';
function Router(props) {
    return (
        <div>
            <BrowserRouter>
                <Navbar />
                <div className="py-4">
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route path="/test" component={Test} />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Router;
