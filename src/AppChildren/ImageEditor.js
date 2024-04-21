/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Text from "./Text/Text";
import { useState, useEffect } from 'react';
import { CardImg } from "react-bootstrap";

// let [currTextComp, setCurrTextComp] = useState(null);
export default class ImageEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      TextComps:{"text1" :{ id: "text1", x: 0, y: 0 }},
      currTextComp: null
    };
    ImageEditor.currTextComp = null
    ImageEditor.offset = [0, 0]
    ImageEditor.isDown = false
  }

  PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
      dpr = window.devicePixelRatio || 1,
      bsr = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
  })();

  renderImage = () => {
    let mainCan = document.getElementById("mainCanvas")

    let mainCanCtx = mainCan.getContext("2d")
    Object.keys(this.state.TextComps).forEach(textCompID => {
      let currTextComp = document.querySelector("[name='"+textCompID+"']");
      let dx = parseInt(currTextComp.style.left.slice(0, -2))
      let dy = parseInt(currTextComp.style.top.slice(0, -2))
      console.log(dx,dy);
      mainCanCtx.drawImage(document.getElementById(textCompID),dx,dy);
    })
    document.getElementById("output").appendChild(mainCan)
    document.querySelector(".imageEditorDiv").style.display = "none"
    // console.log(mainCan.toDataURL());
    // window.open(mainCan.toDataURL(), "_blank");

  }

  saveImage = (e) => {
    let compName = e.target.type
    let imgUrl
    if (compName == "file") {
      imgUrl = URL.createObjectURL(e.target.files[0]);

    }
    else if (compName == "text") {
      imgUrl = e.target.value
    }
    var img = new Image();
    img.crossOrigin="anonymous"
    img.onload = (e) => {
      var canvas = document.getElementById('mainCanvas');
      var ctx = canvas.getContext('2d');
      var ratio = this.PIXEL_RATIO
      ctx.reset()

      var hRatio = canvas.width / img.width;
      var vRatio = canvas.height / img.height;
      var ratio = Math.min(hRatio, vRatio);
      canvas.height = img.height 
      canvas.width = img.width 
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width * ratio, img.height * ratio);
    };
    img.onerror = (error) => {
      console.log("error while getting image : ", error);
    };
    img.src = imgUrl
  }

  setCoords = (id,x,y) => {
    let tempTextComps = this.state.TextComps
    tempTextComps[id].x = x 
    tempTextComps[id].y = y
    this.setState({TextComps : tempTextComps})
  }
  
  addTextComp = () => {
    let tempTextComps = this.state.TextComps
    let newId = "text"+(Object.values(tempTextComps).length + 1)
    tempTextComps[newId] = {
      id: newId, 
      x: 0, 
      y: 0,
      

    }
    this.setState({TextComps : tempTextComps})
  }

  removeTextComp = (id) => {
    let tempTextComps = this.state.TextComps
    delete tempTextComps[id]
    this.setState({TextComps : tempTextComps})
  }

  addListeners = () => {
    let textComponentDivs = document.querySelectorAll(".textComponentDiv")
    textComponentDivs.forEach((textComp) => {
      textComp.addEventListener('mousedown', function (e) {
        console.log("pressed");
        ImageEditor.isDown = true;
        ImageEditor.offset = [
          textComp.offsetLeft - e.clientX,
          textComp.offsetTop - e.clientY
        ];
        ImageEditor.currTextComp = textComp
      }, true);
    })

    let imageEditorDiv = document.querySelector(".imageEditorDiv")

    imageEditorDiv.addEventListener('mouseup', function () {
      ImageEditor.isDown = false;
      ImageEditor.currTextComp = null
    }, true);

    

    imageEditorDiv.addEventListener('mousemove', function (event) {
      event.preventDefault();
      if (ImageEditor.isDown && ImageEditor.currTextComp) {
        ImageEditor.mousePosition = {

          x: event.clientX,
          y: event.clientY

        };
        ImageEditor.currTextComp.style.left = (ImageEditor.mousePosition.x + ImageEditor.offset[0]) + 'px';
        ImageEditor.currTextComp.style.top = (ImageEditor.mousePosition.y + ImageEditor.offset[1]) + 'px';
      }
    }, true);
  }
  

  componentDidMount = () => {
    this.addListeners()
  }
  componentDidUpdate = () => {
    this.addListeners()
  }

  render() {
    return (
      <>
        <input type="file" onChange={this.saveImage}></input>
        <input type="text" onChange={this.saveImage}></input>
        <button className="btn btn-primary" onClick={this.addTextComp}>Add Text</button>
        <div className="imageEditorDiv">

          <canvas id='mainCanvas'>

          </canvas>
          {Object.values(this.state.TextComps).map(textComp => {
            return <div name={textComp.id} style={{ left: textComp.x, top: textComp.y }}  className="textComponentDiv"><Text removeTextComp={this.removeTextComp} canId={textComp.id}></Text></div>
          })}
        </div>
        <button className="btn btn-primary" onClick={this.renderImage}>Render</button>

        <div id="output"></div>

      </>
    )
  }
}
