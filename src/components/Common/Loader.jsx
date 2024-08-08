import React from 'react'


function Loader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: "center",
      alignItems: "center",
      minHeight: " 70vh"
    }}>
      <img
        height={"100px"}
        src="loader.gif" alt="" />
    </div>
  )
}

export default Loader