import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber/native';
import useControls from 'r3f-native-orbitcontrols';
import Box from './components/Box'; // Import the Box component
import io from 'socket.io-client';
import { useAtom, atom } from 'jotai';
import * as THREE from 'three';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Pressable,
} from 'react-native';

import UI from './components/UI';
import { Hud } from '@react-three/drei/native';
import { Joystick } from 'react-joystick-component';

const socket = io('http://192.168.88.43:3000');
export const playersAtom = atom([]);

const styles = StyleSheet.create({
  body: {
    margin: 0,
    flex: 1,
    zIndex: 0,
  },
  body2: {
    flex: 1,
    width: 100,
    height: 100,
  },
  leftButtonCon: {
    width: 100,
    height: 80,
    top: 260,
    left: 70,
    zIndex: 999, // Increase the zIndex value to bring it forward
    elevation: Platform.OS === 'android' ? 50 : 0,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  leftButton: {
    width: 100,
    height: 80,
    flex: 1,
  },
  rightButton: {
    position: 'absolute',
    width: 30,
    height: 20,
    top: 260,
    left: 170,
    zIndex: 999, // Increase the zIndex value to bring it forward
    elevation: Platform.OS === 'android' ? 50 : 0,
    backgroundColor: 'black',
    borderRadius: 10,
  },
  zone1: {
    height: 100,
    width: 100,
  },
});

function BattleZone() {
  return (
    <>
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.001}
        onClick={(e) => socket.emit('move', [e.point.x, 0, e.point.z])}
      >
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <pointLight position={[10, 10, 10]} />
    </>
  );
}

export default function App() {
  const [OrbitControls, events] = useControls();
  const [_players, setPlayers] = useAtom(playersAtom);
  const [players] = useAtom(playersAtom);
  const leftButtonPressed = () => console.log('left');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server');
    });

    // Define any socket.io event handlers here
    socket.on('custom-event', (data) => {
      console.log('Received data from the server:', data);
      // You can update your state or trigger actions based on data received from the server.
    });

    function onPlayers(value) {
      setPlayers(value);
      console.log(value);
    }
    socket.on('players', onPlayers);

    return () => {
      socket.disconnect(); // Disconnect from the server when the component unmounts
    };
  }, []);
  return (
    <>
      <View style={styles.body} {...events}>
        {/* <View style={styles.leftButtonCon}>
          <TouchableOpacity
            onPress={leftButtonPressed}
            style={styles.leftButton}
            // onPress={() => socket.emit('move', { button: 'left' })}
          ></TouchableOpacity>
          <View style={styles.rightButton}>
            <TouchableOpacity
              onPress={() => console.log('left')}
            ></TouchableOpacity>
          </View>
        </View> */}
        <Canvas camera={{ position: [100, 100, 100], fov: 30 }}>
          <ambientLight />
          <BattleZone />
          {players.map((player) => (
            <>
              <Box
                key={player.id}
                onClick={() => console.log('left')}
                position={
                  new THREE.Vector3(
                    player.position[0],
                    player.position[1],
                    player.position[2]
                  )
                }
              />
            </>
          ))}

          <Hud style={styles.body2} renderPriority={2}>
            <orthographicCamera
              makeDefault={true}
              position={[0, 0, 10]}
              left={0} // Set left boundary of the camera view
              right={5} // Set right boundary of the camera view
              top={5} // Set top boundary of the camera view
              bottom={0} // Set bottom boundary of the camera view
              near={0.1} // Near clipping plane
              far={100} // Far clipping plane
            />
            <mesh>
              <boxGeometry />
            </mesh>
          </Hud>
        </Canvas>
      </View>
    </>
  );
}
