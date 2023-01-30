import React, { useState, useEffect } from "react";
import { changeTokens, untagMe } from "../../../client-socket";

/**
 * Question page for rendering questions
 *
 * @param {flashCardSet} flashCardSet set of flashcards to randomize while showing question
 * @param {function} setQuestionShowing set whether the question is showing or not
 * @param {object} userData user data object
 * @param {string} gamePin game pin
 * @param {string} tagged whether or not the user is currently tagged
 * @param {function} setTagged change tagged
 * @param {bool} taggedDisplay player tagged display
 */
const Question = (props) => {
  const [questionState, setQuestionState] = useState("question"); //moves between question, right, wrong
  const [curQuestion, setCurQuestion] = useState({
    question: "",
    choices: ["", "", "", ""],
    _id: undefined,
  });
  const [numQuestions, setNumQuestions] = useState(3);

  useEffect(() => {
    handleNewQuestion();
  }, []);

  useEffect(() => {
    if (numQuestions <= 0 && props.tagged) {
      untagMe(props.userData._id, props.gamePin);
    }
  }, [numQuestions]);

  const shuffle = (a, b) => {
    for (let i = a.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
      [b[i], b[j]] = [b[j], b[i]];
    }

    return [a, b];
  };

  const handleNewQuestion = () => {
    console.log(props.curFlashcards);
    const card = props.curFlashcards[0];
    // console.log(card._id);
    const oldAnswers = [0, 1, 2, 3].map((val) => {
      if (card.answers.includes(val)) return true;
      return false;
    });
    const [newChoices, answers] = shuffle([0, 1, 2, 3], oldAnswers);
    let newAnswers = [];
    for (let i = 0; i < 4; i++) {
      if (answers[i] === true) newAnswers.push(i);
    }

    setCurQuestion({
      question: card.question,
      choices: newChoices.map((idx) => card.choices[idx]),
      answers: newAnswers,
      _id: card._id,
    });
  };

  const handleAnswerQuestion = (answerSelected) => {
    if (props.taggedDisplay) return;
    if (curQuestion.answers.includes(answerSelected)) {
      setQuestionState("right");
      changeTokens(props.userData._id, props.gamePin, "correct", curQuestion._id);
      if (numQuestions >= 1) {
        setNumQuestions(numQuestions - 1);
      } else {
        setNumQuestions(0);
      }
      props.setCurFlashcards(
        props.curFlashcards
          .slice(1)
          .concat(props.flashCardSet[Math.floor(Math.random() * props.flashCardSet.length)])
      );
    } else {
      setQuestionState("wrong");
      changeTokens(props.userData._id, props.gamePin, "incorrect", curQuestion._id);
      props.setCurFlashcards(props.curFlashcards.slice(1).concat(curQuestion));
    }
  };

  return (
    <>
      <div className="flex fixed z-30 w-full h-full">
        {questionState === "question" && (
          <div className=" w-[80%] h-[80%] mx-auto my-auto relative flex-col flex justify-center border-solid">
            <div className="basis-[40%] text-6xl flex w-full bg-cyan-600 bg-opacity-90">
              <div className="my-auto mx-auto max-w-[100%] overflow-none break-all">
                {curQuestion.question}
              </div>
            </div>
            <div className="basis-[30%] flex">
              <div
                onClick={() => handleAnswerQuestion(0)}
                className="flex-1 bg-red-600 bg-opacity-90 flex hover:bg-red-700 hover:border-solid border-red-900 hover:cursor-pointer text-4xl max-w-[50%]"
              >
                <div className="mx-auto my-auto">{curQuestion.choices[0]}</div>
              </div>
              <div
                onClick={() => handleAnswerQuestion(1)}
                className="flex-1  bg-yellow-600 bg-opacity-90 flex hover:bg-yellow-700 hover:cursor-pointer hover:border-solid border-yellow-900 text-4xl max-w-[50%] "
              >
                <div className="mx-auto my-auto">{curQuestion.choices[1]}</div>
              </div>
            </div>
            <div className="basis-[30%] flex">
              <div
                onClick={() => handleAnswerQuestion(2)}
                className="flex-1  bg-blue-600 bg-opacity-90 flex hover:bg-blue-700 hover:cursor-pointer hover:border-solid border-blue-900 text-4xl max-w-[50%] "
              >
                <div className="mx-auto my-auto">{curQuestion.choices[2]}</div>
              </div>
              <div
                onClick={() => handleAnswerQuestion(3)}
                className="flex-1 bg-green-600 flex z-0 bg-opacity-0- hover:bg-green-700 hover:cursor-pointer hover:border-solid border-green-900 text-4xl max-w-[50%] overflow-scroll no-scrollbar"
              >
                <div className="mx-auto my-auto">{curQuestion.choices[3]}</div>
              </div>
            </div>
            {!props.tagged && (
              <button
                onClick={() => props.setQuestionShowing(false)}
                className="absolute right-[3vh] font-Ubuntu top-[3vh] text-3xl p-3 hover:cursor-pointer hover:bg-blue-400"
              >
                Exit
              </button>
            )}
            {props.tagged && (
              <div className="absolute top-[2vh] left-[2vh] text-xl p-3">
                Questions remaining: {numQuestions}
              </div>
            )}
          </div>
        )}
        {questionState === "right" && (
          <>
            <div className=" w-[80%] h-[80%] mx-auto my-auto bg-white relative flex-col flex justify-center">
              <div className="flex-1 text-6xl w-full flex bg-green-600">
                <div className="mx-auto my-auto">Correct! (+100)</div>
              </div>
              <div
                onClick={() => {
                  handleNewQuestion();
                  setQuestionState("question");
                }}
                className="flex-1 text-6xl w-full flex bg-blue-600 hover:cursor-pointer hover:bg-blue-400"
              >
                <div className="mx-auto my-auto">Next Question</div>
              </div>
              {!props.tagged && (
                <button
                  onClick={() => props.setQuestionShowing(false)}
                  className="absolute right-[3vh] top-[3vh] text-3xl p-3 font-Ubuntu"
                >
                  Exit
                </button>
              )}
            </div>
          </>
        )}
        {questionState === "wrong" && (
          <>
            <div className=" w-[80%] h-[80%] mx-auto my-auto bg-white relative flex-col flex justify-center">
              <div className="flex-1 w-full bg-red-600 flex justify-center">
                <div className="mx-auto my-auto flex flex-col">
                  <div className="text-6xl mx-auto my-auto">Wrong, Try Again (-100)</div>
                  <div className="text-3xl mt-[3vh] mx-auto">
                    (Correct answer was {curQuestion.choices[curQuestion.answers]})
                  </div>
                </div>
              </div>
              <div
                onClick={() => {
                  handleNewQuestion();
                  setQuestionState("question");
                }}
                className="flex-1 text-6xl w-full bg-blue-600 flex hover:cursor-pointer hover:bg-blue-400"
              >
                <div className="mx-auto my-auto">Next Question</div>
              </div>
              {!props.tagged && (
                <button
                  onClick={() => props.setQuestionShowing(false)}
                  className="absolute right-[3vh] font-Ubuntu top-[3vh] text-3xl p-3"
                >
                  Exit
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Question;
