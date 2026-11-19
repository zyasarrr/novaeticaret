import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

let renderer,scene,camera,controls,group,initialized=false,resizeObserver;
let currentColor="#b7a58f";
export function initProductViewer(){
 const canvas=document.querySelector("#productCanvas"),wrap=canvas.parentElement;
 if(!initialized){
  scene=new THREE.Scene();scene.background=new THREE.Color("#e9e6de");
  camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.set(4.5,3.2,5.8);
  renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
  controls=new OrbitControls(camera,canvas);controls.enableDamping=true;controls.dampingFactor=.06;controls.minDistance=3.8;controls.maxDistance=9;controls.maxPolarAngle=Math.PI/2.05;controls.target.set(0,.85,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xb3aa99,2.1));
  const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(3,6,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);scene.add(key);
  const fill=new THREE.DirectionalLight(0xffe5c6,1.2);fill.position.set(-4,2,-3);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:"#e9e6de",roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.04;floor.receiveShadow=true;scene.add(floor);
  group=new THREE.Group();scene.add(group);buildSofa(currentColor);
  resizeObserver=new ResizeObserver(()=>resize());resizeObserver.observe(wrap);
  initialized=true;animate();
  document.querySelector("#modelLoading").style.display="none";
 }else{resize();controls.update()}
}
function material(color,roughness=.86){return new THREE.MeshStandardMaterial({color,roughness})}
function box(w,h,d,mat,x,y,z,r=0){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;
 if(r){mesh.geometry.dispose();mesh.geometry=new THREE.BoxGeometry(w,h,d,4,3,4);const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i++){const px=p.getX(i),py=p.getY(i),pz=p.getZ(i);p.setXYZ(i,px*(1-r*Math.max(0,Math.abs(py)/(h/2))),py,pz*(1-r*Math.max(0,Math.abs(py)/(h/2))))}mesh.geometry.computeVertexNormals()}
 group.add(mesh);return mesh;
}
function buildSofa(color){
 while(group.children.length){const c=group.children.pop();c.geometry?.dispose();if(c.material?.dispose)c.material.dispose()}
 const fabric=material(color),soft=material(color).clone();soft.roughness=1;
 const wood=material("#765d46",.65),dark=material("#514638");
 // Low, broad upholstered base and back
 box(2.65,.42,1.08,fabric,0,.48,0,.12);
 box(2.65,.95,.30,fabric,0,1.08,-.40,.16);
 box(.34,.75,1.08,fabric,-1.17,.78,0,.16);box(.34,.75,1.08,fabric,1.17,.78,0,.16);
 // Two generous seat cushions
 box(1.20,.20,.82,soft,-.64,.79,.10,.14);box(1.20,.20,.82,soft,.64,.79,.10,.14);
 // Back cushions
 box(1.20,.66,.20,soft,-.64,1.30,-.27,.18);box(1.20,.66,.20,soft,.64,1.30,-.27,.18);
 // Slim timber legs
 for(const x of [-1.05,1.05])for(const z of [-.38,.38]){const leg=box(.09,.34,.09,wood,x,.17,z);leg.rotation.z=x<0?-.08:.08}
 // Subtle seams via thin piping
 const seamMat=material(new THREE.Color(color).multiplyScalar(.88));
 for(const x of [-.64,.64]){const seam= new THREE.Mesh(new THREE.BoxGeometry(.012,.53,.012),seamMat);seam.position.set(x,1.30,-.165);group.add(seam)}
}
function resize(){if(!renderer)return;const wrap=document.querySelector(".model-canvas-wrap");const w=wrap.clientWidth,h=wrap.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function animate(){if(!initialized)return;requestAnimationFrame(animate);controls.update();renderer.render(scene,camera)}
document.addEventListener("click",e=>{
 const swatch=e.target.closest(".swatch");if(!swatch)return;
 document.querySelectorAll(".swatch").forEach(s=>s.classList.toggle("selected",s===swatch));
 currentColor=swatch.dataset.color;buildSofa(currentColor);
});
