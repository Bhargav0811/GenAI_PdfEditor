/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Text from "./Text/Text";
import { useState, useEffect } from 'react';
import { CeardImg } from "react-bootstrap";
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import "../css/FileUpload.css"

export default class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount = () => {

    let setFile = (file) => {
        this.props.setFile(file)
        this.props.setCurrPage("/PdfEditor")
    }
    var isAdvancedUpload = function() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
      }();
      
      let draggableFileArea = document.querySelector(".drag-file-area");
      let browseFileText = document.querySelector(".browse-files");
      let uploadIcon = document.querySelector(".upload-icon");
      let dragDropText = document.querySelector(".dynamic-message");
      let fileInput = document.querySelector(".default-file-input");
      let cannotUploadMessage = document.querySelector(".cannot-upload-message");
      let cancelAlertButton = document.querySelector(".cancel-alert-button");
      let uploadedFile = document.querySelector(".file-block");
      let fileName = document.querySelector(".file-name");
      let fileSize = document.querySelector(".file-size");
      let progressBar = document.querySelector(".progress-bar");
      let removeFileButton = document.querySelector(".remove-file-icon");
      let uploadButton = document.querySelector(".upload-button");
      let blankDocumentButton = document.querySelector(".upload-files-blank-container");
      let fileFlag = 0;
      
      fileInput.addEventListener("click", () => {
          fileInput.value = '';
      });
      
      fileInput.addEventListener("change", e => {
          uploadIcon.innerHTML = 'check_circle';
          dragDropText.innerHTML = 'File Dropped Successfully!';
          document.querySelector(".label").innerHTML = `drag & drop or <span className="browse-files"> <input type="file" className="default-file-input" style=""/> <span className="browse-files-text" style="top: 0;"> browse file</span></span>`;
          uploadButton.innerHTML = `Upload`;
          fileName.innerHTML = fileInput.files[0].name;
          fileSize.innerHTML = (fileInput.files[0].size/1024).toFixed(1) + " KB";
          uploadedFile.style.cssText = "display: flex;";
          progressBar.style.width = 0;
          fileFlag = 0;
      });



      
      uploadButton.addEventListener("click", () => {
          let isFileUploaded = fileInput.value;
          if(isFileUploaded != '') {
              if (fileFlag == 0) {
                  fileFlag = 1;
                  var width = 0;
                  var id = setInterval(frame, 50);
                  function frame() {
                        if (width >= 90) {
                          clearInterval(id);
                          uploadButton.innerHTML = `<span className="material-icons-outlined upload-button-icon"> check_circle </span> Uploaded`;

                         setFile(fileInput.files[0])

                        
                        } else {
                          width += 5;
                          progressBar.style.width = width + "%";
                        }
                  }
                }
          } else {
              cannotUploadMessage.style.cssText = "display: flex; animation: fadeIn linear 1.5s;";
          }
      });
      
      cancelAlertButton.addEventListener("click", () => {
          cannotUploadMessage.style.cssText = "display: none;";
      });
      
      if(isAdvancedUpload) {
          ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach( evt => 
              draggableFileArea.addEventListener(evt, e => {
                  e.preventDefault();
                  e.stopPropagation();
              })
          );
      
          ["dragover", "dragenter"].forEach( evt => {
              draggableFileArea.addEventListener(evt, e => {
                  e.preventDefault();
                  e.stopPropagation();
                  uploadIcon.innerHTML = 'file_download';
                  dragDropText.innerHTML = 'Drop your file here!';
              });
          });
      
          draggableFileArea.addEventListener("drop", e => {
              uploadIcon.innerHTML = 'check_circle';
              dragDropText.innerHTML = 'File Dropped Successfully!';
              document.querySelector(".label").innerHTML = `drag & drop or <span className="browse-files">  <span className="browse-files-text" style="top: -23px; left: -20px;"> browse file</span> </span>`;
              uploadButton.innerHTML = `Upload`;
              
              let files = e.dataTransfer.files;
              fileInput.files = files;
              fileName.innerHTML = files[0].name;
              fileSize.innerHTML = (files[0].size/1024).toFixed(1) + " KB";
              uploadedFile.style.cssText = "display: flex;";
              progressBar.style.width = 0;
              fileFlag = 0;
          });
      }
      
      removeFileButton.addEventListener("click", () => {
          uploadedFile.style.cssText = "display: none;";
          fileInput.value = '';
          uploadIcon.innerHTML = 'file_upload';
          dragDropText.innerHTML = 'Drag & drop any file here';
          document.querySelector(".label").innerHTML = `or <span className="browse-files"> <input type="file" className="default-file-input"/> <span className="browse-files-text">browse file</span> <span>from device</span> </span>`;
          uploadButton.innerHTML = `Upload`;
      });
      blankDocumentButton.addEventListener("click", () => {
        setFile(null)
    });
  }

  

  render() {
    return (
        <>
<form className="form-container" enctype='multipart/form-data'>
<div className="upload-files-outer-container">
    <div onClick="" className="upload-files-blank-container">

<NoteAddIcon></NoteAddIcon>
Start With New Template
    </div>
		
	<div className="upload-files-inner-container">
		<div className="drag-file-area">
			<span className="material-icons-outlined upload-icon"> file_upload </span>
			<h3 className="dynamic-message"> Drag & drop any file here </h3>
			<label className="label"> or <span className="browse-files"> <input type="file" className="default-file-input"/> <span className="browse-files-text">browse file</span> <span>from device</span> </span> </label>
		</div>
		<span className="cannot-upload-message"> <span className="material-icons-outlined">error</span> Please select a file first <span className="material-icons-outlined cancel-alert-button">cancel</span> </span>
		<div className="file-block">
			<div className="file-info"> <span className="material-icons-outlined file-icon">description</span> <span className="file-name"> </span> | <span className="file-size">  </span> </div>
			<span className="material-icons remove-file-icon">delete</span>
			<div className="progress-bar"> </div>
		</div>
		<button type="button" className="upload-button"> Upload </button>
	</div>
	</div>

</form>

      </>
    )
  }
}
