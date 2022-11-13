import logo from "../assets/logo.png"

const Navbar = ({ web3Handler, account }) => {
    return (
        <nav className="flex-between">
            <h2 className='flex'>
                <img src={logo} className="App-logo" alt="logo" />
                CROtaverse</h2>


            {account ? (
                <button type="button" className='button'>
                    {account.slice(0, 6) + "..." + account.slice(38, 42)}
                </button>
            ) : (
                <button onClick={web3Handler} className="button">Connect Wallet</button>
            )}
        </nav>
    )
}

export default Navbar