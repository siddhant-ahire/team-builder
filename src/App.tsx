import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import Select from 'react-select';

export type PlayerOption = {
  label: string, 
  value: string | number,
}

export type CaptainOption = {
  id: number,
  name: PlayerOption,
  team: PlayerOption[] 
}

function App() {
  const [ allInputPlayerName, setAllInputPlayerName] = useState('');
  const [ allPlayers, setAllPlayers ] = useState<PlayerOption[]>([]);
  const [ captains, setCapatains ] = useState<CaptainOption[]>([]);
  const [ totalCaptains, setTotalCaptains ] = useState<number>(0);
  
  const onAllPlayerInputChange = (event: any) => {
    setAllInputPlayerName(event.target.value)
  }

  const addPlayerToAll = () => {
    let nameExist = allPlayers.find(o => o.value === allInputPlayerName);
    if(!nameExist) {
      setAllPlayers((prev => {
        return [...prev, {label: allInputPlayerName, value: allInputPlayerName}]
      }));
      setAllInputPlayerName('');
    }
  }

  const onTotalCaptainInputChange = (event: any) => {
    if(event.target.value <= allPlayers.length && event.target.value >= 0) {
      setTotalCaptains(event.target.value)
      setCapatains(() => {
        let captains = [];
        for(let i=0; i < event.target.value; i++) {
          captains.push({id: i+1, name: {value: '', label: ''}, team: []});
        }
        return captains
      })
    }
  }

  const availablePlayers = () => {
    return allPlayers.filter((v) => {
      let isExistInCaptain = captains.filter(c => c.name.value == v.value);
      let isExistInCaptainTeam = captains.filter(ct => {
        let inTeam = ct.team.filter(t => t.value == v.value)
        if(inTeam.length > 0) {
          return true
        } else {
          return false
        }
      });
      if(isExistInCaptain.length > 0 || isExistInCaptainTeam.length > 0) {
        return false
      } else {
        return true
      }
    }) || []
  }

  return (
    <div className="App">
      <div className="bg-white py-24 sm:py-32">
      <div className="flex justify-center">
        <div className="max-w-2xl">
        <div className="">
          <input type="text" value={allInputPlayerName} onChange={onAllPlayerInputChange} className="shadow appearance-none border rounded mb-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter player name" />
          <button type="button" onClick={addPlayerToAll} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-5">
            Add Player
          </button>
          <ul>
            {allPlayers.map((captain) => (
              <li key={captain.value}>
                {captain.label}
              </li>
            ))}
          </ul>
        </div>
        {allPlayers.length > 0 && 
          <div className="">
            <input type="number" value={totalCaptains} onChange={onTotalCaptainInputChange} className="shadow appearance-none border rounded mb-10 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter player name" />
          </div>
        }
        {totalCaptains > 0 &&
        <ul role="list" className={`grid grid-cols-${totalCaptains}`}>
          {captains.map((captain, index) => (
            <li key={captain.id}>
              <div className="">
                <img className="h-50 w-50 rounded-full" src={''} alt="" />
                <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select Captain"
                    name="color"
                    options={availablePlayers()}
                    value={captain.name}
                    onChange={(v) => {
                      setCapatains((prev) => {
                        let newArr = [...prev];
                        newArr[index].name = {value: v?.value || '', label: v?.label || ''};
                        return newArr
                      })
                    }}
                  />
                <div>
                  {captain.team.map((player) => 
                    <ul key={player.value}>
                      {player.label}
                    </ul>
                  )}
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select Player"
                    name="color"
                    options={availablePlayers()}
                    onChange={(v) => {
                      setCapatains((prev) => {
                        let newArr = [...prev];
                        newArr[index].team.push({value: v?.value || '', label: v?.label || ''});
                        return newArr
                      })
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
        }
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
