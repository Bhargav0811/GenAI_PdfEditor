/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Text from "./Text/Text";
import ImageComp from "./Image/ImageComp";
import { useState, useEffect, useRef, createElement } from 'react';
import ReactDOM from 'react-dom';
import { CardImg } from "react-bootstrap";
// import { Document, Page } from 'react-pdf';
// import pdfjs   from 'pdfjs-dist';
// import 'pdfjs-dist/build/pdf.worker';
import "../css/PdfEditor.css"
// import { pdfjs } from 'react-pdf';

// import { Document, Page,pdfjs } from 'react-pdf/node_modules/pdfjs-dist';
import { pdfjs } from 'react-pdf';
import jsPDF from "jspdf";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// import OpenAI from "openai";
import { Configuration, OpenAIApi } from 'openai';
import { Base64 } from 'js-base64';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import axios from "axios";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.js',
    import.meta.url,
).toString();

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.js`;


// pdfjs.GlobalWorkerOptions.workerSrc = "https://d2v5g.csb.app/pdf.worker.js";



// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.2.2/pdf.worker.js`;


class PdfEditor extends React.Component {
    state = {
        pdfBlob: this.props.file,
        numPages: null,
        TextComps: {},
        pages: [],
        currPage: 1,
        selectedText: null,
        pdfObj: null,
        text: "",
        total_image: 1,
        image_urls: [],
        currSelectedImageUrl: null,
        totalImageComp: 0,
        imageComps: [],
        image_History: [],
        imageLoading: false,
        isBlank: false
    }

    currTextComp = null
    currImageComp = null
    offset = [0, 0]
    isDown = false
    selectedImage = "blob:http://localhost:4000/db25f446-3983-4d45-8f48-4fedd3a7f272"

    query = async (data) => {
        let result;
        const configuration = new Configuration({
            apiKey: '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',
            // apiKey: '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',
            // apiKey: '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',/
        });

        const openai = new OpenAIApi(configuration);
        const response = await openai.createImage({
            prompt: this.state.text,
            n: 1,
            size: "256x256",
        });
        return response.data.data[0].url;
        // const response = await fetch(
        //     "https://api-inference.huggingface.co/models/cloudqi/cqi_text_to_image_pt_v0",
        //     // "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        //     // "https://api-inference.huggingface.co/models/Melonie/text_to_image_finetuned",
        //     {
        //         headers: { Authorization: "Bearer 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" },
        //         method: "POST",
        //         body: JSON.stringify(data),
        //     }
        // );
        // result = await response.blob()
        // return URL.createObjectURL(result)
    }

    getImage = async (text) => {
        for (let i = 0; i < this.state.total_image; i++) {
            try {
                let result;
                this.query({ "inputs": this.state.text + (i + Math.ceil(Math.random() * 10)).toString() }).then(async (result) => {
                    console.log(result);

                    // let img_url = URL.createObjectURL(result)
                    let currImageHistory = this.state.image_History
                    currImageHistory.push(result)
                    this.setState({ image_History: currImageHistory })

                    let img_url = result
                    let tempImageList = this.state.image_urls
                    tempImageList.push(img_url)
                    this.setState({ image_urls: tempImageList })
                })


                // result = "logo512.jpg"
                // let currImageHistory = this.state.image_History
                // if (!currImageHistory.includes(result)) {
                //     currImageHistory.push(result)
                //     this.setState({ image_History: currImageHistory })
                // }

                // let img_url = result
                // let tempImageList = this.state.image_urls
                // tempImageList.push(img_url)
                // this.setState({ image_urls: tempImageList })


            } catch (error) {
                console.error(error);
            }
        }

    }

    genImage = (e) => {
        let currText = this.state.text
        if (currText) {
            this.setState({ image_urls: [], imageLoading: true })
            this.getImage()
        }

    }
    selectGenImage = (e) => {
        let currSelectedImage = e.target
        let currSelectedImageUrl = currSelectedImage.src
        document.querySelectorAll(".selectedImage").forEach((currImage) => {
            currImage.classList.remove(["selectedImage"])
        })
        currSelectedImage.classList.add(["selectedImage"])
        this.setState({ currSelectedImageUrl: currSelectedImageUrl })
    }

    addImageComp = (e) => {
        let totalImageComp = this.state.totalImageComp + 1
        this.setState({ totalImageComp: totalImageComp })
        let currSelectedImageUrl = e.target.attributes.imgUrl.value
        // let insertImageDiv = document.createElement("div")
        // insertImageDiv.classList.add(["imageCompDiv"])


        let newId = "image" + totalImageComp

        let tempImageComps = this.state.imageComps

        tempImageComps[newId] =
        {
            id: newId,
            page: this.state.currPage,
            img_url: currSelectedImageUrl,
            height: 2,
            width: 2,
            top: 30,
            left: 30
        }
        this.renderImageComps(document.getElementById("previewPage"), [tempImageComps[newId]])
        this.setState({ imageComps: tempImageComps })
    }

    base64ToUint8Array = (base64) => {
        const binaryString = atob(base64);
        const length = binaryString.length;
        const uint8Array = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        return uint8Array;
    }

    saveImageComps = async () => {
        let currPdfBlob = this.state.pdfBlob
        const pdfBlobUrl = URL.createObjectURL(currPdfBlob);
        const imageUrl = "https://file-examples.com/storage/fef3ad87fb6568c5a9d7b04/2017/10/file_example_JPG_500kB.jpg";
        try {
            const pdfBuffer = await axios.get(pdfBlobUrl, { responseType: 'arraybuffer' }).then((response) => response.data);

            const pdfDoc = await PDFDocument.load(pdfBuffer);

            Object.entries(this.state.imageComps).forEach(async ([imageId, imageComp]) => {

                // const imageBuffer = await axios.get(imageUrl, { responseType: 'arraybuffer' }).then((response) => response.data);
                const imageBuffer = await axios.get(imageComp.img_url, { responseType: 'arraybuffer' }).then((response) => response.data);
                const imageObj = await pdfDoc.embedPng(imageBuffer);
                // const imageObj = await pdfDoc.embedJpg(imageBuffer);

                const pageIndex = imageComp.page - 1;
                const page = pdfDoc.getPages()[pageIndex];
                const x = imageComp.left * 1.4;
                const y = (605 - imageComp.top - imageComp.height) * 1.15;
                const width = imageComp.width * 22.33
                const height = imageComp.height * 22.33
                // const { width, height } = imageObj.scale(0.5);
                console.log(x, y, width, height);
                console.log(page.getWidth(), page.getHeight());
                page.drawImage(imageObj, {
                    x,
                    y,
                    width,
                    height,
                    opacity: 1,
                });
            })

            setTimeout(async () => {
                const modifiedPdfBlob = await pdfDoc.save();
                const blobUrl = URL.createObjectURL(new Blob([modifiedPdfBlob], { type: 'application/pdf' }));
                // window.open(blobUrl)
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'IAGAI_Template.pdf';
                link.click();
                URL.revokeObjectURL(blobUrl);

            }, 5000);
        } catch (error) {
            console.error('Error adding image to PDF:', error);
        }
    }


    changeNumber = (e) => {
        this.setState({ total_image: parseInt(e.target.value) })
    }

    changeText = (e) => {
        this.setState({ text: e.target.value })
    }





    renderPdf = async (container) => {
        container.innerHTML = ""

        let pdf, doc = new jsPDF({
            unit: 'px'
        });

        if (!this.state.pdfBlob) {
            this.setState({ pdfBlob: await doc.output('blob'), isBlank: true })
        }
        // const pdfBlobUrl = URL.createObjectURL(this.state.pdfBlob);
        // const pdfBuffer = await axios.get(pdfBlobUrl, { responseType: 'arraybuffer' }).then((response) => response.data);

        // const pdfDoc = await PDFDocument.load(pdfBuffer);
        // console.log("total pages with pdfDoc",pdfDoc.getPageCount());



        const loadingTask = await pdfjs.getDocument(URL.createObjectURL(this.state.pdfBlob));
        pdf = await loadingTask.promise;

        const pageCount = await pdf.numPages;

        doc.loadFile(this.state.pdfBlob, true);


        this.setState({ numPages: pageCount })
        var extractedPages = [];
        for (let pageNumber = 1; pageNumber <= pageCount; pageNumber++) {
            const page = await pdf.getPage(pageNumber);
            // const page = await pdfDoc.getPage(pageNumber);
            // console.log(page);
            const viewport = page.getViewport({ scale: 1 });
            const canvas = document.createElement('canvas');
            this.addThumbnail(canvas, container, pageNumber)
            const canvasContext = canvas.getContext('2d');
            canvasContext.canvas.willReadFrequently = true;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const renderContext = {
                canvasContext,
                viewport,
            };
            Promise.resolve(page.render(renderContext)).then((a) => {
                extractedPages.push(canvas);
                if (extractedPages.length == pageCount) {
                    this.setState({ pages: extractedPages, pdfObj: doc })
                    this.addThumbnail(null, container, null, true)
                    setTimeout(() => {
                        this.updateCurrPage(document.getElementById("previewPage"))
                    }, 1000)
                    this.addZoomListener(document.getElementById("previewPage"))
                }
            })



        }
    }


    addThumbnail = (thumbnail, container, pageNumber, isLast = false) => {
        let currDiv = document.createElement("div")
        if (isLast) {
            currDiv.classList.add("addNewPage")
            currDiv.innerHTML = "<i class='fa-solid fa-circle-plus'></i>"
            currDiv.firstChild.addEventListener("click", async () => {
                    let currPdfBlob = this.state.pdfBlob
                    const pdfBlobUrl = URL.createObjectURL(this.state.pdfBlob);
                    const pdfBuffer = await axios.get(pdfBlobUrl, { responseType: 'arraybuffer' }).then((response) => response.data);

                    const pdfDoc = await PDFDocument.load(pdfBuffer);
                    const lastPageIndex = pdfDoc.getPageCount() - 1;
                    console.log(lastPageIndex);
                    // const lastPage = pdfDoc.getPage(lastPageIndex);

                    const duplicatedPages = await pdfDoc.copyPages(pdfDoc,[lastPageIndex]);
                    const duplicatedPage = duplicatedPages[0]
                    

                    pdfDoc.addPage(duplicatedPage);

                    const pdfBytes = await pdfDoc.save();
                    const newPdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

                    this.setState({ pdfBlob: newPdfBlob })
                    this.renderPdf(container)
            })
            container.appendChild(currDiv)
            return
        }
        currDiv.classList.add("thumbnail")

        let thumbnailNumber = document.createElement("span")
        thumbnailNumber.textContent = pageNumber
        currDiv.appendChild(thumbnailNumber)
        currDiv.appendChild(thumbnail)
        currDiv.addEventListener("click", () => {
            this.setState({ currPage: pageNumber })
            this.updateCurrPage(document.getElementById("previewPage"))
        })
        container.appendChild(currDiv)
    }

    updateCurrPage = (container) => {
        container.innerHTML = ""
        if (this.state.pages[this.state.currPage - 1]) {
            let currCanvas = this.state.pages[this.state.currPage - 1]
            let currCtx = currCanvas.getContext('2d');
            let currImageData = currCtx.getImageData(0, 0, currCanvas.width, currCanvas.height);

            let newCanvas = currCanvas.cloneNode(true)
            let newCtx = newCanvas.getContext('2d');
            newCtx.putImageData(currImageData, 0, 0);
            container.appendChild(newCanvas)
            this.renderTextComps(container)
            this.renderImageComps(container)
            // this.addTextMoveListeners()
            this.addImageMoveListeners()
        }
    }

    zoomImageComp = (e) => {
        let zoomType = e.target.attributes.type.value
        let imageId = e.target.attributes.ImageId.value
        let imageEle = e.target.parentNode.parentNode.firstChild.firstChild
        if (zoomType == "2") zoomType = -1
        else zoomType = 1
        let tempCurrImageComps = this.state.imageComps
        let newHeight = tempCurrImageComps[imageId].height + 0.5 * zoomType
        let newwidth = tempCurrImageComps[imageId].width + 0.5 * zoomType
        tempCurrImageComps[imageId].height = newHeight
        tempCurrImageComps[imageId].width = newwidth
        imageEle.style.height = newHeight.toString() + "rem"
        imageEle.style.width = newwidth.toString() + "rem"
        this.setState({ imageComps: tempCurrImageComps })
    }

    removeImageComp = (e) => {
        let imageId = e.target.attributes.ImageId.value
        let tempCurrImageComps = this.state.imageComps
        delete tempCurrImageComps[imageId]
        console.log(tempCurrImageComps);
        this.setState({ imageComps: tempCurrImageComps })
        this.renderImageComps(document.getElementById("previewPage"))
    }

    renderImageComps = (container, currImageComps = null) => {
        if (!currImageComps) {
            currImageComps = Object.values(this.state.imageComps).filter(imageComp => {
                return imageComp.page == this.state.currPage
            })
            container.querySelectorAll(":scope > div").forEach(divEle => {
                // console.log(container,imageComp);
                container.removeChild(divEle)
            })
        }
        currImageComps.forEach((imageComp, i) => {
            let imageCompDivContainer = document.createElement("div")
            imageCompDivContainer.style.position = "absolute"
            imageCompDivContainer.style.height = "96%"
            imageCompDivContainer.style.width = "94%"
            imageCompDivContainer.style.top = "14px"
            imageCompDivContainer.style.left = "14px"

            container.appendChild(imageCompDivContainer)
            let imageCompDiv = <div id={imageComp.id} style={{ top: imageComp.top.toString() + "px", left: imageComp.left.toString() + "px" }} onMouseDown={this.handleMouseDown} className="imageCompDiv">
                <div className="imagediv">
                    <ImageComp imageComp={imageComp} />
                </div>
                <div class='imageCompzoom'>
                    <i imageId={imageComp.id} onClick={this.zoomImageComp} type="1" class='fa-solid fa-circle-plus zoomin'></i>
                    <i imageId={imageComp.id} onClick={this.zoomImageComp} type="2" class='fa-solid fa-circle-minus zoomout '></i>
                    <i imageId={imageComp.id} onClick={this.removeImageComp} class='fa-solid fa-trash-can'></i>
                </div>
            </div>
            ReactDOM.render(imageCompDiv, imageCompDivContainer)
        })
    }



    renderTextComps = (container, currTextComps = null) => {
        if (!currTextComps) {
            currTextComps = Object.values(this.state.TextComps).filter(textComp => {
                return textComp.page == this.state.currPage
            })
            document.querySelectorAll(".textComponentDiv").forEach(textComp => {
                container.removeChild(textComp)
            })
        }


        currTextComps.forEach(textComp => {
            let textDiv = document.createElement("div")
            textDiv.style.top = textComp.y
            textDiv.style.left = textComp.x
            textDiv.classList.add("textComponentDiv")

            textDiv.onmousedown = this.handleMouseDown

            let text = createElement(Text, { textComp: textComp })
            ReactDOM.render(text, textDiv);
            container.appendChild(textDiv)
        })
    }

    fontFamily = ["Arial", "Times new roman", "terminal", "Freestyle Script Regular"]

    renderFontFamily = () => {
        return this.fontFamily.map((fontF) => {
            return <option value={fontF}>{fontF}</option>
        })
    }



    addTextComp = () => {
        let tempTextComps = this.state.TextComps
        let newId = "text" + (Object.values(tempTextComps).length + 1)
        let sampleText = "Sample text"

        tempTextComps[newId] =
        {
            id: newId,
            page: this.state.currPage,
            fontFamily: 'Arial',
            fontSize: 50,
            textContent: sampleText,
            color: "#B4F8C8"
        }
        this.renderTextComps(document.getElementById("previewPage"), [tempTextComps[newId]])
        this.setState({ TextComps: tempTextComps })
    }

    removeTextComp = (id) => {
        let tempTextComps = this.state.TextComps
        delete tempTextComps[id]
        this.setState({ TextComps: tempTextComps })
        this.renderTextComps(document.getElementById("previewPage"))
    }

    updateTextProp = (e) => {
        let propName = e.target.name
        let selectedTextComp = null
        if (this.state.selectedText && this.state.TextComps[this.state.selectedText]) {
            selectedTextComp = this.state.TextComps[this.state.selectedText]
        }
        if (selectedTextComp) {
            let newVal = e.target.value

            if (propName == "fontSize") newVal = parseInt(newVal)
            selectedTextComp[propName] = newVal

            let tempTextComps = this.state.TextComps
            tempTextComps[this.state.selectedText] = selectedTextComp
            this.setState({ TextComps: tempTextComps })
            this.renderTextComps(document.getElementById("previewPage"))
        }
        // this.renderTextComps(document.getElementById("previewPage"))
        // console.log(this.state);

    }

    addImageMoveListeners = () => {

        let previewPage = document.querySelector("#previewPage")
        previewPage.onmouseup = this.handleMouseUp
        previewPage.onmousemove = this.handleMouseMove
    }
    // addTextMoveListeners = () => {

    //     let previewPage = document.querySelector("#previewPage")
    //     previewPage.onmouseup = this.handleMouseUp
    //     previewPage.onmousemove = this.handleMouseMove
    // }


    handleMouseDown = (e) => {
        // this.setState({ selectedText: e.target.id })
        // let textComp = e.target.parentElement.parentElement.parentElement
        let imageComp = e.target.parentElement.parentElement
        // console.log(imageComp);
        this.setState({ selectedImage: imageComp.id })
        // console.log(imageComp);

        this.isDown = true;
        this.offset = [
            imageComp.offsetLeft - e.clientX,
            imageComp.offsetTop - e.clientY
        ];
        this.currImageComp = imageComp
    }
    handleMouseMove = (e) => {
        if (this.isDown && this.currImageComp) {
            this.mousePosition = {

                x: e.clientX,
                y: e.clientY

            };
            // this.currTextComp.style.left = (this.mousePosition.x + this.offset[0]) + 'px';
            // this.currTextComp.style.top = (this.mousePosition.y + this.offset[1]) + 'px';
            this.currImageComp.style.left = (this.mousePosition.x + this.offset[0]) + 'px';
            this.currImageComp.style.top = (this.mousePosition.y + this.offset[1]) + 'px';
        }
    }
    handleMouseUp = (e) => {
        // if (this.currTextComp) {
        //     let tempTextComps = this.state.TextComps
        //     tempTextComps[this.state.selectedText]["x"] = this.currTextComp.style.left
        //     tempTextComps[this.state.selectedText]["y"] = this.currTextComp.style.top
        //     this.setState({ TextComps: tempTextComps })
        // }
        // else this.setState({ selectedText: null })

        // this.isDown = false;
        // this.currTextComp = null
        let currSelectedImage = this.state.selectedImage
        if (this.currImageComp && currSelectedImage) {
            let tempImageComps = this.state.imageComps
            tempImageComps[this.state.selectedImage]["left"] = parseInt(this.currImageComp.style.left.slice(0, -2))
            tempImageComps[this.state.selectedImage]["top"] = parseInt(this.currImageComp.style.top.slice(0, -2))
            this.setState({ imageComps: tempImageComps })
        }
        else this.setState({ selectedImage: null })
        this.isDown = false;
        this.currImageComp = null
    }


    addZoomListener = () => {
        const zoomableDiv = document.getElementById('previewPage');
        let zoomLevel = 1.0;

        function handleMouseMove(event) {
            const rect = zoomableDiv.getBoundingClientRect();
            const mouseX = event.clientX - rect.left;
            const mouseY = event.clientY - rect.top;

            const zoomOriginX = (mouseX / rect.width) * 100 + '%';
            const zoomOriginY = (mouseY / rect.height) * 100 + '%';

            zoomableDiv.style.transform = `scale(${zoomLevel})`;
            zoomableDiv.style.transformOrigin = `${zoomOriginX} ${zoomOriginY}`;
        }

        function handleZoom(event) {
            event.preventDefault();

            const zoomDelta = -1 * Math.sign(event.deltaY) * 0.1;
            zoomLevel += zoomDelta;

            if (zoomLevel < 1.0) {
                zoomLevel = 1.0;
            } else if (zoomLevel > 2.0) {
                zoomLevel = 2.0;
            }

            const fakeEvent = new MouseEvent('mousemove', event);
            handleMouseMove(fakeEvent);
        }

        zoomableDiv.addEventListener('mousemove', handleMouseMove);
        zoomableDiv.addEventListener('wheel', handleZoom);

    }


    componentDidMount = () => {
        this.renderPdf(document.getElementById("thumbnailList"))
    }
    componentDidUpdate = () => {
        // this.renderPdf(this.renderThumbnails, document.getElementById("thumbnailList"))
    }

    render() {
        let selectedTextComp = null
        if (this.state.selectedText && this.state.TextComps[this.state.selectedText]) {
            selectedTextComp = this.state.TextComps[this.state.selectedText]
        }
        return (
            <div className="pdfEditorDiv">
                <div id="thumbnailList">

                </div>
                <div className="editArea">

                    <div className="pageArea">
                        <div id="previewPage" className="page">

                        </div>
                    </div>
                    <div id="EditorTools" className="EditorTools">
                        {/* <button onClick={this.addTextComp} className="btn btn-warning">Add Text</button> */}
                        <hr />
                        {(selectedTextComp) ? (<>

                            <label>Color : </label>
                            <input name="color" value={selectedTextComp.color} onChange={this.updateTextProp} type='color'></input>
                            <hr />
                            <label>Size : </label>
                            <input name="fontSize" value={selectedTextComp.fontSize} onChange={this.updateTextProp} type='number'></input>
                            <hr />
                            <br />
                            <label>Text : </label>

                            <input name="textContent" className="textInput" onChange={this.updateTextProp} style={{ fontFamily: selectedTextComp.fontFamily }} value={selectedTextComp.textContent} type='text'></input>
                            <hr />
                            <br />
                            <label>fontFamily : </label>
                            <select
                                id="fontFamily"
                                value={selectedTextComp.fontFamily}
                                name="fontFamily"
                                onChange={this.updateTextProp}
                                required
                            >
                                {this.renderFontFamily()}
                            </select>
                            <hr />
                            <br />
                        </>) : (<></>)}
                        <div className="genAIDiv">
                            {/* <input className='form-control' type='number' onChange={this.changeNumber}></input> */}
                            <input className='form-control' type='text' onChange={this.changeText} placeholder='Enter Query'></input>
                            <button onClick={this.genImage} className='mx-auto btn btn-success'>Submit</button>
                            <div className='genImageContainer'>
                                {(this.state.imageLoading) ? (<>
                                    <div class="loader"></div>
                                </>) : (<>

                                </>)}
                                {

                                    (this.state.image_urls.map(imgUrl => {
                                        return (
                                            <>
                                                {/* onLoadStart={() => { this.setState({ imageLoading: true }) }}  */}
                                                <div onClick={this.selectGenImage} className='genImage'>
                                                    {/* onLoad={() => { this.setState({ imageLoading: false }) }} */}
                                                    <img onLoad={() => { this.setState({ imageLoading: false }) }} src={imgUrl}></img>
                                                    <i onClick={this.addImageComp} imgUrl={imgUrl} className="addImageIcon" class='fa-solid fa-circle-plus'></i>
                                                </div>
                                            </>
                                        )
                                    }))
                                }

                            </div>
                            <div className="oldImageDiv">
                                {
                                    (this.state.image_History.map(imgUrl => {
                                        return (
                                            <>
                                                <div onClick={this.selectGenImage} className='oldImage'>
                                                    <img src={imgUrl}></img>
                                                    <i onClick={this.addImageComp} imgUrl={imgUrl} className="addImageIcon" class='fa-solid fa-circle-plus'></i>
                                                </div>
                                            </>
                                        )
                                    }))
                                }
                            </div>
                            <button onClick={this.saveImageComps} className='btn btn-success'>Save</button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}

export default PdfEditor