import { Tooltip } from "antd";
import React, { useState, useEffect, useRef } from "react";
import shallow from "zustand/shallow";
import { useThesisStore } from "~/states/thesisState";
import * as markerjs2 from "markerjs2";
import { CloseCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { FloatButton } from "antd";

let markerArea = "";

const FormAnnotate = React.memo(({ submitForm }) => {
   


    return (
        <div className="annotate-wrapper">
          
        </div>
    );
});

export default React.memo(FormAnnotate);
