import React, { useState, useEffect } from "react";
import Set from "./Set";
import { get, post } from "../../../utilities";

/**
 * FlashcardSetsContainer renders flashcard metadata for teachers in their dashboard
 *
 * Proptypes
 * @param {metadata} metadata flashcard set metadata, in the form of an array of flashcard objects
 * @param {function} setSetsMetadata setter for metadata
 */
const FlashcardSetsContainer = (props) => {
  const [sets, setSets] = useState([]);

  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const comp = (setData1, setData2) => {
    // iso = iso string
    let date1 = new Date(setData1.last_modified_date);
    let date2 = new Date(setData2.last_modified_date);
    // console.log(iso1, iso2);
    // const utc1 = Date.UTC(
    //   date1.getFullYear(),
    //   date1.getMonth(),
    //   date1.getDate(),
    //   date1.getHours(),
    //   date1.getMinutes(),
    //   date1.getSeconds()
    // );
    // const utc2 = Date.UTC(
    //   date2.getFullYear(),
    //   date2.getMonth(),
    //   date2.getDate(),
    //   date2.getHours(),
    //   date2.getMinutes(),
    //   date2.getSeconds()
    // );
    // console.log(utc1 - utc2);
    return date2 - date1;
  };

  const make_human_readable = (iso) => {
    let date = new Date(iso);
    let now = new Date();

    console.log("iso: ");
    console.log(iso);

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const utc2 = Date.UTC(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds()
    );

    // console.log("past");
    // console.log(utc1);
    // console.log("now");
    // console.log(utc2);

    let dif = Math.floor((utc2 - utc1) / 1000); // dif in seconds
    if (dif < 60) {
      return `Last edited: ${dif} seconds ago`;
    } else if (dif < 3600) {
      const m = Math.floor(dif / 60);
      const s = dif - m * 60;
      const mtag = m == 1 ? "minute" : "minutes";
      return `Last edited: ${m} ${mtag} ${s} seconds ago`;
    } else if (dif < 86400) {
      dif = Math.floor(dif / 60); // dif in minutes
      const h = Math.floor(dif / 60);
      const m = dif - h * 60;
      const htag = h == 1 ? "hour" : "hours";
      return `Last edited: ${h} ${htag} ${m} minutes ago`;
    } else if (dif < 31557600) {
      dif = Math.floor(dif / 3600); // dif in hours
      const d = Math.floor(dif / 24);
      const h = dif - d * 24;
      const dtag = d == 1 ? "day" : "days";
      return `Last edited: ${d} ${dtag} ${h} hours ago`;
    } else {
      dif = Math.floor(dif / 86400); // dif in days
      const y = Math.floor(dif / 365.25);
      const d = Math.floor(dif - y * 365.25);
      const ytag = y == 1 ? "year" : "years";
      return `Last edited: ${y} ${ytag} ${d} days ago`;
    }
  };

  // function dateDiffInDays(a, b) {
  //   const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  //   // Discard the time and time-zone information.
  //   const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  //   const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  //   return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  // }

  const modifySetData = (setData) => {
    setData.last_edited = make_human_readable(setData.last_modified_date);
    return setData;
  };

  useEffect(() => {
    let cpy = props.metadata;
    cpy.sort(comp);
    cpy.map((setData) => {
      modifySetData(setData);
    });
    props.setSetsMetadata(cpy);

    // for (let setData of props.metadata) {
    //   console.log(setData.last_modified_date);
    // }

    setSets(
      props.metadata.map((setData, i) => (
        <Set
          key={i}
          _id={setData._id}
          title={setData.title}
          date={setData.last_edited}
          size={setData.size}
          setSetsMetadata={props.setSetsMetadata}
          metadata={props.metadata}
          userData={props.userData}
          setUserData={props.setUserData}
        />
      ))
    );
  }, [props.metadata]);

  // useEffect(() => {
  //   let cpy = props.metadata;
  //   cpy.sort(comp);
  //   cpy.map((setData) => {
  //     modifySetData(setData);
  //   });
  //   props.setSetsMetadata(cpy);

  //   for (let setData of props.metadata) {
  //     console.log(setData.last_modified_date);
  //   }

  //   setSets(
  //     props.metadata.map((setData, i) => (
  //       <Set
  //         key={i}
  //         _id={setData._id}
  //         title={setData.title}
  //         date={setData.last_modified_date}
  //         size={setData.size}
  //         setSetsMetadata={props.setSetsMetadata}
  //         metadata={props.metadata}
  //       />
  //     ))
  //   );
  // }, [])

  return (
    <>
      <div className="flex border-solid mt-10 mx-10">
        <div className="text-6xl text-blue-900 border-solid flex-1">Flashcard Sets</div>
        <button
          className="my-auto mx-10 flex-none border-solid hover:bg-sky-300 cursor-pointer transition-all text-4xl"
          onClick={() => {
            window.location.replace("/teacher/edit/new");
          }}
        >
          Create New Set
        </button>
      </div>
      <div className="overflow-scroll max-w-[70%] px-6 mx-auto mt-[4vw] border border-solid border-black rounded-xl h-[50%]">
        {sets}
      </div>
    </>
  );
};

export default FlashcardSetsContainer;
