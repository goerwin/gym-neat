import { useEffect, useRef, useState } from 'react';
import './App.css';

const LOCALSTORAGE_KEY = 'goerwin_gymNeat';

function getLSDateData(date: string) {
  try {
    const data: any = JSON.parse(
      window.localStorage.getItem(LOCALSTORAGE_KEY)!
    );

    return data[date] as any;
  } catch (e) {}

  return null;
}

function setLSDateData(name: string, value: any) {
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
  const todayData = getLSDateData(todayISO) || {};
  const [jipData, setJipData] = useState((todayData.jip || []) as any[]);
  const [openJipData, setOpenJipData] = useState(false);

  useEffect(() => {
    const todayData = getLSDateData(todayISO) || {};
    setLSDateData(todayISO, { ...todayData, jip: jipData });
  }, [jipData]);

  return (
    <div className="app-container">
      <p className="app-date">{today.toDateString()}</p>
      <button
        className="app-button"
        onClick={() => setJipData([...jipData, new Date().toISOString()])}
      >
        JUMP IN PLACE
        <p>Counter: {jipData.length}</p>
      </button>

      <button
        className="app-greenbutton"
        onClick={() => setOpenJipData(!openJipData)}
      >
        VIEW JUMP IN PLACE DATA
      </button>

      <dialog open={openJipData}>
        <h3>JIP Data</h3>
        {jipData.map((el, idx) => (
          <p key={idx}>{new Date(el).toLocaleTimeString()}</p>
        ))}
        <button onClick={() => setOpenJipData(false)}>Close</button>
      </dialog>

      <button
        className="app-redbutton"
        onClick={() => {
          const ok = window.confirm('Reset Jump In Place?');
          if (ok) setJipData([]);
        }}
      >
        RESET JUMP IN PLACE
      </button>
    </div>
  );
}
