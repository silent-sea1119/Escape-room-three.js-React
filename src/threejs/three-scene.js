import React, { Component, } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { AnimationMixer } from "three";

import { gsap } from "gsap";
//import { click } from "@testing-library/user-event/dist/click";
class ThreeScene extends Component {
	canvasRef = React.createRef();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
	renderer = new THREE.WebGLRenderer({ antialias: true });
	loader = new GLTFLoader();
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	boundingObj = new THREE.Object3D();
	previousCameraPos = new THREE.Vector3(0, 3, 0);
	viewObjectFlag = false;

	componentDidMount() {
		// Canvas
		const canvas = this.canvasRef.current;
		if (canvas.height > 0) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(canvas.width, canvas.height);
			return;
		}
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Camera
		this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
		this.camera.position.set(0, 3, 0);
		this.camera.updateProjectionMatrix();

		this.mixers = {};
		this.clipActions = {};

		this.clock = new THREE.Clock();

		this.dict = {
			"laptop": ["Base", "Base001"],
			"desk_left": ['Wood_Desk001'],
			"desk_right": ['Wood_Desk002'],
			"cabinet_left": ['Tv_Cabinet001'],
			"cabinet_right": ['Tv_Cabinet002'],
			"cabinet_top": ['Tv_Cabinet003'],
			"cabinet_down": ['Tv_Cabinet004']
		}

		// Renderer
		this.renderer.setSize(canvas.width, canvas.height);
		canvas.appendChild(this.renderer.domElement);


		// Light
		// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		// directionalLight.position.set(5, 10, 7.5);
		// this.scene.add(directionalLight);
		// const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
		// directionalLight1.position.set(-5, 10, -7.5);
		// this.scene.add(directionalLight1);
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
		this.scene.add(ambientLight);
		const pointLight = new THREE.PointLight(0xffffff, 0.5);
		pointLight.position.set(0, 3.3, 0);
		this.scene.add(pointLight);
		// const hemisphereLight = new THREE.HemisphereLight(0xdddddd, 0x666666);
		// this.scene.add(hemisphereLight);

		/**
		 * Objects
		 */
		// Axes
		// const axes = new THREE.AxesHelper(10);
		// this.scene.add(axes);

		// Room
		this.loader.load("Finalscene3.gltf", (gltf) => {
			const model = gltf.scene;
			const animations = gltf.animations;

			console.log(animations)
			this.boundingObj = gltf.scene.getObjectByName("Cube001_1");

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Base001"));
				const clip = new THREE.AnimationClip('laptop', 1, [animations[0].tracks[6], animations[0].tracks[7], animations[0].tracks[8]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['laptop'] = mixer;
				this.clipActions['laptop'] = clipAction;
			}

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Wood_Desk001"));
				const clip = new THREE.AnimationClip('desk_left', 1, [animations[0].tracks[57], animations[0].tracks[58], animations[0].tracks[59]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['desk_left'] = mixer;
				this.clipActions['desk_left'] = clipAction;
			}

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Wood_Desk002"));
				const clip = new THREE.AnimationClip('desk_right', 1, [animations[0].tracks[60], animations[0].tracks[61], animations[0].tracks[62]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['desk_right'] = mixer;
				this.clipActions['desk_right'] = clipAction;
			}

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Tv_Cabinet001"));
				const clip = new THREE.AnimationClip('cabinet_left', 1, [animations[0].tracks[42], animations[0].tracks[43], animations[0].tracks[44]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['cabinet_left'] = mixer;
				this.clipActions['cabinet_left'] = clipAction;
			}

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Tv_Cabinet002"));
				const clip = new THREE.AnimationClip('cabinet_right', 1, [animations[0].tracks[45], animations[0].tracks[46], animations[0].tracks[47]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['cabinet_right'] = mixer;
				this.clipActions['cabinet_right'] = clipAction;
			}

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Tv_Cabinet003"));
				const clip = new THREE.AnimationClip('cabinet_top', 1, [animations[0].tracks[48], animations[0].tracks[49], animations[0].tracks[50]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['cabinet_top'] = mixer;
				this.clipActions['cabinet_top'] = clipAction;
			}

			{
				const mixer = new AnimationMixer(gltf.scene.getObjectByName("Tv_Cabinet004"));
				const clip = new THREE.AnimationClip('cabinet_down', 1, [animations[0].tracks[51], animations[0].tracks[52], animations[0].tracks[53]]);
				const clipAction = mixer.clipAction(clip);
				clipAction.clampWhenFinished = true;
				clipAction.setLoop(THREE.LoopOnce);
				this.mixers['cabinet_down'] = mixer;
				this.clipActions['cabinet_down'] = clipAction;
			}





			// model.traverse((child) => {
			//   if (!child.isMesh) return;
			//   var prevMaterial = child.material;
			//   child.material = new THREE.MeshLambertMaterial();
			//   THREE.MeshBasicMaterial.prototype.copy.call(child.material, prevMaterial);
			// });
			this.scene.add(model);
			// console.log(model);
		});

		// Temp-Cube
		const geometry = new THREE.BoxGeometry();
		const material = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
		const cube = new THREE.Mesh(geometry, material);
		cube.position.set(-4, 2, 5);
		this.scene.add(cube);

		// Controls
		this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
		this.orbitControls.update();
		this.orbitControls.maxPolarAngle = Math.PI * 0.40;
		//  this.pointerlockControls = new PointerLockControls(
		// this.camera,
		//this.renderer.domElement
		// );

		const animate = () => {
			const delta = this.clock.getDelta();
			requestAnimationFrame(animate);

			for (const [_, mixer] of Object.entries(this.mixers)) {
				mixer.update(delta);
			}

			// const intersects = this.raycaster.intersectObjects(
			//   this.scene.children,
			//   true
			// );

			// if (intersects.length > 0) {
			//   intersects[0].object.material.color.set(0xff0000);
			//   // console.log(intersects[0].object);
			// }

			//zoomin


			this.renderer.render(this.scene, this.camera);
		};
		animate();

		const checkParentName = (obj, name) => {
			let tmp = obj;
			let flag = false;
			while (1) {
				if (tmp.name === name) {
					flag = true;
					break;
				}
				tmp = tmp.parent;
				if (tmp === null) break;
			}

			return [flag, tmp];
		}

		const moveforward = (delta) => {
			this.camera.position.set(
				this.camera.position.x + this.raycaster.ray.direction.x * delta,
				this.camera.position.y + this.raycaster.ray.direction.y * delta,
				this.camera.position.z + this.raycaster.ray.direction.z * delta,
			)
		}

		//popup

		// Create a new DOM element for the popup
		window.addEventListener("click", (event) => {
			//########
			// var popup = document.createElement('div');
			// popup.style.position = 'absolute';
			// popup.style.width = '200px';
			// popup.style.height = '100px';
			// popup.style.backgroundColor = 'white';
			// popup.style.border = '1px solid black';
			// popup.style.padding = '10px';
			// popup.innerText = 'popup';
			//################

			// Get the position of the 3D object in the viewport
			var position = new THREE.Vector3();
			position.setFromMatrixPosition(cube.matrixWorld);
			position.project(this.camera);

			// Convert the position to CSS coordinates
			var widthHalf = 0.5 * this.renderer.getContext().canvas.width;
			var heightHalf = 0.5 * this.renderer.getContext().canvas.height;
			position.x = (position.x * widthHalf) + widthHalf;
			position.y = -(position.y * heightHalf) + heightHalf;

			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
			this.raycaster.setFromCamera(this.mouse, this.camera);

			const intersects = this.raycaster.intersectObjects(this.scene.children);
			if (intersects.length > 0) {
				for (const [key, names] of Object.entries(this.dict)) {
					for (const name of names) {
						const [flag, obj] = checkParentName(intersects[0].object, name);
						if (flag) {
							const pos = new THREE.Vector3();
							obj.getWorldPosition(pos);
							// this.orbitControls.target = new THREE.Vector3(0, 0, 0);

							pos.add(this.camera.position.clone().sub(pos).normalize().multiplyScalar(2));
							// this.clipActions[key].play();
							this.viewObjectFlag = true;
							this.orbitControls.enabled = false;

							gsap.to(this.camera.position, {
								duration: 3, x: pos.x, y: pos.y, z: pos.z, onUpdate: () => {
									// this.orbitControls.target.copy(this.camera.position)
									// this.orbitControls.update();
									// this.camera.lookAt(tmp)
								}, onComplete: () => {
									// this.orbitControls.target.copy(pos);
									this.clipActions[key].play();
									this.orbitControls.enabled = true;
									this.orbitControls.update();
									this.viewObjectFlag = false;
								}
							});
							
							this.orbitControls.target.add(pos.clone().sub(this.camera.position));
							// console.log(this.orbitControls.object)
							// this.orbitControls.object.rotateOnAxis(new THREE.Vector3(0, 1, 0),Math.PI / 6)

							// console.log(key)
						}
					}
				}
			}

			// Set the position of the popup
			//#############
			// popup.style.left = position.x + 'px';
			// popup.style.top = position.y + 'px';
			//###################

			//#############
			// let closeButton = popup.document.createElement("button");
			// closeButton.innerHTML = "Close Popup";
			// closeButton.addEventListener("click", function () {
			//   popup.close();
			// });
			//##################

			// Add the popup to the document body
			// document.body.appendChild(popup);
			// document.body.appendChild(closeButton);//##
		})

		window.addEventListener("resize", () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
			this.camera.updateProjectionMatrix();
			this.renderer.setSize(canvas.width, canvas.height);
		});

		//canvas.addEventListener("click", () => {
		//  this.pointerlockControls.lock();
		// });

		canvas.addEventListener("wheel", (event) => {
			// Get the camera's position as a vector
			const cameraPosition = new THREE.Vector3();
			this.camera.getWorldPosition(cameraPosition);

			// Get the bounding box of the object
			const boundingBox = new THREE.Box3().setFromObject(this.boundingObj);

			// Check if the camera position is inside the bounding box
			if (boundingBox.containsPoint(cameraPosition) && !this.viewObjectFlag) {
				// Collision detected between the camera and the object
				this.camera.getWorldPosition(this.previousCameraPos);
				this.orbitControls.enabled = true;
				const delta = - event.deltaY * 0.001; // forward: -100, backward: +100
				// console.log(this.camera.position);
				// this.camera.position.add(this.raycaster.ray.direction.clone());
				moveforward(delta);

				// console.log(delta);
			} else {
				this.orbitControls.enabled = false;
				// console.log(this.previousCameraPos);
				gsap.to(this.camera.position, {
					duration: 0, x: this.previousCameraPos.x, y: this.previousCameraPos.y, z: this.previousCameraPos.z, onComplete: () => {
						this.orbitControls.enabled = true;
					}
				});
				
				this.orbitControls.target.add(this.previousCameraPos.clone().sub(this.camera.position));
			}
		});

		canvas.addEventListener("mousemove", (event) => {
			// Get the camera's position as a vector
			const cameraPosition = new THREE.Vector3();
			this.camera.getWorldPosition(cameraPosition);

			// Get the bounding box of the object
			const boundingBox = new THREE.Box3().setFromObject(this.boundingObj);

			// Check if the camera position is inside the bounding box
			if (boundingBox.containsPoint(cameraPosition) && !this.viewObjectFlag) {
				// Collision detected between the camera and the object
				this.camera.getWorldPosition(this.previousCameraPos);
				this.orbitControls.enabled = true;
				// console.log(this.raycaster.ray.direction);
				this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
				this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
				this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);

				// const intersects = this.raycaster.intersectObjects(this.scene.children);
				// if (intersects.length > 0) {
				// 	console.log(intersects);
				// }

			} else {
				this.orbitControls.enabled = false;
				// console.log(this.previousCameraPos);
				this.orbitControls.enabled = false;
				gsap.to(this.camera.position, {
					duration: 0, x: this.previousCameraPos.x, y: this.previousCameraPos.y, z: this.previousCameraPos.z, onComplete: () => {
						this.orbitControls.enabled = true;
					}
				});
				
				this.orbitControls.target.add(this.previousCameraPos.clone().sub(this.camera.position));
			}
			// this.mouse.set(0, 0);
			// console.log(this.mouse);
		});

	}

	render() {
		return <div ref={this.canvasRef} />;
	}
}

export default ThreeScene;
