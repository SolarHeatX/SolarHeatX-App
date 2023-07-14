import React from "react";

interface TempBlockProps {
  temperature: string;
  name: string;
  id: string;
}

const TempBlock: React.FC<TempBlockProps> = ({ temperature, name, id }) => {
  return (
    <div className="flex flex-row-reverse xxs:flex-col xxs:w-full items-center justify-between w-full ml-1.5 mr-1.5 md:ml-4 md:mr-4 lg:ml-4.5 lg:mr-4.5 xl:ml-5 xl:mr-5">
      <strong
        id={id}
        className="ml-10 xxs:ml-0 text-sm iphone:text-base md:text-xl lg:text-2xl xl:text-3xl"
      >
        {temperature} °C
      </strong>
      <p className="text-xs iphone:text-sm text-gray-500 mt-0 xxs:mt-2.5">
        {name}
      </p>
    </div>
  );
};

export default TempBlock;
