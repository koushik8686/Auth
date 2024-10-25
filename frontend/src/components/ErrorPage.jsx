// import Spline from '@splinetool/react-spline';

// export default function App() {
//   return (
//     <div className="relative w-full h-screen bg-gray-900">
//       <div className="flex w-full h-full">
//         {/* Text on the left */}
//         <div className="flex items-center justify-center w-1/2 p-4">
//           <h1 className="text-white text-5xl">
//             Page Not Found
//           </h1>
//         </div>
//         {/* Spline 3D model on the right */}
//         <div className="w-1/2">
//           <Spline scene="https://prod.spline.design/vAEtImxGJSTvnCOV/scene.splinecode" />
//         </div>
//       </div>
//     </div>
//   );
// }

import Spline from '@splinetool/react-spline';

export default function App() {
  return (
    <div className="relative w-full h-screen bg-gray-900">
      <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-4xl z-10">
        Page Not Found 404
      </h1>
      <Spline className="w-full h-full" scene="https://prod.spline.design/HsmOqQTVLW3Ymaok/scene.splinecode" />
    </div>
  );
}

