
import { Water } from '../js/Water.js';
import { Sky } from '../jS/Sky.js';

var boatModel;
var scene=new THREE.Scene( );

//renderer initialization
var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//camera
var camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 10000 );
camera.position.set( 30, 30, 100 );

//lighting
renderer.shadowMap.enabled = true;

var light = new THREE.DirectionalLight(0xffffff,.8);
scene.add( light );

//water
var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

var water = new Water(
    waterGeometry,
    {
        textureWidth: 1530,
        textureHeight: 1000,
        waterNormals: new THREE.TextureLoader().load( './textures/waternormals.jpg', function ( texture ) {

            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        } ),
        alpha: 1.0,
        sunDirection: light.position.clone().normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);

water.rotation.x = - Math.PI / 2;
scene.add( water );

//skybox (3d background simulation)

var cubeGeometry = new THREE.CubeGeometry(window.innerWidth,window.innerHeight,1000);
var cubeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/px.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/nx.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/py.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/ny.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/pz.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/nz.jpg"),side: THREE.DoubleSide})
];
var skyBox = new THREE.Mesh(cubeGeometry , cubeMaterial);
scene.add(skyBox);



//loading the boat 

var boatmtlLoader = new THREE.MTLLoader();
boatmtlLoader.load("./models/boat/Cruiser_2012.mtl" , function(materialss){
    materialss.preload();
    var boatobjloader = new THREE.OBJLoader();
    boatobjloader.setMaterials(materialss);
    boatobjloader.load("./models/boat/Cruiser 2012.obj" , function(mesh){
        mesh.traverse(function(node){
            if(node instanceof THREE.Mesh){
                node.castShadow = true;
                node.receiveShadow = true;
            }
        })
        mesh.scale.set(0.1,0.1,0.1);
        mesh.position.set( -20 , -10 , 10);
        scene.add(mesh);
        requestAnimationFrame(moveboat.bind(moveboat,mesh));
        
    })
});

//random boat movement
function moveboat(object){
    object.position.x -= 0.02;
    object.rotation.y += 0.001;
    
    requestAnimationFrame(moveboat.bind(moveboat,object));
  }


var islandmtlLoader = new THREE.MTLLoader();
islandmtlLoader.load("./models/island/Small_Tropical_Island.mtl" , function(materialss){
    materialss.preload();
    var islandobjloader = new THREE.OBJLoader();
    islandobjloader.setMaterials(materialss);
    islandobjloader.load("./models/island/Small Tropical Island.obj" , function(mesh){
        mesh.traverse(function(node){
            if(node instanceof THREE.Mesh){
                node.castShadow = true;
                node.receiveShadow = true;
            }
        })
        mesh.scale.set(0.1,0.1,0.1);
        mesh.position.set( -10 , -2 , 55);
        scene.add(mesh);        
    })
});


//controls
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 5000.0;
controls.maxPolarAngle = Math.PI * 0.495;



//resizing
window.addEventListener('resize',function(){
var w=window.innerWidth;
var h=window.innerHeight;
renderer.setSize(w,h);
camera.aspect=w/h;
camera.updateProjectionMatrix();
});


//game logic
var update=function(){


    //rotate
    //cube.rotation.x+=0.01;
    //cube.rotation.y+=0.005;


};

//draw scene
var render=function(){
    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    renderer.render(scene,camera);
}
//run game loop update,render,repeat
var GameLoop=function(){

    requestAnimationFrame(GameLoop);
    update();
    render();
}

GameLoop();
