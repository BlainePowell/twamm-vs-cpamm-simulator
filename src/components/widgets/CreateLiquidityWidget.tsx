import React, { useRef, useState, useEffect } from 'react'
import 'next/image'
import { RiQuestionLine } from 'react-icons/ri'

interface Input {
    name: string;
    logo: string;
    startingLiquidity: number;
}

interface InputWidgetProps {
    inputs: Input[];
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
}));

type Data = typeof Data[number];

const testData = [];

const InputWidget = ({ inputs }: InputWidgetProps) => {
    const [inputValue, setInputValue] = useState(inputs.reduce((acc, input) => (
        { ...acc, [input.name]: input.startingLiquidity }), {})
    );
    const [updatedData, setUpdatedData] = useState<Data[]>([]);

    const handleInputChange = (name: string, value: number) => {
        setInputValue(prevValues => ({ ...prevValues, [name]: value }));
    };

    useEffect(() => {
        const updatedData = inputArray.map((input) => {
            const startingLiquidity = inputValue[input.name] ?? input.startingLiquidity;
            return { name: input.name, logo: input.logo, startingLiquidity };
        });
        testData.splice(0, testData.length, ...updatedData);
    }, [inputValue]);

    return (
        <div className="flex flex-col space-y-4">
            {inputs.map((input) => (
                <React.Fragment key={input.name}>
                    <div className="h-[60px] rounded-3xl mt-5 flex flex-row items-center bg-gray-800 space-x-2">
                        <img src={input.logo} className="w-[35px] h-[35px] ml-2" />
                        <h1 className="text-white text-xl">$</h1>
                        <input
                            className="h-full focus:outline-none bg-transparent text-xl text-white font-bold"
                            value={inputValue[input.name]}
                            name={input.name}
                            onChange={(e) => {
                                const newValue = parseInt(e.target.value);
                                if (!isNaN(newValue)) {
                                    handleInputChange(input.name, +e.target.value)
                                } else {
                                    setInputValue("")
                                }
                            }}
                        />
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
};


const CreateLiquidityWidget = ({ setDataArray }) => {
    const [showModal, setShowModal] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isCheck, setIsCheck] = useState(false);

    const playAnimation = async () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsCheck(true);
            setTimeout(() => {
                setIsAnimating(false);
            }, 2000);
        }, 800);
        setIsCheck(false);
    };

    useEffect(() => {
        setDataArray(Data)
    }, [])

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
            <div className="flex justify-start items-start">
                <div className='flex flex-col'>
                    <h1 className="text-white text-3xl font-bold">Add Liquidity</h1>
                    <p className='text-gray-500 text-sm font-bold'>Aqueduct</p>
                </div>
                <div className="flex grow" />
                <button className="text-lightGray mt-2" type="button">
                    <RiQuestionLine size={25} />
                </button>
            </div>
            <InputWidget inputs={AqueductProps} />
            <h1 className='text-white text-3xl font-bold mt-5'>Add Liquidity</h1>
            <p className='text-gray-500 text-sm font-bold'>CPAMM</p>
            <InputWidget inputs={CpammProps} />
            {isAnimating ? (
                <>
                    {isCheck ? (
                        <div className='bg-transparent p-4 text-white font-semibold 2rounded-gc-2xl rounded-full mt-4 flex justify-center items-center max-h-[55px]'>
                            <svg className="checkmark" xmlns="http://www.w3.org/2000/svg"><circle className="checkmark__circle" /><path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>
                        </div>
                    ) : (
                        <div role="status" className='bg-black p-4 text-white font-semibold 2rounded-gc-2xl rounded-full mt-4 flex justify-center items-center max-h-[55px]'>
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-600 animate-spin dark:text-gray-600 fill-aqueductBlue" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Loading...</span>
                        </div>
                    )}
                </>
            ) : (
                <button
                    type="button"
                    className="bg-aqueductBlue p-4 text-white font-semibold 2rounded-gc-2xl rounded-full mt-4"
                    onClick={() => {
                        playAnimation();
                        setDataArray(testData)
                    }}
                >
                    Add Liquidity
                </button>
            )}
        </div>
    );
};

export default CreateLiquidityWidget;