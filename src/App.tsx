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
  const [jipData, setJipData] = useState((getLSDateData('jip') || []) as any[]);
  const [openJipData, setOpenJipData] = useState(false);

  const updateJipData = (action: 'add' | 'delete', payload?: string) => {
    let jipData: any[] = getLSDateData('jip') || [];
    let newJipData: any[];

    if (action === 'add') newJipData = [...jipData, new Date().toISOString()];
    else newJipData = jipData.filter((el) => el !== payload);

    // keep only last 50 entries
    newJipData = newJipData.slice(0, 50);

    setJipData(newJipData);
    setLSDateData('jip', newJipData);
  };

  const onLongPress = () => {
    setOpenJipData(!openJipData);
  };

  const onClick = () => {
    updateJipData('add');
  };

  const longPressEvent: any = useLongPress(onLongPress, onClick, {
    shouldPreventDefault: true,
    delay: 500,
  });

  const today = new Date();
  const [year, month, day] = [
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ];

  const todayEntries = jipData.filter((el) => {
    const date = new Date(el);
    const [entryYear, entryMonth, entryDay] = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    ];

    return entryYear === year && entryMonth === month && entryDay === day;
  });

  return (
    <div className="app-container">
      <p className="app-date">{today.toDateString()}</p>
      <button {...longPressEvent} className="app-button">
        JUMP IN PLACE
        <p>Counter: {todayEntries.length}</p>
      </button>

      <dialog open={openJipData}>
        <h3>JIP Data</h3>
        {todayEntries.map((el, idx) => (
          <p key={idx}>
            {new Date(el).toLocaleTimeString()}{' '}
            <button
              onClick={() => {
                if (!window.confirm(`Delete ${el}?`)) return;
                updateJipData('delete', el);
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
