import React, { useEffect, useState } from 'react'
import NavBar from "../components/NavBar"
import CreateLiquidityWidget from "../components/widgets/CreateLiquidityWidget";
import ResultsWidget from "../components/widgets/ResultsWidget"
import DisplayResults from "../components/widgets/DisplayResults"

function Home() {
  const [dataArray, setDataArray] = useState([])
  const [isShown, setIsShown] = useState(false)
  const [isResult, setIsResult] = useState(false);
  const [displayResults, setDisplayResults] = useState(false);
  const [swapAmount, setSwapAmount] = useState(100000000);
  const [time, setTime] = useState(168);

  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      <div className='w-screen h-[120px] bg-black flex items-center justify-center'>
      <NavBar isShown={isShown} 
      setIsShown={setIsShown} 
      isResult={isResult}
      setIsResult={setIsResult}
      setDisplayResults={setDisplayResults}
      />
      </div>
      <div className="h-full w-full flex justify-center items-center">
      {displayResults ? (
        <DisplayResults 
        dataArray={dataArray} 
        setDisplayResults={setDisplayResults} 
        swapAmount={swapAmount}
        displayResults={displayResults} 
        time={time}
        />
      ) : (
        <>
          {isResult ? (
            <ResultsWidget
              setDisplayResults={setDisplayResults}
              setSwapAmount={setSwapAmount}
              swapAmount={swapAmount}
              setTime={setTime}
              time={time}
            />
          ) : (
            <CreateLiquidityWidget setDataArray={setDataArray} />
          )}
        </>
      )}
      </div>
    </div>  
  )
}


export default Home;
