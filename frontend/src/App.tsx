import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminMatchUpdate from "./pages/AdminMatchUpdate";
import MatchList from "./pages/MatchList";
import MatchLive from "./pages/MatchLive";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchList />} />
        <Route path="/match/:id" element={<MatchLive />} />
        <Route path="/admin" element={<AdminMatchUpdate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
