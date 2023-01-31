import React, { useState, useEffect, createContext } from "react";
import { Redirect } from "@reach/router";
import Navbar from "../modules/Navbar";
import Titlecard from "../modules/TeacherEditComponents/Titlecard";

import Set from "../modules/TeacherEditComponents/Set";
import { get, post } from "../../utilities";

/**
 * Teacher Edit page for editing flashcards
 *
 * Proptypes
 * none for now
 */

export const flashCardContext = createContext();

const TeacherEdit = () => {
  // let storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads");
  //   },
  //   filename: (req, file, cb) => {
  //     cb(null, file.fieldname + "-" + Date.now());
  //   },
  // });

  // let upload = multer({ storage: storage });

  const [flashCardSet, setFlashCardSet] = useState({ title: "", cards: [] });
  const [setId, setSetId] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dashboardSaveWarning, setDashboardSaveWarning] = useState(false);
  const [redirectDashboard, setRedirectDashboard] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    console.log(flashCardSet);
    if (error !== false) return;
    if (flashCardSet.title.length === 0) {
      setError("your set must have a title!");
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }
    if (flashCardSet.cards.length === 0) {
      setError("your set cannot be empty!");
      setTimeout(() => {
        setError(false);
      }, 3000);
      return;
    }
    for (let card of flashCardSet.cards) {
      if (card.question.length === 0) {
        setError("your questions must not be empty!");
        setTimeout(() => {
          setError(false);
        }, 3000);
        return;
      }
      for (let choice of card.choices) {
        if (choice.length === 0) {
          setError("questions cannot have blank answers");
          setTimeout(() => {
            setError(false);
          }, 3000);
          return;
        }
      }
      if (card.answers.length === 0) {
        setError("every question must have at least one answer selected!");
        setTimeout(() => {
          setError(false);
        }, 3000);
        return;
      }
    }
    setLoading(true);
    if (setId === "new") {
      const newSet = async () => {
        await post("/api/newset", flashCardSet);
        console.log("new set created successfully from teacher edit");
        setLoading(false);
        setRedirect(true);
      };
      newSet();
    } else {
      const updateSet = async () => {
        await post("/api/setbyid", { ...flashCardSet, setid: setId });
        console.log("new set edited successfully from teacher edit");
        setLoading(false);
        setRedirect(true);
      };
      updateSet();
    }
  };

  // get teacher data
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const data = await get("/api/userbyid");
        if (data.role !== "teacher") {
          setRedirect(true);
        }
      } catch (error) {
        setRedirect(true);
      }
    };
    checkLoggedIn();
  }, []);

  const handleBack = () => {
    setRedirectDashboard(true);
  };

  return (
    <>
      {redirect ? (
        <Redirect noThrow from="/teacher" to="/login" />
      ) : redirectDashboard ? (
        <Redirect noThrow from="/teacher/edit" to="/teacher" />
      ) : (
        <>
          <Navbar edit={true} />
          <div class="h-[75px]"></div>
          <div className="background overflow-y-hidden h-[calc(100vh_-_78px)]">
            <div className="sheerbox w-[70%] h-[100%] mb-1">
              <flashCardContext.Provider value={[flashCardSet, setFlashCardSet]}>
                {/* <div className="text-red-600 text-center mt-[10vh] text-3xl">
                Error: please give your flashcard set a title{" "}
              </div> */}
                <div className="flex w-full justify-between relative">
                  <div className="text-xl bg-blue-100 w-[60%] rounded-xl border-solid border-blue-500 border-4 absolute left-[20%] mb-2 p-2">
                    <Titlecard />
                  </div>
                </div>
                <div className="flex-2 w-full inline">
                  <div className="flex max-w-[90%] h-[37vw] m-8 mt-[12vh] mx-auto">
                    <Set setSetId={setSetId} />
                  </div>
                  {error !== false && (
                    <div className="animate-shake text-red-600 w-[70vw]">{error}</div>
                  )}
                  {loading && (
                    <div className="text-green-600 w-[70vw]">
                      <div className="flex">
                        <div>Saving...</div>
                      </div>
                    </div>
                  )}
                  {dashboardSaveWarning && (
                    <>
                      <div className="text-red-600 w-[100%]">
                        <div className="flex justify-end">
                          Return to dashboard? Your work will not be saved
                          <div className="inline">
                            <button
                              className="font-Ubuntu ml-4 hover:cursor-pointer"
                              onClick={handleBack}
                            >
                              Yes
                            </button>
                            <button
                              className="font-Ubuntu hover:cursor-pointer"
                              onClick={() => {
                                setDashboardSaveWarning(false);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="flex justify-center">
                    <div className="w-[50%] h-[5vh] relative">
                      <button
                        onClick={handleSubmit}
                        className="rounded-xl hover:bg-sky-300 cursor-pointer text-xl mt-1 w-full font-Ubuntu align-middle"
                      >
                        Save and Exit
                      </button>
                    </div>
                    <div className="w-[50%] h-[5vh] relative">
                      <button
                        onClick={() => {
                          setDashboardSaveWarning(true);
                        }}
                        className="rounded-xl hover:bg-sky-300 cursor-pointer text-xl mt-1 font-Ubuntu w-full align-middle"
                      >
                        Back to dashboard
                      </button>
                    </div>
                  </div>
                </div>
              </flashCardContext.Provider>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TeacherEdit;
