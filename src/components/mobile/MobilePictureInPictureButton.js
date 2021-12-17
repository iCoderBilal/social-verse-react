import React from "react";

const MobilePictureInPictureButton = (props) => {
  return (
    <div onClick={(e) => props.handlePictureInPictureClick(e)} className='video__post-information__interaction-button'>
      <img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QA/wD/AP+gvaeTAAABEUlEQVRoge3YvU7DMBiF4fewI37mZu5YbhSx9xIAiQkhBmZWVlZgRQjfwNehHYKxiBJUO5XOM35y0nPiDG7AzMwsExFdRNxGRIr2UkTcRcSylFWl8MALcL7vBzXSF7CS9N4fHhUWXjG/8ABnwGU+LO1AAo5rJJogSTrpD0oFol6e8ST9yFx6hQ6KC7TmAq25QGsu0JoLtFajwD2w0EhABzwM3bzGYa6T9DHlwt1/k7f+LD/M7b1A/oNj5Xl8Gp0bF2jNBVpzgSERsfjHtd3Qmho7sJ5SYhd+PbTu0D5sfUs67Q9KO/BUKcwUj/mgtANL4Jntt8g5+QQu8oPhrx2Q9AqsgBsg1cn2pwRcUwhvZma2AQ2o16hFvoYXAAAAAElFTkSuQmCC' />{" "}
    </div>
  );
};

export default MobilePictureInPictureButton;
