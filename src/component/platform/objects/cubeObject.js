import * as THREE from "three";
import { CSG } from "three-csg-ts";
import { basic } from "../materials/basic";
export function cube() {
    const geometry = new THREE.BoxGeometry( 1, 2.5, 0.2 ); 
    const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} )
    const cube = new THREE.Mesh( geometry, material ); 
    cube.updateMatrix();
    return cube;
}
