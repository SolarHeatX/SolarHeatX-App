// In Ihrer Appliance.tsx
import React from "react";
import SvgIcon from "./SvgIcon";

interface ApplianceProps {
  svgName: string;
  title: string;
  status: string;
  additionalText?: string;
  imgWidth?: number;
  imgHeight?: number;
  pin: number;
  pinValue: boolean;
  setPinValue: (value: boolean) => void;
  sendMessage: (message: string) => void;
}

const Appliance: React.FC<ApplianceProps> = ({
  svgName,
  title,
  status,
  additionalText,
  imgWidth = 35,
  imgHeight = 35,
  pin,
  pinValue,
  setPinValue,
  sendMessage,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setPinValue(newValue);
    sendMessage(
      JSON.stringify({
        action: "msg",
        type: "cmd",
        body: {
          type: "digitalWrite",
          pin: pin,
          value: newValue ? 1 : 0,
        },
      })
    );
  };

  return (
    <div className="appliance" id={`${title}Container`}>
      <input
        type="checkbox"
        name="pumpen"
        id={`${title}`}
        style={{ display: "none" }} // hides the controlled checkbox
        checked={pinValue}
        onChange={handleChange}
      />
      <label htmlFor={`${title}`}>
        <input
          type="checkbox"
          style={{ display: "none" }} // hides the dummy checkbox
        />
        <SvgIcon
          name={svgName}
          width={imgWidth}
          height={imgHeight}
          fill="#3976f6"
        />
        <strong className="mb-2 mt-2 block">{title}</strong>
        <p>{status}</p>
        <small>{additionalText}</small>
      </label>
    </div>
  );
};

export default Appliance;
