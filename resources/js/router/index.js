import React from 'react';
import { Switch, BrowserRouter, Route } from 'react-router-dom';
import Home from '../views/Home'
import Test from '../views/Test'
import Navigation from "../components/Navigation";
import {Container} from "postcss";
import {Navbar} from "react-bootstrap";
function Router(props) {
    return (
        <div>
            <BrowserRouter>
                <Navigation />


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
