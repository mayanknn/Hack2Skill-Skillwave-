import React from "react";
import ReactDOM from "react-dom/client";

import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme.js";
import AppCodeEditor from "./AppCodeEditor.jsx";


  function MainCodeEditor(){
    return(
        <ChakraProvider theme={theme}>
        <AppCodeEditor/>
    </ChakraProvider>
    )
  }
    
  export default MainCodeEditor;
  
