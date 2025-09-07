# 🛠️ CrochetAmigurumiEngine - Recovery Plan

Use this guide when something breaks during development or deployment.

---

## 🔴 If 3D Rendering Breaks

1. **Check if Three.js loaded:**
   ```js
   console.log(typeof THREE);
   console.log(THREE.REVISION); // Should be "128"