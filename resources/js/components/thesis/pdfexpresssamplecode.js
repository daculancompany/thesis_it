import WebViewer from "@pdftron/pdfjs-express";
//import WebViewer from '@pdftron/pdfjs-express-viewer'
import Utils from '@pdftron/pdfjs-express-utils'
import { useEffect, useRef } from "react";
const util = new Utils({})

function ThesisDetails() {
    const viewer = useRef(null);

    useEffect(() => {
        WebViewer(
            {
                licenseKey: 'El6b55X9P4eGFnrePDEE',
                path: "/pdfjsexpress",
                initialDoc: 'http://127.0.0.1:8000/sample11.pdf',
            },
            viewer.current
        ).then((instance) => {});
    }, []);

    return (
        <div >
            <div className="webviewer" style={{ height: '100vh' }} ref={viewer}></div>
        </div>
    );
}

export default ThesisDetails;
