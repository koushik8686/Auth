'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { useInView } from 'react-intersection-observer'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Link } from 'react-router-dom'

// Advanced 3D Model or Geometry
const AdvancedGeometry = ({ position }) => {
    const meshRef = useRef()
  
    useFrame((state) => {
      const { clock } = state
      meshRef.current.rotation.x = clock.getElapsedTime() * 0.1
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3
    })
  
    return (
      <mesh ref={meshRef} position={position} > {/* Scale increased */}
        <icosahedronGeometry args={[3, 2]} />
        <meshStandardMaterial color="#00ADB5" wireframe />
      </mesh>
    )
  }
  

const Scene = () => {
  return (
    <>
      <OrbitControls enableZoom={false} enablePan={false} />
      <ambientLight intensity={0.9} />
      <pointLight position={[100, 10, 10]} />
      <AdvancedGeometry position={[0, 0, 0]} />
    </>
  )
}

const Section = ({ children, background }) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  })

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center ${background}`}
    >
      {children}
    </motion.section>
  )
}

export default function Start() {
  const { scrollYProgress } = useScroll()
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.5])

  return (
    <div className="bg-gray-900 text-white">
      {/* First Section: 3D Model + Intro Text */}
      <Section background="bg-gray-900">
  <div className="h-screen w-full flex flex-col lg:flex-row justify-between items-center px-8">
    {/* Left Content */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="lg:w-1/2 w-full text-center lg:text-left"
    >
      <h1 className="text-4xl lg:text-5xl font-bold mb-4">
        Welcome to Our Website
      </h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-lg lg:text-xl mb-8"
      >
        Experience the future of digital interaction with cutting-edge technologies and designs that captivate.
      </motion.p>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 inline-block"
      >
        <Link to={'/register'}>Register</Link>
      </motion.div>
    </motion.div>

    {/* Right Content */}
    <div className="h-[50vh] lg:h-full w-full lg:w-1/2 mt-8 lg:mt-0">
      <Canvas>
        <Scene />
      </Canvas>
    </div>
  </div>
</Section>

      {/* Second Section: About Us */}
      <Section background="bg-gray-800">
        <motion.div style={{ scale }} className="max-w-4xl mx-auto p-8">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-xl">
            We are a cutting-edge company specializing in creating immersive digital experiences. Our team of experts
            combines creativity with technology to deliver stunning results.
          </p>
        </motion.div>
      </Section>

      {/* Third Section: Features */}
      <Section background="bg-gray-800">
        <div className="max-w-4xl mx-auto p-8">
          <h2 className="text-4xl font-bold mb-8">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {['Innovation', 'Creativity', 'Technology', 'Excellence'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white bg-opacity-10 p-6 rounded-lg"
              >
                <h3 className="text-2xl font-semibold mb-2">{feature}</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Final Section: Contact Us */}
      <Section background="bg-gray-900">
        <motion.div
          style={{
            y: useTransform(scrollYProgress, [0, 1], [0, -100]),
          }}
          className="max-w-4xl mx-auto p-8 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Contact Us</h2>
          <p className="text-xl mb-8">Ready to start your journey with us? Get in touch today!</p>
          <a
            href="#contact"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          >
            Reach Out
          </a>
        </motion.div>
      </Section>
    </div>
  )
}
