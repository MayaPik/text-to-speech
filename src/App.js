import { useEffect, useRef, useState } from "react";
import "./App.css";

const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const synth = useRef();

  const updateVoices = () => {
    setVoices(synth.current.getVoices());
  };

  const speak = (text, voice, pitch = 1, rate = 1) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    synth.current.speak(utterance);
  };

  useEffect(() => {
    if (typeof window !== "object" || !window.speechSynthesis) return;
    synth.current = window.speechSynthesis;
    synth.current.onvoiceschanged = updateVoices;
    updateVoices();

    return () => {
      synth.current.onvoiceschanged = null;
    };
  }, []);

  return [voices, speak];
};

export const App = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  const [voices, speak] = useSpeechSynthesis();
  const [currentVoice, setCurrentVoice] = useState();
  const [text, setText] = useState(urlParams.get("text"));

  useEffect(() => {
    if (!currentVoice) {
      setCurrentVoice(voices.filter((v) => v.default)[0] || voices[0]);
    }
  }, [currentVoice, voices]);

  const handleVoiceChange = (e) => {
    setCurrentVoice(voices.filter((v) => v.name === e.target.value)[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSpeak = (e) => {
    e.preventDefault();
    speak(text, currentVoice);
  };

  return (
    <form className="contain" onSubmit={handleSpeak}>
      <div className="select">
        <select value={currentVoice ? currentVoice.name : ""} onChange={handleVoiceChange}>
          {voices.map((v) => (
            <option key={v.name} value={v.name}>{`${v.name}`}</option>
          ))}
        </select>
      </div>

      <input type="text" value={text} onChange={handleTextChange} />

      <button type="submit">🗣</button>
    </form>
  );
};
