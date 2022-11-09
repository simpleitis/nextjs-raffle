import React, { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useMoralis } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { Bell } from "@web3uikit/icons"
import Header from "./Header"

function LotteryEntrance() {
    const dispath = useNotification()

    // the reason why moralis know about the chainId is because the header component passes all the information about the metamask wallet connected to moralis provider and the moralis provider passes it down to all the components inside the <MoralisProvider> tag which we added in '_app.js'
    // 'chainId: chainIdHex' means we are renaming the variable chainId to chainIdHex
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayers, setNumPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const [interval, setInterval] = useState("0")
    const [raffleState, setRaffleState] = useState("0")

    // 'useWeb3Contract' is a hook which returns many useful functions and values
    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const { runContractFunction: getInterval } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getInterval",
        params: {},
    })

    const { runContractFunction: getRaffleState } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRaffleState",
        params: {},
    })

    async function updateUI() {
        // we have to insert () before using 'toString()' for the promise resolve first and then convert the value to string
        const entranceFeeFromCall = (await getEntranceFee())?.toString()
        const numPlayers = (await getNumberOfPlayers())?.toString()
        const recentWinner = (await getRecentWinner())?.toString()
        const interval = (await getInterval())?.toString()
        const state = (await getRaffleState())?.toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayers(numPlayers)
        setRecentWinner(recentWinner)
        setInterval(interval)
        if (state == "0") {
            setRaffleState("Online")
        } else {
            setRaffleState("Offline")
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async function (tx) {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUI()
    }

    const handleNewNotification = function () {
        dispath({
            type: "success",
            message: "Transaction Complete!",
            title: "Tx notification",
            position: "topR",
            icon: <Bell fontSize="50px" />,
        })
    }

    return (
        <>
            {raffleAddress ? (
                <>
                    <div className="min-h-screen">
                        <div className="grid grid-cols-1 lg:grid-cols-2 pt-4">
                            <div className="col-span-1 mt-4 sm:mt-20">
                                <center>
                                    <img
                                        src="entranceFee.png"
                                        className="self-center px-2 object-scale-down h-60 w-96  mr-9"
                                        alt="logo"
                                    />
                                </center>
                            </div>
                            {/* You might have to go to  (settings->Advanced->Reset account) to reset the account on the local node to prevent the nonce too low error */}
                            <div className="col-span-1 mt-5 lg:mt-20">
                                <center>
                                    <h2 className="font-extrabold text-4xl text-slate-700">
                                        Entrance Fee
                                    </h2>
                                    <p className="font-extrabold text-9xl text-green-500">
                                        {ethers.utils.formatUnits(entranceFee, "ether").toString()}{" "}
                                        ETH
                                    </p>
                                </center>
                            </div>

                            <div className="col-span-1 mt-36">
                                <center>
                                    <h2 className="font-extrabold text-4xl text-slate-700">
                                        Ethereum Raffle
                                    </h2>
                                    <p className="font-extrabold text-8xl text-green-500">{`Try you luck`}</p>
                                </center>
                            </div>
                            <div className="col-span-1 mt-5 md:mt-10 lg:mt-36">
                                <center>
                                    <button
                                        className="border-2 border-green-500 w-max h-max font-extrabold text-2xl sm:text-5xl p-5 lg:mt-10 rounded-3xl text-green-500 hover:bg-green-500 hover:text-white shadow-lg shadow-green-500"
                                        onClick={async function () {
                                            await enterRaffle({
                                                //'onSuccess' only confirm if the transaction has been sent but does not check for block confirmations
                                                onSuccess: handleSuccess,
                                                onError: (error) => console.log(error),
                                            })
                                        }}
                                        disabled={isLoading || isFetching}
                                    >
                                        {isLoading || isFetching ? (
                                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                                        ) : (
                                            "Enter Raffle"
                                        )}
                                    </button>
                                </center>
                            </div>
                        </div>
                    </div>

                    <div className="xl:flex flex-wrap sm:my-20 2xl:my-0 py-40 justify-evenly bg-lime-300 text-white mt-20 2xl:mt-0">
                        <center>
                            <p className="p-2 text-xl text-slate-500 mt-3 sm:mt-0 min-w-full font-semibold">
                                Number of players
                            </p>
                            <p className="text-5xl sm:text-6xl font-bold">{numPlayers}</p>
                        </center>
                        <center className="py-10 xl:py-0">
                            <p className="p-2 text-xl text-slate-500 mt-3 sm:mt-0 font-semibold">
                                Recent Winner
                            </p>
                            <p className="text-5xl sm:text-6xl font-bold">
                                {recentWinner.slice(0, 5)}...{recentWinner.slice(-5)}
                            </p>
                        </center>
                        <center className="py-10 xl:py-0">
                            <p className="p-2 text-xl text-slate-500 mt-3 sm:mt-0 font-semibold">
                                Draw Interval
                            </p>
                            <p className="text-5xl sm:text-6xl font-bold">{interval}sec</p>
                        </center>
                        <center className="py-10 xl:py-0">
                            <p className="p-2 text-xl text-slate-500 mt-3 sm:mt-0 font-semibold">
                                Raffle State
                            </p>
                            <p className="text-5xl sm:text-6xl font-bold">{raffleState}</p>
                        </center>
                    </div>
                </>
            ) : (
                <div>
                    <h2 className="font-extrabold text-2xl text-slate-700">
                        Please Connect to Goerli Network to proceed
                    </h2>
                </div>
            )}
        </>
    )
}

export default LotteryEntrance
