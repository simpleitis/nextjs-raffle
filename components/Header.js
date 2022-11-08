import React from "react"
import { ConnectButton } from "web3uikit"

function Header() {
    return (
        <div className="flex justify-between sm:px-3 py-3 shadow-md relative">
            <div className="self-center font-bold text-gray-800 text-2xl sm:text-5xl flex">
                <img src="logo.png" className="self-center px-2" alt="logo" />
                <p className="self-center">Raffle</p>
            </div>

            {/* 'moralidAuth' is set to false to specify we do not want to connect to any server to add extra feature */}

            <ConnectButton moralisAuth={false} className="self-center" />
        </div>
    )
}

export default Header
