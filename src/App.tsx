import { useEffect, useRef, useState } from 'react';
import './App.css';

const LOCALSTORAGE_KEY = 'goerwin_gymNeat';

function getLSItem(name: string) {
  try {
    const data: any = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)!);

    return data[name] as string;
  } catch (e) {}

  return null;
}

function setLSItem(name: string, value: string) {
  try {
    let data: any = JSON.parse(window.localStorage.getItem(LOCALSTORAGE_KEY)!);
    if (!data) data = {};

    data[name] = value;
    window.localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    return false;
  }

  return true;
}

export default function App() {
  const today = new Date();
  const todayISO = today.toISOString().replace(/T.*/, '');
  const jipTodayKey = `${todayISO}_jumpInPlace`;
  const jipTodayData = Number(getLSItem(jipTodayKey));
  const [jipCount, setJipCount] = useState(jipTodayData);

  useEffect(() => {
    setLSItem(jipTodayKey, String(jipCount));
  }, [jipCount]);

  return (
    <div className="app-container">
      <p className="app-date">{today.toDateString()}</p>
      <button className="app-button" onClick={() => setJipCount(jipCount + 1)}>
        JUMP IN PLACE
        <p>Counter: {jipCount}</p>
      </button>
    </div>
  );
}
