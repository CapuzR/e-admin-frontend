import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import AppBar from "./components/AppBar.jsx";
import Login from "./pages/Login.jsx";

import Collections from "./pages/Collections.jsx";
import CollectionForm from "./pages/CollectionForm.jsx";
import Cards from "./pages/Cards.jsx";

import Tournaments from "./pages/Tournaments.jsx";
import TournamentForm from "./pages/TournamentForm.jsx";


export const AppRouter = ({ isMobile }) => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login isMobile={isMobile} />} />
        
        {/* Asset Manager */}
        <Route path="/collections" element={<><AppBar location="Collections" /><Collections isMobile={isMobile} /></>} />
        <Route path="/collection/new" element={<><AppBar location="New Collection" /><CollectionForm isMobile={isMobile} /></>} />
        <Route path="/collection/:id/update" element={<><AppBar location="Update Card Collection" /><CollectionForm isMobile={isMobile} /></>} />
        <Route path="/collection/:id/cards" element={<><AppBar location="Cards" /><Cards isMobile={isMobile} /></>} />

        {/* Tournament Manager */}
        <Route path="/tournaments" element={<><AppBar location="Tournaments" /><Tournaments isMobile={isMobile} /></>} />
        <Route path="/tournament/new" element={<><AppBar location="New Tournament" /><TournamentForm isMobile={isMobile} /></>} />
        <Route path="/tournament/:id/update" element={<><AppBar location="Update Tournament" /><TournamentForm isMobile={isMobile} /></>} />
      </Routes>
    </Router>
  );
};