import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import ImageEditor from './AppChildren/ImageEditor';
import FileUpload from './AppChildren/FileUpload';
import Navigation from './AppChildren/Navigation';
import PdfEditor from './AppChildren/PdfEditor';
import AppContainer from './AppChildren/AppContainer';

function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Navigation />
          <AppContainer/>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App;
