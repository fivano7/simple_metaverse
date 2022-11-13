import './App.css';
import { ethers } from 'ethers';
import { Suspense, useState, useEffect } from "react"
import LandAbi from "./contractsData/land.json"
import LandNetworkAddresses from "./contractsData/land-address.json"

import { Canvas } from "@react-three/fiber"
import { Sky, MapControls } from "@react-three/drei"
import { Physics } from "@react-three/cannon"

import Navbar from "./components/Navbar.js"
import Plane from "./components/Plane.js"
import Plot from "./components/Plot.js"
import Building from "./components/Building.js"

function App() {

  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [landInstance, setLandInstance] = useState(null)
  const [cost, setCost] = useState(0)
  const [buildings, setBuildings] = useState(null)

  const [landId, setLandId] = useState(null)
  const [landName, setLandName] = useState(null)
  const [landOwner, setLandOwner] = useState(null)
  const [hasOwner, setHasOwner] = useState(null)


  const loadBlockchainData = async () => {

    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const networkId = (await provider.getNetwork()).chainId

    const landInstance = new ethers.Contract(LandNetworkAddresses[networkId].address, LandAbi.abi, provider)
    setLandInstance(landInstance)

    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    })

    window.ethereum.on("accountsChanged", async () => {
      loadBlockchainData();
    })

    const cost = ethers.utils.formatEther(await landInstance.cost())
    setCost(cost)

    const buildings = await landInstance.getBuildings()
    setBuildings(buildings)

  }

  const web3Handler = async () => {
    if (provider) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = ethers.utils.getAddress(accounts[0]) //accounts[0] je trenutni
      setAccount(account)
    }
  }

  useEffect(() => {
    loadBlockchainData()
  }, [account])


  const buyHandler = async (_id) => {
    try {

      const signer = provider.getSigner()
      await landInstance.connect(signer).mint(_id, { value: ethers.utils.parseEther("1") })

      const buildings = await landInstance.getBuildings()
      setBuildings(buildings)

      setLandName(buildings[_id - 1].name)
      setLandOwner(buildings[_id - 1].owner)
      setHasOwner(true)

    } catch (error) {
      console.log("Error occured while buying", error)
    }
  }

  return (
    <div>
      <Navbar web3Handler={web3Handler} account={account} />
      <Canvas camera={{ position: [0, 0, 30], up: [0, 0, 1], far: 10000 }}>
        {/* Suspense se ne izvržava dok se određeni uvjet ne ispuni */}
        <Suspense fallback={null}>

          <Sky distance={450000} sunPosition={[1, 10, 0]} inclination={0} azimuth={0.25} />
          <ambientLight intensity={0.5} />

          <Physics>
            {/* && provjerava da li je dostupno */}
            {buildings && buildings.map((building, index) => {
              if (building.owner === "0x0000000000000000000000000000000000000000") {
                return (
                  <Plot
                    key={index}
                    position={[building.posX, building.posY, 0.1]}
                    size={[building.sizeX, building.sizeY, 0.1]}
                    landId={index + 1}
                    landInfo={building}
                    setLandName={setLandName}
                    setLandOwner={setLandOwner}
                    setHasOwner={setHasOwner}
                    setLandId={setLandId} />
                )
              } else {
                return (
                  <Building
                    key={index}
                    position={[building.posX, building.posY, 0.1]}
                    size={[building.sizeX, building.sizeY, building.sizeZ]}
                    landId={index + 1}
                    landInfo={building}
                    setLandName={setLandName}
                    setLandOwner={setLandOwner}
                    setHasOwner={setHasOwner}
                    setLandId={setLandId} />
                )
              }
            })}
          </Physics>
          <Plane/>
        </Suspense>
        <MapControls />
      </Canvas>

      {landId && (
        <div className="info">
          <h1 className="flex">{landName}</h1>

          <div className="flex-left">

            <div className="info--id">
              <h2>Id</h2>
              <p>{landId}</p>
            </div>

            <div className="info--owner">
              <h2>Owner</h2>
              <p>{landOwner}</p>
            </div>

            {!hasOwner && (
              <div className="info--owner">
                <h2>Cost</h2>
                <p>{`${cost} ETH`}</p>
              </div>
            )}

          </div>

          {!hasOwner && (
            <button onClick={() => buyHandler(landId)} className="button info--buy">Buy Property</button>
          )}

        </div>

      )}

    </div>
  )
}

export default App;
