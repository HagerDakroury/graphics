
import { Water } from '../js/Water.js';
import { BooleanKeyframeTrack } from './three.module.js';

var nightSkyBox;
var rainCount=5000;
var night=0;
var bolt;
var bolt2,bolt3,bolt4,bolt5;
var bolt1Timer=0;
var flash;
var scene,renderer,camera,light;
var water, cubeGeometry,skyBox;
var rainGeo,rainMaterial,rain;
var boat;



var loadWater=function(){
    var waterGeometry = new THREE.PlaneBufferGeometry( 10000, 10000 );

     water = new Water(
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
}

var loadDay=function(){
    //skybox (3d background simulation) 
//day view

 cubeGeometry = new THREE.CubeGeometry(window.innerWidth,window.innerHeight,1000);
var cubeMaterial = [
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/day_px.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/day_nx.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/day_py.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/day_ny.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/day_pz.jpg"),side: THREE.DoubleSide}),
  new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/day_nz.jpg"),side: THREE.DoubleSide})
];
 skyBox = new THREE.Mesh(cubeGeometry , cubeMaterial);
scene.add(skyBox);

}

var loadNight=function(){
    //night view
var nightCubeMaterial = [
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/night_ft.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/night_bk.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/night_up.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/night_dn.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/night_rt.png"),side: THREE.DoubleSide}),
    new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/night_lf.png"),side: THREE.DoubleSide})
];
 nightSkyBox = new THREE.Mesh(cubeGeometry , nightCubeMaterial);

}

var loadBoat=function(){
    
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
        boat=mesh;
        mesh.scale.set(0.1,0.1,0.1);
        mesh.position.set( -20 , -10 , 10);
        scene.add(mesh);
        //requestAnimationFrame(moveboat.bind(moveboat,mesh));
        
    })
});

}

var loadIsland=function(){
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

}

var loadControls=function(){
//controls
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.userPan = false;
controls.userPanSpeed = 0.0;
controls.maxDistance = 5000.0;
controls.maxPolarAngle = Math.PI * 0.495;

}

var loadRain=function(){
    
//modeling rain
//creating one object with lots of vertices, each vertex represents a rain drop
    
 rainGeo = new THREE.Geometry();
for(let i=0;i<rainCount;i++) {
  var rainDrop = new THREE.Vector3(
    Math.random() * 400 -200,
    Math.random() * 500 - 250,
    Math.random() * 400 - 200
  );
  //increase the velocity 
  rainDrop.velocity = {};
  rainDrop.velocity = 0;
  rainGeo.vertices.push(rainDrop);
}

 rainMaterial = new THREE.PointsMaterial({
  color: 0xaaaaaa,
  size: 0.1,
  transparent: true
});
 rain = new THREE.Points(rainGeo,rainMaterial);


}

var loadBolts=function(){
    
    //Lightining bolt
    var planeGeometry = new THREE.PlaneGeometry( 190, 190);
    var planeMaterial = [
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/lightBolt.png"),side: THREE.DoubleSide,alphaTest: 0.4}),
      new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("./textures/lightBolt.png"),side: THREE.DoubleSide,alphaTest: 0.4})
    ];
    bolt = new THREE.Mesh(planeGeometry , planeMaterial);
    bolt.position.set(-150,90,-350);
    bolt2 = bolt.clone();
    bolt3 = bolt.clone();
    bolt4 = bolt.clone();
    bolt5 = bolt.clone();
    bolt2.position.x = 180;
    bolt3.position.x = 200;
    bolt3.position.z = 100;
    bolt4.position.z = -200;
    bolt5.position.x=-100;
    bolt5.position.y=250;
    bolt5.position.z=-50;
  
  
  
}
  
var loadFlash=function(){
      flash = new THREE.PointLight(0x062d89, 30, 500 ,1.7);
      flash.position.set(200,300,100);
      
}
      
  
//random boat movement

var updateBoat=function(){
    boat.position.x-=0.02;
    boat.rotation.y+=0.001;

}



//resizing
window.addEventListener('resize',function(){
var w=window.innerWidth;
var h=window.innerHeight;
renderer.setSize(w,h);
camera.aspect=w/h;
camera.updateProjectionMatrix();
});

window.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        night=1;
        scene.fog = new THREE.Fog(0x6f6767, 3,1000);
        scene.remove(skyBox);
        cubeGeometry.dispose();
        scene.add(nightSkyBox);
        scene.add(rain);
        scene.add(flash);
        scene.add(bolt);
        scene.add(bolt2);
       /* scene.add(bolt3);
        scene.add(bolt4);
        scene.add(bolt5);*/


    }
});
//changing scenes



function updateRain() {
   
//increase the velocity to simulate the gravity effect
rainGeo.vertices.forEach(p => {
  p.velocity -= 0.1 + Math.random() * 0.1;
  p.y += p.velocity;
  //if outside screen, bring it back to the top
  if (p.y < -200) {
    p.y = 200;
    p.velocity = 0;
  }
});

rainGeo.verticesNeedUpdate = true;
//rotate the rain drops
rain.rotation.y +=0.002;
}

var updateBolts= function (){
    bolt1Timer=bolt1Timer+1;

    if (bolt1Timer==50){
        scene.remove(bolt);
        scene.remove(bolt2);
    }

    if (bolt1Timer==60){
        bolt3.position.x=Math.random();
        bolt3.position.y=Math.random();
        

        scene.add(bolt3);
        scene.add(bolt4);
        scene.add(bolt5)
    }

    if (bolt1Timer==70){
        scene.remove(bolt3);
        scene.remove(bolt4);
        scene.remove(bolt5);
        scene.add(bolt);
        scene.add(bolt2);

        bolt1Timer=0;

    }



   /* if (bolt1Timer==30){
        scene.remove(bolt);
        scene.remove(bolt2);
        scene.remove(bolt3);
    }
    if (bolt1Timer==10){
        scene.remove(bolt3);
        scene.remove(bolt4); 
    }

    if(bolt1Timer==50){
        scene.remove(bolt5);
        scene.remove(bolt4);
    }

    if(bolt1Timer=60){
        scene.remove(bolt5);
        bolt1Timer=0;
    }*/

};



//randomly change the flash's position and intensity 
var updateFlash=function(){
    if(Math.random() > 0.93 || flash.power > 100) {
        if(flash.power < 100) 
          flash.position.set(
            Math.random()*400,
            300 + Math.random() *200,
            100
          );
        flash.power = 50 + Math.random() * 500;
      }


}


//game logic
var update=function(){
    updateBoat();
    if(night){
        updateRain();
        updateBolts();
        updateFlash();

    }
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

var init= function(){
    scene=new THREE.Scene( );
   
   //renderer initialization
    renderer = new THREE.WebGLRenderer();
   renderer.setPixelRatio( window.devicePixelRatio );
   renderer.setSize( window.innerWidth, window.innerHeight );
   document.body.appendChild( renderer.domElement );
   
   //camera
    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 10000 );
   camera.position.set( 30, 30, 100 );
   
   //lighting
   
    light = new THREE.DirectionalLight(0xffffff,.8);
   scene.add( light );
   }
   
var load=function(){
       //water
       loadControls();
       loadWater();
       loadDay();
       loadIsland();
       loadBoat();
   
       loadNight();
       loadRain();
       loadBolts();
       loadFlash();
   }

   
init();
load();
GameLoop();
