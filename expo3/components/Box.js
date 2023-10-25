import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';

import { useAtom } from 'jotai';

export default function Box(props) {
  const ref = useRef();

  return (
    <mesh ref={ref} {...props}>
      <boxGeometry />
      <meshBasicMaterial color={0x00ff00} wireframe />
    </mesh>
  );
}
