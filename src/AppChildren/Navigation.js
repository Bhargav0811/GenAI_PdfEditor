/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Navigation.css";
// import DefaultUserImage from "../../../../assets/images/profile_placeholder.png";
// import image1 from "../../../../assets/images/LOGO2.png"
// import Divider from "./divider";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
/**
 * The class declaration for the navbar
 */
class Navigation extends Component {


  render = () => {
    return (
      <>

        <div class="navigation-wrap bg-light start-header start-style">
                <nav class="navbar navbar-expand-md navbar-light">

                  <a target="_blank">
                    <img  src="https://encrypted-tbn0.gstatic.com/https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8WwwEclAJv-Nbh4EHQkCU4Z1t29Vg4csSSaJO6cHWSEXiekKQBpXr6snkX2MqKoICePQ&usqp=CAU?q=tbn:ANd9GcSrD-t4_t-BqxS9sRNi_PHjH2wx1VxWJxxD8VXpFCkyfPSMyhATMzObFsufXKfstE6NDvY&usqp=CAU" alt=""/>

                    </a>

                  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                  </button>



                </nav>
              </div>
      </>
    );
  };
}


export default Navigation;
