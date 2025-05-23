import { useEffect, useRef, useState } from "react";
import "./App.css";
import { url } from "./constants";
import RecentSearch from "./components/RecentSearch";
import QuestionAnswer from "./components/QuestionAnswer";



function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState([]);
  const [recentHistory, setrecentHistory] = useState(
    JSON.parse(localStorage.getItem("history"))
  );
  const [selectedHistory, setselectedHistory] = useState("");
  const scrollToans = useRef();
  const[loader,setLoader] = useState(false);

  useEffect(() => {
    if (scrollToans.current) {
      scrollToans.current.scrollTop = scrollToans.current.scrollHeight;
    }
  }, [result]);

  const askQuestion = async () => {
  if (!question && !selectedHistory) {
    return false;
  }

  // Only save to localStorage if the question was typed manually
  if (question) {
    if (localStorage.getItem("history")) {
      let history = JSON.parse(localStorage.getItem("history")) || [];

      // Avoid duplicates
      if (!history.includes(question)) {
        let updatedHistory = [question, ...history];
        localStorage.setItem("history", JSON.stringify(updatedHistory));
        setrecentHistory(updatedHistory); // <-- should be updatedHistory, not old history
      } else {
        setrecentHistory(history); // Keep current history
      }
    } else {
      localStorage.setItem("history", JSON.stringify([question]));
      setrecentHistory([question]);
    }
  }

  const payloadData = question ? question : selectedHistory;
  const payload = {
    contents: [
      {
        parts: [
          {
            text: payloadData,
          },
        ],
      },
    ],
  };

  setLoader(true);

  let response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  response = await response.json();

  let dataString = response.candidates[0].content.parts[0].text;
  dataString = dataString.split("* ").map((item) => item.trim());

  setResult([
    ...result,
    { type: "q", text: payloadData },
    { type: "a", text: dataString },
  ]);

  setQuestion("");
  setselectedHistory(""); // clear selection after asking
  setLoader(false);
};


  // const clearHistory = () => {
  //   localStorage.clear();
  //   setrecentHistory();
  // };

  const isEnter = (event) => {
    if (event.key == "Enter") {
      askQuestion();
    }
  };


  // console.log(result);


  /* dark Theme Feature*/

  const[darkMode,setdarkMode] = useState('dark');
  useEffect(()=>{
    if(darkMode==="dark"){
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
            console.log("Dark theme activated")


    }
    else{

      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
            console.log("light theme activated")


    }
  },[darkMode])


  return (
    <>
    <div  className={darkMode==='dark' ? 'dark' : 'light'}>
      <div className="grid grid-cols-5 h-screen text-center">

        <select onChange={(e)=>setdarkMode(e.target.value)}  className="fixed p-5 text-white bottom-0 outline-none">
          <option className="bg-zinc-500" value="dark">Dark</option>
          <option className="bg-zinc-500" value="light">Light</option>
        </select>

        {/* left side bar 1/4 */}
        <RecentSearch askQuestion={askQuestion} recentHistory={recentHistory} setrecentHistory={setrecentHistory} setselectedHistory={setselectedHistory} setQuestion={setQuestion}/>

        {/* right-side-bar 3/4 */}
        <div className="col-span-4 p-10">
          <h1 className="dark:text-zinc-300 text-zinc-600 text-3xl font-bold">Hello ! How can I help You ?</h1>
          {
            loader ? 
            <div className="flex justify-center p-2"  role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
          :null
          }

          <div ref={scrollToans} className="container h-135 overflow-auto ">
            <div className="dark:text-zinc-300 text-zinc-900">
              <ul>
                {result.map((item, index) => (
                  <QuestionAnswer key={index} item={item} index={index}/>
                ))}
              </ul>

              {/* {result}  */}
              {/* <ul>
                 {
                  result && result.map((item,index)=>(
                    <li key={index+Math.random()} className="text-left p-1">
                      <Answers ans={item} totalResult = {result.length} index={index}/>
                    </li>
                  ))
                }
              
              </ul>
              */}
            </div>
          </div>
          <div className="dark:bg-zinc-800 bg-zinc-500 dark:text-white text-zinc-900 m-auto w-1/2 rounded-4xl h-16 pr-5 border border-zinc-700 flex">
            <input
              onKeyDown={isEnter}
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              className="w-full h-full p-4 outline-none text-zinc-300"
              type="text"
              placeholder="Ask me anything"
            />
            <button onClick={askQuestion} className="cursor-pointer">
              Ask
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
