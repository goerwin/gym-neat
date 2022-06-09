import { useEffect, useState } from 'react';
import './App.css';
import useLongPress from './hooks/useLongPress';

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

  const onLongPress = () => {
    console.log('longpress is triggered');
    setOpenJipData(!openJipData);
  };

  const onClick = () => {
    console.log('click is triggered');
    setJipData([...jipData, new Date().toISOString()]);
  };

  const longPressEvent: any = useLongPress(onLongPress, onClick, {
    shouldPreventDefault: true,
    delay: 500,
  });

  useEffect(() => {
    const todayData = getLSDateData(todayISO) || {};
    setLSDateData(todayISO, { ...todayData, jip: jipData });
  }, [jipData]);

  return (
    <div className="app-container">
      <p className="app-date">{today.toDateString()}</p>
      <button {...longPressEvent} className="app-button">
        JUMP IN PLACE
        <p>Counter: {jipData.length}</p>
      </button>

      <dialog open={openJipData}>
        <h3>JIP Data</h3>
        {jipData.map((el, idx) => (
          <p key={idx}>
            {new Date(el).toLocaleTimeString()}{' '}
            <button
              onClick={() => {
                if (!window.confirm(`Delete ${el}?`)) return;
                setJipData(jipData.filter((_, idx2) => idx2 !== idx));
              }}
            >
              ❌
            </button>
          </p>
        ))}
        <button onClick={() => setOpenJipData(false)}>Close</button>
      </dialog>
    </div>
  );
}
