/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./Text.css"
import { Button } from "react-bootstrap";

export default class Text extends React.Component {
  state = {
    fontFamily: this.props.textComp.fontFamily,
    fontSize: this.props.textComp.fontSize,
    textContent: this.props.textComp.textContent,
    color: this.props.textComp.color
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
  canvasPadding = 10

  updateCanvas = (can) => {
    can.style.width = this.state.width+"px"
    can.style.height = this.state.height+"px"

    can.width = this.state.width;
    can.height = this.state.height;
    // console.log(can.toDataURL());
  }

  createHiDPICanvas = function (id, ratio) {
    if (!ratio) { ratio = this.PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.id = id
    // this.updateCanvas(can)
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
  }

  fontFamily = ["Arial", "Times new roman", "terminal", "Freestyle Script Regular", "Noto Sans Gujarati"]




componentDidMount = () => {
  setTimeout(()=>{
    let canvasDiv = document.getElementById(this.props.textComp.id + "CanvasDiv")
  // console.log(this.props.textComp.id);
  // console.log(canvasDiv);
  if(canvasDiv && canvasDiv.querySelectorAll("#"+this.props.textComp.id).length==0)
  {
    canvasDiv.appendChild(this.createHiDPICanvas(this.props.textComp.id))

    this.upadateComp()
  }
  },1000)
}

componentDidUpdate = () => {
  this.upadateComp()
}

upadateComp = () => {
  const can = document.getElementById(this.props.textComp.id)
  console.log(can);
  // this.updateCanvas(can)
  const ctx = can.getContext("2d");
  console.log(ctx);
  ctx.clearRect(0, 0, can.width, can.height)
  // ctx.setFont("20px Britannic")
  ctx.font = "20px Britannic"
  // ctx.font = this.state.fontSize + "px " + this.state.fontFamily;
  ctx.fillStyle = this.state.color
  console.log("before",ctx);
  let w = parseInt(ctx.measureText(this.state.textContent).width) + this.canvasPadding*2; 
  let h = this.state.fontSize + this.canvasPadding*2;
  if(w!=this.state.width || h!=this.state.height)
  {
    this.setState({width: w,height: h})
  }


  // can = document.getElementById(this.props.textComp.id)
  // ctx = can.getContext("2d");
  // console.log("first: ",ctx);
  // console.log(this.state.fontSize);
  // console.log(this.state.fontFamily);
  // console.log(this.state.color);
  // ctx["font"] = this.state.fontSize + "px " + this.state.fontFamily;
  // ctx.font = this.state.fontSize + "px " + this.state.fontFamily;
  // console.log(ctx.font);
  // ctx["fillStyle"] = this.state.color
  // console.log(ctx.fillStyle);
  // console.log("second: ",ctx);
  // ctx.fillRect(0, 0, w, h);
  console.log("after",ctx);
  ctx.fillText(this.state.textContent,50,50);
  this.updateCanvas(can)
}

renderFontFamily = () => {
  return this.fontFamily.map((fontF) => {
    return <option value={fontF}>{fontF}</option>
  })
}

renderCanvasDiv = () => {
  return (
    <div  className="textCanvasDiv" id={this.props.textComp.id + "CanvasDiv"}></div>
  )
}



render() {
  return (
    <>
      <div className="textDiv">

        {/* <div className="textEditor">
          
        <button className="btn btn-primary" onClick={(e) => {this.props.removeTextComp(this.props.textComp.id)}}>Remove</button>
          <hr />
          <label>Color : </label>
          <input value={this.state.color} onChange={(e) => this.setState({ color: e.target.value })} type='color'></input>
          <hr />
           <label>Size : </label>
          <input name="size" value={this.state.fontSize} onChange={this.updateFontSize} type='number'></input>
          <hr />
          <br />
          <label>Text : </label>

          <input className="textInput" style={{ fontFamily: this.state.fontFamily }} value={this.state.textContent} onChange={(e) => this.setState({ textContent: e.target.value })} type='text'></input>
          <hr />
          <br />
          <label>fontFamily : </label>
          <select
            id="fontFamily"
            value={this.state.fontFamily}
            onChange={(e) => this.setState({ fontFamily: e.target.value })}
            required
          >
            {this.renderFontFamily()}
          </select>
          <hr />
          <br />
        </div> */}

        {this.renderCanvasDiv()}
      </div>

    </>
  )

}
}
