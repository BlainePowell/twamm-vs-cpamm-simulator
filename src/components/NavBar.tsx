/* eslint-disable react/require-default-props */
import { TbArrowsRightLeft } from "react-icons/tb";
import { AiOutlineLineChart } from "react-icons/ai";
import Head from "next/head";
import Image from "next/image";
import { IoClose, IoMenu } from "react-icons/io5";
import React, {
    Dispatch,
    SetStateAction,
    useState,
    useLayoutEffect,
} from "react";
import { useRouter } from "next/router";
import { useSpring, animated } from "react-spring";
import logo from "../../public/aqlogo.png";
import { Twirl as Hamburger } from 'hamburger-react'

const navItems: { icon: JSX.Element; label: string; selected: boolean }[] = [
    {
        icon: <AiOutlineLineChart size={18} />,
        label: "Results",
        selected: true,
    },
    {
        icon: <TbArrowsRightLeft size={18} />,
        label: "Add Liquidity",
        selected: false,
    },
];

const NavBar = ({
    isShown,
    setIsShown,
    isResult,
    setIsResult,
    setDisplayResults
}: {
    isShown: boolean;
    setIsShown: Dispatch<SetStateAction<boolean>>;
    isResult: boolean;
    setIsResult: Dispatch<SetStateAction<boolean>>;
    setDisplayResults: Dispatch<SetStateAction<boolean>>;
}) => {

    const [isOpen, setIsOpen] = useState(false)

    const router = useRouter();
    const [highlighterStyle, setHighlighterStyle] = useState({
        width: 0,
        left: 0,
    });

    const updateHighlighterStyle = () => {
        const activeNavItem = document.querySelector(
            ".nav-item.active"
        ) as HTMLElement;
        if (activeNavItem) {
            setHighlighterStyle({
                width: activeNavItem.offsetWidth,
                left: activeNavItem.offsetLeft,
            });
        }
    };

    useLayoutEffect(() => {
        updateHighlighterStyle();
    }, [router.pathname]);

    const springStyle = useSpring({
        ...highlighterStyle,
        config: { mass: 2.5, tension: 1000, friction: 80 },
    });

    return (
        <header className="flex p-8 w-full max-w-[115rem] bg-black">
            <Head>
                <title>Aqueduct TWAMM</title>
                <meta name="description" content="Swap tokens every second." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex items-center justify-between space-x-2 text-aqueductBlue w-full md:w-auto z-2">
                <Image
                    src={logo}
                    alt="Aqueduct logo"
                    className="rounded-xl opacity-95 w-[40px] h-[40px]"
                    onClick={() => {
                        if (isOpen === true) {
                            setIsOpen(false);
                        } else {
                            setIsOpen(true);
                        }
                    }}
                />
                <div className="flex items-center h-full">
                    <h1 className="text-2xl font-semibold pl-1 poppins-font text-transparent bg-clip-text bg-gradient-to-br from-[#2B75CE] to-[#0C4791]">
                        aqueduct
                    </h1>
                </div>
                <div className="flex grow" /> {/* add this class */}
                <button
                    type="button"
                    className="md:hidden"
                    onClick={() => {
                        setIsShown(!isShown);
                    }}
                >
                    <Hamburger direction="left" toggled={isShown} toggle={setIsShown} duration={.7} />
                </button>
            </div>
            <div className="flex-grow" /> {/* change class to flex-grow */}
            <nav className="md:flex justify-center hidden bg-darkGray 2rounded-c-2xl mr-[190px] rounded-2xl py-2 text-white font-semibold">
                <ul className="flex list-none m-0 p-0 relative">
                    <animated.li
                        className="highlighter absolute bottom-0 left-0 bg-highlightGray 2rounded-c-xl rounded-xl z-0"
                        style={{ ...springStyle, height: "100%" }}
                    />
                    {navItems.map(({ label, selected }, index) => (
                        <li
                            key={label}
                            className={`flex items-center justify-center mx-2 px-5 py-2 rounded-md cursor-pointer z-10 ${selected ? "bg-highlightGray" : ""}`}
                        >
                            <div
                                className="text-white"
                                onClick={() => {
                                    if (label === "Results") {
                                        setIsResult(false);
                                        setDisplayResults(false)
                                        navItems[index].selected = true;
                                        navItems[1].selected = false;
                                    } else {
                                        setIsResult(true);
                                        setDisplayResults(false)
                                        navItems[index].selected = true;
                                        navItems[0].selected = false;
                                    }
                                }}
                            >
                                {label}
                            </div>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="flex-grow" /> {/* change class to flex-grow */}
        </header>
    );
};

export default NavBar;