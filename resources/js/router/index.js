import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import Home from "../views/Home";
import Test from "../views/Test";
import Navigation from "../components/Navigation";
import Qualifications from "../components/qualifications/Qualifications";
import UpdateQualification from "../components/qualifications/update/UpdateQualification";
import CreateQualification from "../components/qualifications/create/CreateQualification";
import Employees from "../components/employees/Employees";
import Duties from "../components/duties/Duties";
import UpdateEmployee from "../components/employees/update/UpdateEmployee";
import CreateEmployee from "../components/employees/create/CreateEmployee";
import Shifts from "../components/shifts/Shifts";
import ShiftTypes from "../components/shift_types/ShiftTypes";
import UpdateShift from "../components/shifts/update/UpdateShift";
import CreateShift from "../components/shifts/create/CreateShift";
import UpdateShiftType from "../components/shift_types/update/UpdateShiftType";
import CreateShiftType from "../components/shift_types/create/CreateShiftType";

function Router() {
    return (
        <div>
            <BrowserRouter>
                <Navigation />
                <div className="py-4">
                    <Switch>
                        <Route path="/test" component={Test} />
                        <Route
                            path="/qualification/edit/:id"
                            component={UpdateQualification}
                        />
                        <Route
                            path="/qualification/create"
                            component={CreateQualification}
                        />
                        <Route
                            path="/qualifications"
                            component={Qualifications}
                        />
                        <Route path="/shift/edit/:id" component={UpdateShift} />
                        <Route path="/shift/create" component={CreateShift} />
                        <Route path="/shifts" component={Shifts} />
                        <Route
                            path="/shift_type/edit/:id"
                            component={UpdateShiftType}
                        />
                        <Route
                            path="/shift_type/create"
                            component={CreateShiftType}
                        />

                        <Route path="/shift_types" component={ShiftTypes} />
                        <Route
                            path="/employee/edit/:id"
                            component={UpdateEmployee}
                        />
                        <Route
                            path="/employee/create"
                            component={CreateEmployee}
                        />
                        <Route path="/employees" component={Employees} />
                        <Route path="/duties" component={Duties} />
                        <Route exact path="/" component={Duties} />
                    </Switch>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default Router;
