import React from 'react';

const StatsCard = ({ title, value, color }) => {
  let bgColor, textColor;

  switch (color) {
    case 'purple':
      bgColor = 'bg-[#9CA8FF]';
      textColor = 'text-black';
      break;
    case 'red':
      bgColor = 'bg-[#FF4C56]';
      textColor = 'text-black';
      break;
    case 'green':
      bgColor = 'bg-[#47D829]';
      textColor = 'text-black';
      break;
    default:
      bgColor = 'bg-white';
      textColor = 'text-gray-900';
      break;
  }

  return (
    <div className={`stats-card rounded-[15px] h-[65px] shadow-md ${bgColor} ${textColor} max-w-auto flex flex-row items-center`}>
      <h3 className="text-black text-xl font-bold w-full text-left rounded-[12px] pl-5">{title}</h3>
      <div className={`bg-white h-[65px] w-[40%] flex items-center justify-center text-black text-xl font-semibold rounded-[12px]`}>
        {value.toLocaleString()} {/* Assuming value is a number representing aggregated data */}
      </div>
    </div>
  );
};

export default StatsCard;
