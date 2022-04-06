import Highlighter from "monaco-jsx-highlighter";

export const HighligherWrapper = (props) => {
  // Make instance here or outside
  const highlighter = useMemo(() => new Highlighter(),[]);  

  // Do whatever you want here with highlighter instance

  return <div>Something</div>;
}

export default HighligherWrapper;