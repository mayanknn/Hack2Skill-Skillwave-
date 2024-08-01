import { useRef, useState } from "react";
import { Box, Button, VStack, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { useLocation } from 'react-router-dom';

const CodeEditor = () => {
  const editorRef = useRef();
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [showPDF, setShowPDF] = useState(true);
  const location = useLocation();
  const { pdfURL } = location.state;

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const togglePDF = () => {
    setShowPDF(!showPDF);
  };

  return (
    <div style={{backgroundColor:'#0f0a19' ,color:'gray'}}>
      <Box p={4}>
        <HStack spacing={4} align="flex-start">
          <Box w="50%" h="106vh" border="1px solid gray" p={2}>
            <Button onClick={togglePDF} mb={4} w="100%">
              {showPDF ? "Hide PDF" : "Show PDF"}
            </Button>
            {showPDF && (
              <iframe
                src={pdfURL}
                width="100%"
                height="100%"
                title="PDF Viewer"
                style={{ border: "none" }}
              />
            )}
          </Box>
          <Box w="70%">
            <VStack spacing={4} align="stretch" h="75vh">
              <Box>
                <LanguageSelector language={language} onSelect={onSelect}/>
                <Editor
                  options={{
                    minimap: {
                      enabled: false,
                    },
                  }}
                  height="40vh"
                  theme="vs-dark"
                  language={language}
                  defaultValue={CODE_SNIPPETS[language]}
                  onMount={onMount}
                  value={value}
                  onChange={(value) => setValue(value)}
                />
              </Box>
              <Box h="35vh">
                <Output editorRef={editorRef} language={language} />
              </Box>
            </VStack>
          </Box>
        </HStack>
      </Box>
    </div>
  );
};

export default CodeEditor;