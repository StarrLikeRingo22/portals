import * as THREE from 'three'
import { useEffect, useRef, useState } from 'react'
import { Canvas, extend, useFrame, useLoader, useThree } from '@react-three/fiber'
import { useCursor, MeshPortalMaterial, CameraControls, Gltf, Text, Preload, Sky, Environment } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing, geometry } from 'maath'
import { suspend } from 'suspend-react'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'

extend(geometry)
const regular = import('@pmndrs/assets/fonts/inter_regular.woff')
const medium = import('@pmndrs/assets/fonts/inter_medium.woff')

export const App = () => (
  <Canvas flat camera={{ fov: 75, position: [0, 0, 5] }} eventSource={document.getElementById('root')} eventPrefix="client">
    <color attach="background" args={['#f0f0f0']} />
    <Frame id="01" name={"Bill\niards"} author="Abdalla Abdelgadir" bg="#e4cdac" position={[-1.75, 0, -0.7]} rotation={[0, 0.5, 0]}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Gltf src="/models/the_billiards_room.glb" scale={0.4} position={[0, -2, -1]} />
    </Frame>
    <Frame id="02" name={"Bi-\nPlane"} author="Abdalla Abdelgadir" position={[-0.5, 0, -1.2]} rotation={[0, 0.2, 0]} >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Sky />
      <Model url="/models/red_biplane_-_animated.glb" scale={0.5} position={[1, -1.6, -2]} rotation={[0, 5.4, 0]} />
    </Frame>
    <Frame id="03" name="still" author="Abdalla Abdelgadir" bg="#d1d1ca" position={[0.7, 0, -1.2]} rotation={[0, -0.2, 0]}>      

    <Environment preset="dawn" background backgroundBlurriness={0.5} />

      <Model url="/models/eat_an_egg_find_a_new_world.glb" scale={0.01} position={[0, -0.9, -2]} rotation={[0, 0, 0]} />
    </Frame>
    <Frame id="04" name={"scare"} author="Abdalla Abdelgadir" position={[1.75, 0, -0.7]} rotation={[0, -0.6, 0]}>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      <Gltf src="/models/storybook_challenge_-_hansel_and_gretel_page_6.glb" scale={1} position={[-2.1, -6.8, -9]} rotation={[-0.2, 0, 0]} />
    </Frame>
    <Rig />
    <Preload all />
  </Canvas>
)

function Frame({ id, name, author, bg, width = 1, height = 1.61803398875, children, ...props }) {
  const portal = useRef()
  const [, setLocation] = useLocation()
  const [, params] = useRoute('/item/:id')
  const [hovered, hover] = useState(false)
  useCursor(hovered)
  useFrame((state, dt) => easing.damp(portal.current, 'blend', params?.id === id ? 1 : 0, 0.2, dt))
  return (
    <group {...props}>
      <Text font={suspend(medium).default} fontSize={0.3} anchorY="top" anchorX="left" lineHeight={0.8} position={[-0.375, 0.715, 0.01]} material-toneMapped={false}>
        {name}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.1} anchorX="right" position={[0.4, -0.659, 0.01]} material-toneMapped={false}>
        /{id}
      </Text>
      <Text font={suspend(regular).default} fontSize={0.04} anchorX="right" position={[0.0, -0.677, 0.01]} material-toneMapped={false}>
        {author}
      </Text>
      <mesh name={id} onDoubleClick={(e) => (e.stopPropagation(), setLocation('/item/' + e.object.name))} onPointerOver={(e) => hover(true)} onPointerOut={() => hover(false)}>
        <roundedPlaneGeometry args={[width, height, 0.1]} />
        <MeshPortalMaterial ref={portal} events={params?.id === id} side={THREE.DoubleSide}>
          <color attach="background" args={[bg]} />
          {children}
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}

function Rig({ position = new THREE.Vector3(0, 0, 2), focus = new THREE.Vector3(0, 0, 0) }) {
  const { controls, scene } = useThree()
  const [, params] = useRoute('/item/:id')
  useEffect(() => {
    const active = scene.getObjectByName(params?.id)
    if (active) {
      active.parent.localToWorld(position.set(0, 0.5, 0.25))
      active.parent.localToWorld(focus.set(0, 0, -2))
    }
    controls?.setLookAt(...position.toArray(), ...focus.toArray(), true)
  })
  return <CameraControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2} />
}
function Model({ url, ...props }) {
  const gltf = useLoader(GLTFLoader, url)
  const [mixer] = useState(() => new THREE.AnimationMixer(gltf.scene))
  const actions = useRef([])

  useEffect(() => {
    gltf.animations.forEach((clip) => {
      const action = mixer.clipAction(clip)
      action.play()
      actions.current.push(action)
    })
    return () => actions.current.forEach((action) => action.stop())
  }, [gltf, mixer])

  useFrame((_, delta) => {
    mixer.update(delta)
  })

  return <primitive object={gltf.scene} {...props} />
}