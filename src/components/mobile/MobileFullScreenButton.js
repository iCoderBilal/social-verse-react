import React from "react";

const MobileFullScreenButton = (props) => {
  return (
    <div onClick={(e) => props.handleFullScreenClick(e)} className='video__post-information__interaction-button'>
      <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAAAxUlEQVRoge3ZsRKCMBCE4Ytjq2MNte+Ohb3vxFiQF/gtDJ2BBCacxX4dA5O9hYrETETkbwF34AlEVmxYe00EHkC/Z/h3QVCrArNxUwm+b75YwwIAQ26dsBAQzexSOlAIIbtWrkDF41MI4fYztzSgdsC9SvNPx4zTjgp4UwFvKiAiIiIifvRP7E0FvKmANxXwdl64F83sOl+sbca23tzN3Vj6Aq+KgNbqZwH6dLjgfT4wAl11gRTSAQMwORSYUva24UVEDvEBUV3pMBNHwNMAAAAASUVORK5CYII=' />{" "}
    </div>
  );
};

export default MobileFullScreenButton;
