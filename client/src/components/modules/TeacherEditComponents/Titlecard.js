import React from "react";

const Titlecard = (props) => {
  return (
    <div
      onClick={() => {
        props.setFlash({ title: "goodbye", cards: [] });
      }}
    >
      Titlecard
    </div>
  );
};

export default Titlecard;
