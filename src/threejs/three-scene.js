import React, { Component, } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//import { click } from "@testing-library/user-event/dist/click";
class ThreeScene extends Component {
  canvasRef = React.createRef();
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 0, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  loader = new GLTFLoader();
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  componentDidMount() {
    // Canvas
    const canvas = this.canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Camera
    this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
    this.camera.position.set(0, 3, 1);
    this.camera.updateProjectionMatrix();

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
      requestAnimationFrame(animate);
      this.raycaster.setFromCamera(this.mouse, this.camera);

      // const intersects = this.raycaster.intersectObjects(
      //   this.scene.children,
      //   true
      // );

      // if (intersects.length > 0) {
      //   intersects[0].object.material.color.set(0xff0000);
      //   // console.log(intersects[0].object);
      // }

      //zoomin




      //popup

      // Create a new DOM element for the popup
      window.addEventListener("click", () => {
        var popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.width = '200px';
        popup.style.height = '100px';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '10px';
        popup.innerText = 'popup';

        // Get the position of the 3D object in the viewport
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(cube.matrixWorld);
        position.project(this.camera);

        // Convert the position to CSS coordinates
        var widthHalf = 0.5 * this.renderer.getContext().canvas.width;
        var heightHalf = 0.5 * this.renderer.getContext().canvas.height;
        position.x = (position.x * widthHalf) + widthHalf;
        position.y = -(position.y * heightHalf) + heightHalf;

        // Set the position of the popup
        popup.style.left = position.x + 'px';
        popup.style.top = position.y + 'px';

        let closeButton = popup.document.createElement("button");
        closeButton.innerHTML = "Close Popup";
        closeButton.addEventListener("click", function () {
          popup.close();
        });

          // Add the popup to the document body
          document.body.appendChild(popup);
          document.body.appendChild(closeButton);
        })


        this.renderer.render(this.scene, this.camera);
      };
      animate();

      const moveforward = (delta) => {
        this.camera.position.set(
          this.camera.position.x + this.raycaster.ray.direction.x * delta,
          this.camera.position.y + this.raycaster.ray.direction.y * delta,
          this.camera.position.z + this.raycaster.ray.direction.z * delta,
        )
      }

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
        const delta = - event.deltaY * 0.001; // forward: -100, backward: +100
        // console.log(this.camera.position);
        // this.camera.position.add(this.raycaster.ray.direction.clone());
        moveforward(delta);

        // console.log(delta);
      });

      canvas.addEventListener("mousemove", (event) => {
        // console.log(this.raycaster.ray.direction);
        // this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        // this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // this.mouse.set(0, 0);
        // console.log(this.mouse);
      });
    }

    render() {
      return <div ref={this.canvasRef} />;
    }
  }

export default ThreeScene;
