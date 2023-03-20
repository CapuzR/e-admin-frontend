import React from "react";
import { createRoot } from 'react-dom/client';
import BRAdminApp from "./App";

const root = createRoot(document.getElementById("app"));
root.render(<BRAdminApp/>);