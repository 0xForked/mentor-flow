import reactLogo from "@/assets/react.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage } from "@/pages/home";
import { MentorPage } from "@/pages/mentor";
import { MenteePage } from "@/pages/mentee";

function App() {
  return (
    <>
      <div className="flex justify-center mt-12 mb-6">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<HomePage />} />
            <Route path="/mentor" element={<MentorPage />} />
            <Route path="/mentee" element={<MenteePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
