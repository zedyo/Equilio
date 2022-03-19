import React, { Fragment } from "react";
import { Container } from "react-bootstrap";
import { Navbar } from "react-bootstrap";
import { Nav } from "react-bootstrap";

function Navigation() {
    return (
        <Fragment>
            <Navbar bg="light" variant="light">
                <Container>
                    <Navbar.Brand href="/duties">Project Yeti</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/employees">Angestellte</Nav.Link>
                        <Nav.Link href="/qualifications">
                            Qualifikationen
                        </Nav.Link>
                        <Nav.Link href="/shift_types">Schicht Arten</Nav.Link>
                        <Nav.Link href="/shifts">Schichten</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </Fragment>
    );
}

export default Navigation;
