import React, { useEffect } from "react"
import { useMoralis } from "react-moralis"

function ManualHeader() {
    // 'useMoralis()' is a hook and 'enableWeb3' is a function that we get from 'useMoralis()' which is used to connect to metamask
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    // this 'useEffect' would open up metamask everytime on render if there is no account connected because we are calling the 'enableWeb3' function. To fix this issue we are using the second useEffect
    useEffect(() => {
        if (isWeb3Enabled) return

        //we are doing this because nextjs sometimes has a hard time finding the 'windows' object
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        // '.onAccountChanges' does not fire if we are connecting the first account to the website even if it is done rigth after page render or after connecting, disconnecting and reconnecting again
        Moralis.onAccountChanged((account) => {
            console.log("Account changed to", account)
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
                console.log("Null account found")
            }
        })
    }, [])

    return (
        <div className="bg-blue-500 font-bold text-white p-5 text-2xl sm:text-4xl flex justify-between ">
            <p className="self-center">Raffle</p>
            {account ? (
                <div className="sm:flex">
                    Connected to:
                    <p>
                        {account.toString().slice(0, 5)}...
                        {account.toString().slice(37, 42)}
                    </p>
                </div>
            ) : (
                <button
                    onClick={async () => {
                        await enableWeb3()

                        // we are doing this because nextjs sometimes has a hard time finding the 'windows' object
                        if (typeof window !== "undefined") {
                            // we are adding a key value pair {'connected': 'injected'} to local storage
                            window.localStorage.setItem("connected", "injected")
                        }
                    }}
                    className={isWeb3EnableLoading ? "disabled:opacity-75" : ""}
                    disabled={isWeb3EnableLoading}
                >
                    Connect
                </button>
            )}
        </div>
    )
}

export default ManualHeader
