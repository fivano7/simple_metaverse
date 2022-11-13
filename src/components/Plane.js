const Plane = () => {
    return(
        <mesh position={[0, 0, 0]}>
            {/* width, height */}
            <planeBufferGeometry attach="geometry" args={[30, 30]}/>
            {/* crna */}
            <meshStandardMaterial color={"#000000"} /> 
        </mesh>
    )
}

export default Plane;