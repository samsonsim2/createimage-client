import React from 'react'
import {
  OrbitControls,
  PerspectiveCamera,
  PositionalAudio,
} from '@react-three/drei'
import { ReactThreeFiber, Canvas } from '@react-three/fiber'

const Box = () => {
  return (
    <>
      <OrbitControls />
      <mesh>
        <boxBufferGeometry />
        <meshPhongMaterial />
      </mesh>
      <ambientLight args={[0xff0000]} intensity={0.1} />
      <directionalLight position={[0, 0, 5]} intensity={0.5} />
    </>
  )
}

export default Box
