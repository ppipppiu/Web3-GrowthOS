import { Routes, Route } from "react-router-dom";


import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Workspace from "./pages/Workspace";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";


import Segmentation from "./pages/Segmentation";

import Activation from "./pages/segmentation/Activation";
import ValueAnalysis from "./pages/segmentation/ValueAnalysis";
import Retention from "./pages/segmentation/Retention";
import SybilDetection from "./pages/segmentation/SybilDetection";


import Navbar from "./components/Navbar";
import BackButton from "./components/BackButton";
import WalletAvatar from "./components/WalletAvatar";

import ValueDefinition from "./pages/ValueDefinition";


function App() {

  return (

    <div className="app-shell">

      <Navbar />

      <BackButton />

      <WalletAvatar />


      <main className="page-frame">

        <Routes>


          <Route
            path="/"
            element={<Landing />}
          />


          <Route
            path="/workspace"
            element={<Workspace />}
          />


          <Route
            path="/upload"
            element={<Upload />}
          />


          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route

          path="/value-definition"

          element={<ValueDefinition />}

          />


          <Route
            path="/segmentation"
            element={<Segmentation />}
          />


          <Route
            path="/segmentation/activation"
            element={<Activation />}
          />


          <Route
            path="/segmentation/value"
            element={<ValueAnalysis />}
          />


          <Route
            path="/segmentation/retention"
            element={<Retention />}
          />


          <Route
            path="/segmentation/sybil"
            element={<SybilDetection />}
          />


          <Route
            path="/reports"
            element={<Reports />}
          />


          <Route
            path="/profile"
            element={<Profile />}
          />


        </Routes>


      </main>


    </div>

  );

}


export default App;