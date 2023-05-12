import React, { useState, useEffect, useRef } from 'react'
import { AiOutlineCloseSquare } from 'react-icons/ai'
import { Chart, registerables } from 'chart.js';


const DisplayResults = ({ dataArray, setDisplayResults, swapAmount, displayResults, time }) => {
    const [showModal, setShowModal] = useState(false);
    const [cpammOutput, setCpammOutput] = useState(0);
    const [cpammPriceImpact, setCpammPriceImpact] = useState(0);
    const [aqueductOutput, setAqueductOutput] = useState(0);
    const [aqueductPriceImpact, setAqueductPriceImpact] = useState(0)
    const [timeTaken, setTimeTaken] = useState(0);
    const chartRef = useRef(null);

    const totalAqueductLiquidity = dataArray[0].startingLiquidity + dataArray[1].startingLiquidity;

    const totalCpammLiquidity = dataArray[2].startingLiquidity + dataArray[3].startingLiquidity;

    const AqueductVariables = [
        { value: `$${aqueductOutput.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, label: 'Output:' },
        { value: `${aqueductPriceImpact.toFixed(2)} %`, label: 'Price Impact:' },
        { value: `${timeTaken.toFixed(2)} hours`, label: 'Time:' },
        { value: `$${totalAqueductLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, label: 'Liquidity:' }
    ]

    const CpammVariables = [
        { value: `$${cpammOutput.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, label: 'Output:' },
        { value: `${cpammPriceImpact.toFixed(2)} %`, label: 'Price Impact:' },
        { value: "Discrete", label: "Time:" },
        { value: `$${totalCpammLiquidity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, label: 'Liquidity:' }
    ]

    const getValues = async () => {
        if (displayResults === true) {
            let poolBalanceA = dataArray[0].startingLiquidity;
            let poolBalanceB = dataArray[1].startingLiquidity;

            // CPAMM pool vars
            let poolBalanceC = dataArray[2].startingLiquidity;
            let poolBalanceD = dataArray[3].startingLiquidity;

            // swap vars
            const initialTotalSwapAmount = swapAmount;
            let totalSwapAmount = initialTotalSwapAmount
            const swapRate = totalSwapAmount / (time * 60 * 60);
            console.log('SWAP RATE: ', swapRate)

            // calculate CPAMM output
            const prevK = poolBalanceC * poolBalanceD;
            const totalAmountOut = poolBalanceD - (prevK / (poolBalanceC + totalSwapAmount));
            console.log('CPAMM output: ', totalAmountOut);
            setCpammOutput(totalAmountOut);
            setCpammPriceImpact((1 - (totalAmountOut / (initialTotalSwapAmount))) * 100);

            // Perform the swap
            let seconds = 0;
            let totalSwapOut = 0;
            const t = 10; // how often an arb happens
            while (totalSwapAmount > 0) {
                /** settle swapped amount **/
                if (totalSwapAmount < (swapRate * t)) {
                    const totalAmountOut = poolBalanceB - ((poolBalanceA * poolBalanceB) / (poolBalanceA + (totalSwapAmount)));
                    totalSwapOut += totalAmountOut;
                    totalSwapAmount = 0;

                    seconds += 1;
                } else {
                    totalSwapAmount -= t * swapRate;
                    const totalAmountOut = poolBalanceB - ((poolBalanceA * poolBalanceB) / (poolBalanceA + (t * swapRate)));
                    totalSwapOut += totalAmountOut;

                    seconds += t;
                }
            }

            console.log('remaining amount: ', totalSwapAmount);
            console.log('Amount out: ', totalSwapOut);
            setAqueductOutput(totalSwapOut)
            console.log('Price impact: ', (1 - (totalSwapOut / (initialTotalSwapAmount))) * 100);
            const AqueductPrice = (1 - (totalSwapOut / (initialTotalSwapAmount))) * 100;
            setAqueductPriceImpact(AqueductPrice)
            if (seconds > 3600) {
                console.log('Time taken: ', seconds / 3600, 'hrs');
                setTimeTaken(seconds / 3600);
            } else {
                console.log('Time taken: ', seconds, 'sec');
                setTimeTaken(seconds);
            }

        } else {
            return;
        }
    }

    useEffect(() => {
        getValues();
    }, [displayResults])

    useEffect(() => {
        Chart.register(...registerables);

        const myChart = new Chart(chartRef.current, {
            type: "bar",
            data: {
                labels: ["Aqueduct", "CPAMM"],
                datasets: [
                    {
                        label: "Price Impact",
                        data: [aqueductPriceImpact, cpammPriceImpact],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: "Price Impact",
                        color: "white",
                        padding: {
                            top: 10,
                            bottom: 30
                        },
                        font: {
                            size: 15,
                        },
                    },
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    x: {
                        type: "category",
                        ticks: {
                            color: "white",
                        },
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: "white",
                            callback: function (value) {
                                return value.toLocaleString() + " %";
                            },
                        },
                    },
                },
            },
        });

        return () => {
            myChart.destroy();
            Chart.unregister(...registerables);
        }
    }, [aqueductPriceImpact, cpammPriceImpact])

    return (
        <div className='flex flex-col flex-wrap items-center justify-center space-y-10'>
            <div className='w-2/3 mt-[15px] bg-transparent'>
                <canvas ref={chartRef} className='w-full' />
            </div>
            <div className='flex flex-row space-x-6 flex-wrap'>
                <div className="relative flex flex-col px-6 pb-6 pt-8 2border-[3px] 2rounded-[3.25rem] 2border-[#262626] z-10 w-[400px]">
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
                    <div className='flex flex-row'>
                        <div className='flex flex-col space-y-1'>
                            <h1 className="text-white text-3xl font-bold">Aqueduct</h1>
                            <p className='text-gray-500 text-sm font-bold'>Results</p>
                        </div>
                        <div className="flex grow" />
                        <button className="text-lightGray" type="button" onClick={() => {
                            setDisplayResults(false)
                        }}>
                            <AiOutlineCloseSquare size={25} />
                        </button>
                    </div>
                    <div className="rounded-3xl mt-5 px-2 pt-4 pb-4 flex flex-col items-start bg-highlightGray space-y-5">
                        {AqueductVariables.map((variable) => (
                            <div className='flex flex-row space-x-2' key={variable.label}>
                                <h1 className='text-white text-xl ml-2'>
                                    {variable.label}
                                </h1>
                                <h1 className="text-white text-xl">
                                    {variable.value}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative flex flex-col px-6 pb-6 pt-8 2border-[3px] 2rounded-[3.25rem] 2border-[#262626] z-10 w-[400px]">
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
                    <div className="flex flex-row">
                        <div className='flex flex-col space-y-1'>
                            <h1 className="text-white text-3xl font-bold">CPAMM</h1>
                            <p className='text-gray-500 text-sm font-bold'>Results</p>
                        </div>
                        <div className="flex grow" />
                        <button className="text-lightGray" type="button" onClick={() => {
                            setDisplayResults(false)
                        }}>
                            <AiOutlineCloseSquare size={25} />
                        </button>
                    </div>
                    <div className="rounded-3xl mt-5 px-2 pt-4 pb-4 flex flex-col items-start bg-highlightGray space-y-5">
                        {CpammVariables.map((variable) => (
                            <div className='flex flex-row space-x-2' key={variable.label}>
                                <h1 className='text-white text-xl ml-2'>
                                    {variable.label}
                                </h1>
                                <h1 className="text-white text-xl">
                                    {variable.value}
                                </h1>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DisplayResults;