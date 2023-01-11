import { useEffect, useState } from "react";
import "./App.css";

export const App = () => {
  const [ourText, setOurText] = useState("");
  const msg = new SpeechSynthesisUtterance();

  const speechHandler = (msg) => {
    msg.text = ourText;
    window.speechSynthesis.speak(msg);
  };

  const handleUserKeyPress = (event) => {
    const { keyCode } = event;

    if (keyCode === 13) {
      speechHandler(msg);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  });

  return (
    <div className="App">
      <h1>Maya and Aharon Text to Speech</h1>
      <textarea
        rows={10}
        type="text"
        value={ourText}
        placeholder="Enter Text"
        onChange={(e) => setOurText(e.target.value)}
      ></textarea>
      <button onClick={() => speechHandler(msg)}>SPEAK</button>
    </div>
  );
};
