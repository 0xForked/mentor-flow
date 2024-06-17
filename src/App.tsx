import reactLogo from "./assets/react.svg";
import "./App.css";
import { JWTForm } from "./components/jwt-form";
import { useState } from "react";
import { MentorProfileCard } from "./components/mentor-profile-card";

function App() {
  const [jwt, setJWT] = useState("");

  const onJWTUpdated = (jwt: string) => setJWT(jwt);

  return (
    <>
      <div className="flex justify-center mt-12 mb-6">
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <div className="flex w-1/2 justify-center mx-auto mb-32">
        {!jwt && <JWTForm callback={onJWTUpdated} />}
        {jwt && <MentorProfileCard jwt={jwt} />}
      </div>
    </>
  );
}

export default App;
