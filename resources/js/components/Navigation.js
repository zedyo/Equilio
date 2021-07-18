import React, {Fragment} from 'react';
import {Link} from "react-router-dom";
import {Container} from "react-bootstrap";
import {Navbar} from "react-bootstrap";
import {Nav} from "react-bootstrap";

function Navigation(props) {
    return (
        <Fragment>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand href="/">Project Yeti</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/duties">Dientsplan</Nav.Link>
                        <Nav.Link href="/employees">Angestellte</Nav.Link>
                        <Nav.Link href="/qualifications">Qualifikationen</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </Fragment>
    );
}

export default Navigation;
