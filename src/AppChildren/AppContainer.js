import { useState, useEffect } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import ImageEditor from './ImageEditor';
import FileUpload from './FileUpload';
import Navigation from './Navigation';
import PdfEditor from './PdfEditor';
import Home from './Home/Home';
import jsPDF from "jspdf";



function AppContainer() {      
    let [file, setFile] = useState(null)
    let [currPage, setCurrPage] = useState("/")
    // let [currPage, setCurrPage] = useState("/PdfEditor")
    // console.log(currPage);
    switch (currPage) {
        case "/":
            return (
                // <>
                //  <PdfEditor currPage={currPage} setCurrPage={setCurrPage} file={file} setFile={setFile} ></PdfEditor>
                // </>
                <>
                 <Home currPage={currPage} setCurrPage={setCurrPage}  file={file} setFile={setFile}/>
                </>
            )
        case "/PdfEditor":
            return (
                <>
                 <PdfEditor currPage={currPage} setCurrPage={setCurrPage} file={file} setFile={setFile} ></PdfEditor>
                </>
            )
        case "/uploadFile":
            return (
                <>
                <FileUpload  currPage={currPage} setCurrPage={setCurrPage} file={file} setFile={setFile} />
                </>
            )
        default:
            return (
                <>
                 <Home currPage={currPage} setCurrPage={setCurrPage}/>
                </>
            )
    }
}

export default AppContainer;
