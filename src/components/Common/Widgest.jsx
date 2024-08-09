import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { useEffect, useState } from 'react';

function Widgets({ title, num, percentage, trand, color }) {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => {
      if (progress < percentage) {
        setProgress(prevProgress => prevProgress + 1);
      } else {
        clearInterval(interval);
      }
    }, 7);

    return () => clearInterval(interval);
  }, [progress, percentage]);

  return (
    <>
      <div className="widget-box">
        <div className="data">
          <span className='widget-title'>{title}</span>
          <h5>{num}</h5>
          <span style={{
            color: `${trand > 0 ? 'green' : 'red'}`
          }} className="tranding">
            {trand > 0 ? <FaCaretUp /> : <FaCaretDown />}{trand > 0 ? `${trand}` : `${trand}`}
          </span>
        </div>
        <div className="widgetCircle data">
          <div className='circle-div' style={{
            color: color,

            background: `conic-gradient(${color} ${(progress / 100) * 360}deg, white 0)`
          }}>
            <span className="circle-data">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Widgets