import { useEffect, useState } from "react";
import { checkHeading, replaceHeading } from "../helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from "react-markdown";


const Answers = ({ ans,totalResult, index,type }) => {
  const [heading, setHeading] = useState(undefined);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeading(ans));
    }
  }, []);

  const components = {
  // eslint-disable-next-line no-unused-vars
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        {...props}
        style={dark}
        language={match[1]}
        PreTag="div"
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code {...props} className={className}>
        {children}
      </code>
    );
  }
};


  return (
    <>
      {index == 0 && totalResult > 1 ? (
        <span className="pt-5 text-xl block text-zinc-800 dark:text-white">{answer}</span>
      ) : heading ? (
        <span className="pt-5 text-lg block text-zinc-500 dark:text-white ">{answer}</span>
      ) : (
        <span className={type=='q'? 'pl-1': 'pl-5'}>
          <ReactMarkdown components={components}>{answer}</ReactMarkdown>
        
        </span>
      )}
    </>
  );
};

export default Answers;
