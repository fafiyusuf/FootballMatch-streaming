import { BrowserRouter, Route, Routes } from "react-router-dom";
import MatchList from "./pages/MatchList";
import MatchLive from "./pages/MatchLive";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MatchList />} />
        <Route path="/match/:id" element={<MatchLive />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
