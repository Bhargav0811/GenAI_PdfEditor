/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Document, Page } from 'react-pdf';
import { Link } from "react-router-dom";
import "../../css/Home.css"
/**
 * The class declaration for the navbar
 */
class Home extends Component {

  templates = {
    "Birthday": ["1_tt1.pdf", "1_tt2.pdf", "1_tt3.pdf","1_tt4.pdf"],
    "Wedding": ["2_tt1.pdf", "2_tt2.pdf", "2_tt3.pdf","2_tt4.pdf"],
    "Multi Purpose" : ["3_tt1.pdf", "3_tt2.pdf", "3_tt3.pdf","3_tt4.pdf"]
  }
  createBlobFromFilePath = (filePath,props) => {
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const blob = new Blob([event.target.result]);
      props.setFile(blob)
      props.setCurrPage("/PdfEditor")

    };
  
    fetch(filePath)
      .then(response => response.blob())
      .then(blob => {
        reader.readAsArrayBuffer(blob);
      })
      .catch(error => {
        console.error('Error reading file:', error);
      });
  }

  selectTemplate = (e) => {
    let currTemplatePath = e.target.parentElement.parentElement.attributes.filepath.value
    this.createBlobFromFilePath(currTemplatePath,this.props);
  }


  render = () => {
    return (
      <div className="homeDiv">
        <div className="thumbnailDiv">
          {
            (Object.entries(this.templates).map((template) => {
              let templateTitle = template[0]
              let fileNames = template[1]
              return (
                <div className="thumbnail-row">
                  <hr />
                  <h2 className="thumbnailTitle">{templateTitle}</h2>
                  <hr />
                  <div className="thumbnailList">
                  {
                    (fileNames.map((fileName) => {
                      return (
                        <div filepath={"/templates/"+fileName} onClick={this.selectTemplate}>
                          <Document
                            className="thumbnailContainer"
                            file={"/templates/"+fileName}
                          >
                          <i class="fa-solid editTemplateIcon fa-pen-to-square"></i>
                            <Page
                              className="thumbnailPage"

                              pageNumber={1}
                              width={100}
                            />
                          </Document>
                        </div>
                      )
                    }))
                  }
                  </div>
                </div>
              )
            }))
          }

          {/* <Document
            file={"/templates/t1_2.pdf"}
          >
            <Page
              pageNumber={1}
              width={100}
            />
          </Document> */}
        </div>
        <Button className="addBtn" onClick={(e) => { this.props.setCurrPage("/uploadFile") }}>+</Button>
      </div>
    );
  };
}


export default Home;
