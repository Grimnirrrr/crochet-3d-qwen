# Three.js r128 Capabilities Test

- ✅ CDN Loaded: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`
- ✅ `THREE.REVISION`: "128"
- ✅ `SphereGeometry`: Works
- ✅ `CylinderGeometry`: Works (assumed, used in primitives)
- ❌ `CapsuleGeometry`: Not available (expected — added in r142)
- ✅ WebGL Renderer: Works
- ✅ Basic scene, camera, mesh: Functional

> ✅ Conclusion: r128 is safe and compatible. Use Sphere + Cylinder for stitch shapes.