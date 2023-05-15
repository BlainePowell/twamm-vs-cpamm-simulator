import React, { useState, useEffect } from 'react'
import { AiOutlineLineChart } from 'react-icons/ai'
import { TbArrowsRightLeft } from 'react-icons/tb';
import NavBar from "../components/NavBar"
import CreateLiquidityWidget from "../components/widgets/CreateLiquidityWidget";
import ResultsWidget from "../components/widgets/ResultsWidget"
import DisplayResults from "../components/widgets/DisplayResults"

const navItems: { icon: JSX.Element; label: string; selected: boolean }[] = [
  {
    icon: <AiOutlineLineChart size={18} />,
    label: "Results",
    selected: false,
  },
  {
    icon: <TbArrowsRightLeft size={18} />,
    label: "Add Liquidity",
    selected: true,
  },
];

interface Input {
  name: string;
  logo: string;
  startingLiquidity: number;
}

const AqueductProps: Input[] = [
  {
    name: "Token0",
    logo: "/usdc-logo.png",
    startingLiquidity: 1000000
  },
  {
    name: "Token1",
    logo: "/dai-logo.png",
    startingLiquidity: 1000000
  }
]

const CpammProps: Input[] = [
  {
    name: "Token2",
    logo: "/usdc-logo.png",
    startingLiquidity: 100000000
  },
  {
    name: "Token3",
    logo: "/dai-logo.png",
    startingLiquidity: 100000000
  }
]

const inputArray: Input[] = [...AqueductProps, ...CpammProps];

const Data = inputArray.map((input) => ({
  name: input.name,
  logo: input.logo,
  startingLiquidity: input.startingLiquidity,
}))

function Home() {
  const [dataArray, setDataArray] = useState(Data)
  const [isShown, setIsShown] = useState(false)
  const [isResult, setIsResult] = useState(false);
  const [displayResults, setDisplayResults] = useState(false);
  const [swapAmount, setSwapAmount] = useState(100000000);
  const [time, setTime] = useState(168);
  const [arbTime, setArbTime] = useState(10);

  useEffect(() => {
    document.body.style.background = "#000000";
    console.log(dataArray)
  }, [dataArray])

  return (
    <div className="flex flex-col w-screen h-screen bg-black">
      <div className='w-screen h-[100px] flex items-center justify-center'>
        <NavBar isShown={isShown}
          setIsShown={setIsShown}
          isResult={isResult}
          setIsResult={setIsResult}
          setDisplayResults={setDisplayResults}
        />
      </div>
      {isShown ? (
        <div
          className={`absolute w-full h-full top-[100px] z-50 ease-in-out duration-300 space-y-5`}
          style={{ backdropFilter: isShown ? "blur(20px)" : "none", zIndex: "100" }}
        >
          <div className='mt-10 space-y-5 px-6'>
            {navItems.map(({ label, selected }, index) => (
              <li
                key={label}
                className={`flex items-center justify-center mx-2 px-6 py-6 rounded-3xl cursor-pointer z-10 bg-aqueductBlue`}
              >
                <div
                  className="text-white font-bold text-2xl"
                  onClick={() => {
                    if (label === "Results") {
                      setIsResult(false);
                      setDisplayResults(false)
                      navItems[index].selected = true;
                      navItems[1].selected = false;
                      setIsShown(false)
                    } else {
                      setIsResult(true);
                      setDisplayResults(false)
                      navItems[index].selected = true;
                      navItems[0].selected = false;
                      setIsShown(false)
                    }
                  }}
                >
                  {label}
                </div>
              </li>
            ))}
          </div>
        </div>
      ) : (
        <div className='absolute w-full h-[0px] top-[100px] ease-in-out duration-300 z-50' />
      )}
      <div className="h-full w-full flex justify-center px-12 pb-6 items-center">
        {displayResults ? (
          <DisplayResults
            dataArray={dataArray}
            setDisplayResults={setDisplayResults}
            swapAmount={swapAmount}
            displayResults={displayResults}
            time={time}
            arbTime={arbTime}
          />
        ) : (
          <>
            {isResult ? (
              <CreateLiquidityWidget setDataArray={setDataArray} />
            ) : (
              <ResultsWidget
                setDisplayResults={setDisplayResults}
                setSwapAmount={setSwapAmount}
                swapAmount={swapAmount}
                setTime={setTime}
                time={time}
                setArbTime={setArbTime}
                arbTime={arbTime}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}


export default Home;
