import Answers from "../components/Answers";


const QuestionAnswer = ({item,index}) => {
  return (
    <>
      <div
        key={index + Math.random()}
        className={item.type == "q" ? "flex justify-end" : ""}
      >
        {item.type == "q" ? (
          <li
            key={index + Math.random()}
            className="text-right border-8 border-zinc-700 rounded-tl-3xl rounded-br-3xl rounded-bl-3xl dark:bg-zinc-700 p-1 w-fit"
          >
            <Answers
              type={item.type}
              ans={item.text}
              totalResult={1}
              index={index}
            />
          </li>
        ) : (
          item.text.map((ansItem, ansIndex) => (
            <li key={ansIndex + Math.random()} className="text-left p-1">
              <Answers
                type={item.type}
                ans={ansItem}
                totalResult={item.length}
                index={ansIndex}
              />
            </li>
          ))
        )}
      </div>
    </>
  );
};

export default QuestionAnswer;
