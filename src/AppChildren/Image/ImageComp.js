/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import "./Image.css"
import { Button } from "react-bootstrap";

export default class ImageComp extends React.Component {
  state = {
    id : this.props.imageComp.id,
    img_url : this.props.imageComp.img_url,
    height: this.props.imageComp.height,
    width: this.props.imageComp.width,
  }




renderImage = () => {
    return (
        <img draggable="false" src={this.state.img_url} style={{width:this.state.width.toString()  + "rem",height:this.state.height.toString()  + "rem"}} />
      )
}

render() {
  return (
    <>
      {/* <div className="imageDiv">
        {this.renderImage()}
        <div class='imageCompzoom'>
        <i onClick={this.zoomImageComp} type="1" class='fa-solid fa-circle-plus zoomin'></i>
            <i onClick={this.zoomImageComp}  type="2"  class='fa-solid fa-circle-minus zoomout '></i>
            </div>
      </div> */}
        {this.renderImage()}
        

    </>
  )

}
}
