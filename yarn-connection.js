const curve = new THREE.CatmullRomCurve3([start, midPoint, end]);
const tube = new THREE.TubeGeometry(curve, 20, 0.05, 8);
const yarn = new THREE.Mesh(tube, material);
scene.add(yarn);