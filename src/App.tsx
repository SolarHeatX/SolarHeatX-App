import { useEffect, useState } from "react";
import "./App.css";
import useWebSocket from "react-use-websocket";
import Appliance from "./components/Appliance";
import TempBlock from "./components/TempBlock";

type MessageBody = {
  action: string;
  type: string;
  body?: {
    pin?: number;
    value?: number;
    state?: number;
  };
  sensor1?: number;
  sensor2?: number;
  sensor3?: number;
};

const outputPins = [16, 17, 18, 19, 22, 23, 2];
const defultOutputPin = outputPins[0];

const appliancePins = {
  Automatik: 16,
  Ladepumpe: 17,
  Speicherladepumpe: 18,
};

function App() {
  const { lastMessage, sendMessage, readyState } = useWebSocket(
    "wss://mh66853ffg.execute-api.eu-central-1.amazonaws.com/dev"
  );

  const [selectedPin, setSelectedPin] = useState(defultOutputPin);
  const [pinValue, setPinValue] = useState(false);
  const [pinValues, setPinValues] = useState<{ [key: number]: boolean }>({});
  const [date, setDate] = useState("");
  const [weekday, setWeekday] = useState("");

  const [sensor1Temp, setSensor1Temp] = useState(0);
  const [sensor2Temp, setSensor2Temp] = useState(0);
  const [sensor3Temp, setSensor3Temp] = useState(0);

  useEffect(() => {
    const today = new Date();
    setDate(
      today.toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
    setWeekday(today.toLocaleDateString("de-DE", { weekday: "long" }));
  }, []);

  useEffect(() => {
    if (lastMessage === null) {
      return;
    }

    const parsedMessage = JSON.parse(lastMessage.data) as MessageBody;

    if (parsedMessage.action !== "msg") {
      return;
    }

    if (parsedMessage.type === "output") {
      const pin = parsedMessage.body?.pin;
      const value = parsedMessage.body?.value;
      if (typeof pin === "number" && typeof value === "number") {
        setPinValues((prevValues) => ({
          ...prevValues,
          [pin]: value === 0 ? false : true,
        }));
      }
    }

    if (parsedMessage.type === "pinState") {
      const pin = parsedMessage.body?.pin;
      const state = parsedMessage.body?.state;
      if (typeof pin === "number" && typeof state === "number") {
        setPinValues((prevValues) => ({
          ...prevValues,
          [pin]: state === 0 ? false : true,
        }));
        console.log(pin, state);
      }
    }

    // Handle temperature updates
    if (parsedMessage.type === "temperature") {
      // Use || 0 to provide a default value of 0 if sensor data is undefined
      setSensor1Temp(parsedMessage.sensor1 || -127);
      setSensor2Temp(parsedMessage.sensor2 || -127);
      setSensor3Temp(parsedMessage.sensor3 || -127);
    }
  }, [lastMessage]);

  useEffect(() => {
    sendMessage(
      JSON.stringify({
        action: "msg",
        type: "cmd",
        body: {
          type: "digitalRead",
          pin: defultOutputPin,
        },
      })
    );

    outputPins.forEach((pin) => {
      sendMessage(
        JSON.stringify({
          action: "msg",
          type: "cmd",
          body: {
            type: "pinMode",
            pin,
            mode: "output",
          },
        })
      );
    });
  }, []);

  useEffect(() => {
    Object.values(appliancePins).forEach((pin) => {
      sendMessage(
        JSON.stringify({
          action: "msg",
          type: "cmd",
          body: {
            type: "pinMode",
            pin,
            mode: "output",
          },
        })
      );

      // Initialize pinValue state
      setPinValues((prevState) => ({
        ...prevState,
        [pin]: false,
      }));
    });
  }, []);

  return (
    <div className="App text-black flex flex-col w-full h-full">
      <header className=" bg-white overflow-hidden rounded-t-lg rounded-b-3xl py-5 sm:py-10 px-5 sm:px-10 pb-5 shadow-md mb-10">
        <div className="flex flex-end">
          <div className="text-left">
            <h5 className="my-2.5 text-base">{date}</h5>
            <h2 className="m-0 text-3xl">{weekday}</h2>
          </div>
        </div>

        <div className="flex flex-col xxs:flex-row items-center justify-evenly mt-10 w-full relative overflow-hidden">
          <TempBlock
            temperature={sensor1Temp.toString()}
            name="Warmwasser"
            id="boiler-temp"
          />
          <TempBlock
            temperature={sensor2Temp.toString()}
            name="Solar"
            id="solar-temp"
          />
          <TempBlock
            temperature={sensor3Temp.toString()}
            name="Pufferspeicher"
            id="puffer-temp"
          />
        </div>
      </header>

      <div className="overflow-hidden mt-2 mb-4">
        <ul className="flex ">
          <li className="ml-4">
            <a
              href=""
              className="text-sm font-semibold text-gray-600 whitespace-nowrap"
            >
              Pumpen - Modus
            </a>
          </li>
        </ul>
      </div>

      <div className="flex flex-wrap ">
        <Appliance
          svgName="autoModeSVG"
          title="Automatik"
          status="opened"
          imgWidth={35}
          imgHeight={35}
          pin={appliancePins["Automatik"]}
          pinValue={pinValues[appliancePins["Automatik"]]}
          setPinValue={(value: boolean) =>
            setPinValues({
              ...pinValues,
              [appliancePins["Automatik"]]: value,
            })
          }
          sendMessage={sendMessage}
        />
        <Appliance
          svgName="pumpeSVG"
          title="Ladepumpe"
          status="opened"
          imgWidth={50}
          imgHeight={50}
          pin={appliancePins["Automatik"]}
          pinValue={pinValues[appliancePins["Automatik"]]}
          setPinValue={(value: boolean) =>
            setPinValues({
              ...pinValues,
              [appliancePins["Automatik"]]: value,
            })
          }
          sendMessage={sendMessage}
        />
        <Appliance
          svgName="pumpeSVG"
          title="Speicherladepumpe"
          status="opened"
          imgWidth={50}
          imgHeight={50}
          pin={appliancePins["Automatik"]}
          pinValue={pinValues[appliancePins["Automatik"]]}
          setPinValue={(value: boolean) =>
            setPinValues({
              ...pinValues,
              [appliancePins["Automatik"]]: value,
            })
          }
          sendMessage={sendMessage}
        />
      </div>

      <div>
        <select
          value={selectedPin}
          onChange={(e) => {
            const newPin = parseInt(e.target.value, 10);
            setSelectedPin(newPin);
            sendMessage(
              JSON.stringify({
                action: "msg",
                type: "cmd",
                body: {
                  type: "digitalRead",
                  pin: newPin,
                },
              })
            );
          }}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          {outputPins.map((pin, key) => (
            <option key={key} value={pin}>
              GPIO{pin}
            </option>
          ))}
        </select>
      </div>
      <div className="m-4">
        <label className="inline-flex relative items-center cursor-pointer">
          <input
            type="checkbox"
            checked={pinValue}
            onChange={() => {
              const newValue = !pinValue;

              setPinValue(newValue);
              sendMessage(
                JSON.stringify({
                  action: "msg",
                  type: "cmd",
                  body: {
                    type: "digitalWrite",
                    pin: selectedPin,
                    value: newValue ? 1 : 0,
                  },
                })
              );
            }}
            className="sr-only peer"
          />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {pinValue ? "On" : "Off"}
          </span>
        </label>
      </div>
    </div>
  );
}

export default App;
