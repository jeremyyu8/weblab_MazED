import React, { useState, useEffect } from "react";

//flashCardSet[Math.floor(Math.random() * flashCardSet.length)
//props are flashCardSet, setQuestionShowing,
const Question = (props) => {
  const [questionState, setQuestionState] = useState("question"); //moves between question, right, wrong
  const [curQuestion, setCurQuestion] = useState({ question: "", choices: ["", "", "", ""] });

  useEffect(() => {
    setCurQuestion(props.flashCardSet[Math.floor(Math.random() * props.flashCardSet.length)]);
  }, []);

  const handleAnswerQuestion = (answerSelected) => {
    if (curQuestion.answers.includes(answerSelected)) {
      setQuestionState("right");
    } else {
      setQuestionState("wrong");
    }
  };

  return (
    <>
      <div className="flex fixed z-50 w-full h-full">
        {questionState === "question" && (
          <div className=" w-[80%] h-[80%] mx-auto my-auto bg-white relative flex-col flex justify-center">
            <div className="basis-[40%]  text-6xl flex w-full bg-blue-600">
              <div className="my-auto mx-auto"> {curQuestion.question}</div>
            </div>
            <div className="basis-[30%] flex">
              <div
                onClick={() => handleAnswerQuestion(0)}
                className="flex-1 bg-red-600 flex hover:bg-red-400 hover:cursor-pointer border-solid border-red-900 border-4 text-6xl"
              >
                <div className="mx-auto my-auto">{curQuestion.choices[0]}</div>
              </div>
              <div
                onClick={() => handleAnswerQuestion(1)}
                className="flex-1  bg-orange-600 flex hover:bg-orange-400 hover:cursor-pointer text-6xl"
              >
                <div className="mx-auto my-auto">{curQuestion.choices[1]}</div>
              </div>
            </div>
            <div onClick={() => handleAnswerQuestion(2)} className="basis-[30%] flex">
              <div className="flex-1  bg-green-600 flex hover:bg-green-400 hover:cursor-pointer text-6xl">
                <div className="mx-auto my-auto">{curQuestion.choices[2]}</div>
              </div>
              <div
                onClick={() => handleAnswerQuestion(3)}
                className="flex-1 bg-blue-400 flex hover:bg-blue-200 hover:cursor-pointer text-6xl"
              >
                <div className="mx-auto my-auto">{curQuestion.choices[3]}</div>
              </div>
            </div>
            <button
              onClick={() => props.setQuestionShowing(false)}
              className="absolute right-[3vh] top-[3vh] text-3xl p-3"
            >
              Exit
            </button>
          </div>
        )}
        {questionState === "right" && (
          <>
            <div className=" w-[80%] h-[80%] mx-auto my-auto bg-white relative flex-col flex justify-center">
              <div className="flex-1 text-6xl w-full flex bg-green-600">
                <div className="mx-auto my-auto">Correct!</div>
              </div>
              <div
                onClick={() => {
                  setCurQuestion(
                    props.flashCardSet[Math.floor(Math.random() * props.flashCardSet.length)]
                  );
                  setQuestionState("question");
                }}
                className="flex-1 text-6xl w-full flex bg-blue-600"
              >
                <div className="mx-auto my-auto">Next Question</div>
              </div>
            </div>
          </>
        )}
        {questionState === "wrong" && (
          <>
            <div className=" w-[80%] h-[80%] mx-auto my-auto bg-white relative flex-col flex justify-center">
              <div className="flex-1 text-6xl w-full bg-red-600 flex">
                <div className="mx-auto my-auto">Wrong, Try Again</div>
              </div>
              <div
                onClick={() => {
                  setCurQuestion(
                    props.flashCardSet[Math.floor(Math.random() * props.flashCardSet.length)]
                  );
                  setQuestionState("question");
                }}
                className="flex-1 text-6xl w-full bg-blue-600 flex"
              >
                <div className="mx-auto my-auto">Next Question</div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Question;
