import React from "react";
import SvgIcon from "./SvgIcon";

interface ApplianceProps {
  svgName: string;
  title: string;
  status: string;
  additionalText?: string;
  imgWidth?: number;
  imgHeight?: number;
}

const Appliance: React.FC<ApplianceProps> = ({
  svgName,
  title,
  status,
  additionalText,
  imgWidth = 35,
  imgHeight = 35,
}) => {
  return (
    <div className="appliance" id={`${title}Container`}>
      <input type="checkbox" name="pumpen" id={`${title}`} />
      <label htmlFor={`${title}`}>
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
