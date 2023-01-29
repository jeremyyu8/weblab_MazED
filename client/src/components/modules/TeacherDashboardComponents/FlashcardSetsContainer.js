import React, { useState, useEffect } from "react";
import Set from "./Set";
import { Redirect } from "@reach/router";
import { get, post } from "../../../utilities";

/**
 * FlashcardSetsContainer renders flashcard metadata for teachers in their dashboard
 *
 * Proptypes
 * @param {metadata} metadata flashcard set metadata, in the form of an array of flashcard objects
 * @param {function} setSetsMetadata setter for metadata
 * @param {function} setUserData setter for user data
 * @param {userData} userData data of the user
 * @param {setIsOpen} setIsOpen set left sidebar
 */
const FlashcardSetsContainer = (props) => {
  const [sets, setSets] = useState([]);
  const [redirect, setRedirect] = useState(false);

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
    return date2 - date1;
  };

  const make_human_readable = (iso) => {
    let date = new Date(iso);
    let now = new Date();

    console.log("iso: ");
    console.log(iso);

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

  const modifySetData = (setData) => {
    setData.last_edited = make_human_readable(setData.last_modified_date);
    return setData;
  };

  const newSet = () => {
    setRedirect("/teacher/edit/new");
  };

  useEffect(() => {
    let cpy = props.metadata;
    cpy.sort(comp);
    cpy.map((setData) => {
      modifySetData(setData);
    });
    props.setSetsMetadata(cpy);

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
          setUserData={props.setUserData}
          userId={props.userId}
          setIsOpen={props.setIsOpen}
        />
      ))
    );
  }, [props.metadata]);

  return (
    <>
      {redirect ? (
        <Redirect from="/teacher" to={redirect} />
      ) : (
        <>
          <div className="background">
            <div class="sheerbox w-[70%]">
              <div className="flex mt-8">
                <div className="text-5xl text-blue-200 my-auto">Flashcard Sets</div>
                <button className="bigbutton ml-10 font-Ubuntu my-auto" onClick={newSet}>
                  Create New Set
                </button>
              </div>
              <div className="overflow-y-auto overflow-x-hidden max-w-[95%] px-6 mx-auto mt-[2vw] mb-[6vw] rounded-xl h-[70vh]">
                {sets.length ? (
                  sets
                ) : (
                  <>
                    <div
                      className="text-xl text-blue-300 text-center mt-[35vh] hover:text-blue-600 cursor-pointer duration-150"
                      onClick={newSet}
                    >
                      No sets to display. Create a new set!
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default FlashcardSetsContainer;
