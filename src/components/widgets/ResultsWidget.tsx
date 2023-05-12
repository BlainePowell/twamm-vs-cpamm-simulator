import React, { useState, useEffect } from 'react'
import 'next/image'
import { TbSettings } from 'react-icons/tb'

const ResultsWidget = ({ setDisplayResults, setSwapAmount, swapAmount, setTime, time }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="relative flex flex-col px-6 pb-6 pt-12 2border-[3px] 2rounded-[3.25rem] 2border-[#262626] z-10 w-[400px]">
            <div className="absolute overflow-hidden 2bg-red-500/25 top-10 left-[0.5rem] right-[0.5rem] bottom-[0.5rem] rounded-gc-3xl z-50 pointer-events-none">
                <div
                    className={`absolute bottom-0 left-0 right-0 bg-darkGray/70 backdrop-blur-3xl blur-lg z-50 transition-all rounded-[2rem] duration-300 ${showModal
                        ? "top-0 pointer-events-auto"
                        : "top-full pointer-events-none"
                        }`}
                    onClick={() => {
                        setShowModal(false);
                    }}
                />
            </div>
            {/*<div className="absolute top-10 bottom-[0.2rem] left-[0.2rem] right-[0.2rem] bg-darkGray/70 backdrop-blur-3xl z-50 rounded-gc-almost4xl opacity-0"  />*/}
            {/*<div className="absolute top-0 bottom-0 left-0 right-0 rounded-c-4xl outline-c-3 outline-c-gray pointer-events-none opacity-0" />*/}
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#262626] rounded-gc-4xl -z-10 pointer-events-none" />
            <div className="absolute top-[0.2rem] bottom-[0.2rem] left-[0.2rem] right-[0.2rem] bg-black rounded-gc-almost4xl -z-10 pointer-events-none" />
            <div className="flex">
                <p className="text-white text-2xl font-bold">Simulate Swap</p>
                <div className="flex grow" />
                <button className="text-lightGray" type="button">
                    <TbSettings size={25} />
                </button>
            </div>
            <div className="h-[60px] rounded-3xl mt-5 flex flex-row items-center bg-gray-800 space-x-2">
                <img src="usdc-logo.png" className="w-[40px] h-[40px] ml-2" />
                <h1 className="text-white text-2xl">$</h1>
                <input
                    className="h-full focus:outline-none bg-transparent text-2xl font-bold text-white"
                    value={swapAmount}
                    onChange={(e) => {
                        const newValue = parseInt(e.target.value);
                        if (!isNaN(newValue)) {
                            setSwapAmount(newValue);
                        } else {
                            setSwapAmount("");
                        }
                    }}
                />
            </div>
            <div className="h-[60px] flex flex-col  mt-5 items-start bg-transparent">
                <h1 className='text-white text-xl mb-5 font-bold'>Time: {time} hours</h1>
                <input
                    type="range"
                    className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent mb-5 bg-highlightGray"
                    id="customRange1"
                    max={336}
                    defaultValue={168}
                    onChange={(e) => {
                        setTime(parseInt(e.target.value))
                    }}
                />
            </div>
            <button
                type="button"
                className="bg-aqueductBlue p-4 text-white font-semibold 2rounded-gc-2xl rounded-full mt-4"
                onClick={() => {
                    setDisplayResults(true)
                }}
            >
                Simulate
            </button>
        </div>
    );
};

export default ResultsWidget;