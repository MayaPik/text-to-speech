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
  let [buttonText, setButtonText] = useState("📤");
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  const [voices, speak] = useSpeechSynthesis();
  const [currentVoice, setCurrentVoice] = useState(voices[0]);
  const [text, setText] = useState(urlParams.get("text"));


  useEffect(() => {
    if (!currentVoice) {
      let index = (voices.map(e => e.name).indexOf('Carmit'))
      setCurrentVoice(voices.filter((v) => v.default)[index] || voices[index]);
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
    const encodedText = encodeURIComponent(text);
    const url = `?text=${encodedText}`;
    window.history.replaceState(text, "", url)
  };

  const handleCopyClick = async () => {
    const encodedText = encodeURIComponent(text);
    const url = `?text=${encodedText}`;
    window.history.replaceState(text, "", url)
    try {
      await navigator.clipboard.writeText(window.location.href);
      setButtonText("Copied!");
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setButtonText("Copy URL");
    }
  }

  return (
    <form className="contain" onSubmit={handleSpeak}>
      <div className="select">
        <select value={currentVoice ? currentVoice.name : ""} onChange={handleVoiceChange} >
          {voices.map((v) => (
            <option key={v.name} value={v.name }>{`${v.name + " (" +  v.lang +")"}`}</option>
          ))}
        </select>
      </div>
      <input type="text" value={text} onChange={handleTextChange} aria-label="text" />
      <button onClick={handleCopyClick}>{buttonText}</button>
      <button type="submit">🗣</button>
    </form>
  );
};