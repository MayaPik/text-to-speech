import { useMemo, useCallback, useEffect, useState } from "react";
import "./App.css";

export const App = () => {
  const msg = useMemo(() => new SpeechSynthesisUtterance(), []);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const text = urlParams.get("text");
  const [ourText, setOurText] = useState(text);

  const speechHandler = useCallback(
    (msg) => {
      msg.text = ourText;
      window.speechSynthesis.speak(msg);
    },
    [ourText]
  );

  const handleUserKeyPress = useCallback(
    (event) => {
      const { keyCode } = event;

      if (keyCode === 13) {
        speechHandler(msg);
      }
    },
    [speechHandler, msg]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [msg, ourText, handleUserKeyPress, speechHandler]);

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
