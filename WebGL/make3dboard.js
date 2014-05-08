$( document ).ready(function() {
  $("svg").ready(function(){
    console.log('getting board id')
    var idDiv = $('.boardinfo');
    boardID = idDiv.attr("boardid")
    var turnDiv = $('.loginfo')
    tlogID = turnDiv.attr("logId")
  })

  $( '#render' ).on("click", function(){
    var board3d = [];
    var hex_data;

    var grabBoard = $.getJSON( '/turn_logs/' + tlogID, function(data){
      console.log(data)
      data.forEach(function(datum){
        board3d.push(datum['terrain'])
      })
    var tiles=[];
    board = data;
      $.each(data, function(k, v){
        tiles.push(v.coordinates);
      });
      var formatted_tiles = format_coords(tiles)
      hex_data = formatted_tiles.map(function(tile){
        return genHexData(genHexVertices(25), hexToCartesian(tile, 25));
      });
    });

  grabBoard.complete(function(){

    function randomIntFromInterval(min,max)
    {
      return Math.floor(Math.random()*(max-min+1)+min);
    }

    var snowSystems = []
    var lavaSystems = []
    // var stats = new Stats();
    // stats.setMode(1); // 0: fps, 1: ms

    // // Align top-left
    // stats.domElement.style.position = 'absolute';
    // stats.domElement.style.left = '0px';
    // stats.domElement.style.top = '0px';

  // document.body.appendChild( stats.domElement );
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / 2 / window.innerHeight , 0.1, 1000 );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth / 2, window.innerHeight );
    document.body.appendChild( renderer.domElement );

      function makeHex(vertices, radius, terrain){
        var side1 = new THREE.Geometry();
        var side2 = new THREE.Geometry();
        
        //cache materials instead of making them every time
        if(terrain == 'ocean'){
          var material = new THREE.MeshLambertMaterial( { color: '#0000ff' } );
          z = 0
        }
        else if(terrain == 'grassland'){
          var material = new THREE.MeshLambertMaterial( { color: '#99FF33' } );
          z = 10
        }
        else if(terrain == 'desert'){
          var material = new THREE.MeshLambertMaterial( { color: '#DBB84D' } );
          z = 12
        }
        else if(terrain == 'tundra'){
          var material = new THREE.MeshLambertMaterial( { color: '#B8E6E6' } );
          z = 10
        }
        else if(terrain == 'forest'){
          var material = new THREE.MeshLambertMaterial( { color: '#006600' } );
          z = 10
        }
        else if(terrain == 'mountain'){
          var material = new THREE.MeshLambertMaterial( { color: '#999999' } );
          z = 12
        }
        else if(terrain = 'volcanic'){
          var material = new THREE.MeshLambertMaterial( { color: '#390E00' } );
          z = 12
        }

        vertices.forEach(function(vert){
          point = new THREE.Vector3(vert.x, vert.y, z);
          point2 = new THREE.Vector3(vert.x, vert.y, 0 - 20);
          side1.vertices.push( point );
          side2.vertices.push( point2);
        });



        material.side = THREE.DoubleSide;

        var i = 1;
        vertices.forEach(function(vert){
          side1.faces.push( new THREE.Face3(0, i, i+1))
          side2.faces.push( new THREE.Face3(0, i, i+1))
          if(i == 5){
            i = 1;
          }
          else{
          i++
          }
        })

        if(terrain == 'mountain'){
          side1.vertices.push( new THREE.Vector3((side1.vertices[0].x + side1.vertices[3].x)/2, side1.vertices[0].y, randomIntFromInterval(35,55)) )
          for(i=1; i < 7;i++){
            side1.faces.push( new THREE.Face3(i,i+1,7))
          }
          side1.faces.push( new THREE.Face3(6,1,7))
        }

        THREE.GeometryUtils.merge(side1, side2)

        facesToCreate1 = [[1,2,8],[2,3,9],[3,4,10],[4,5,11],[5,6,12],[6,1,13]]
        facesToCreate2 = [[8,13,1],[13,12,6],[12,11,5],[11,10,4],[10,9,3],[9,8,2]]

        for(i=0;i<6;i++){
          side1.faces.push( new THREE.Face3(facesToCreate1[i][0],facesToCreate1[i][1],facesToCreate1[i][2]))
          side1.faces.push( new THREE.Face3(facesToCreate2[i][0],facesToCreate2[i][1],facesToCreate2[i][2]))
        }

        // if(terrain == 'desert'){
        //   randomLocations = []
        //   var dunes = []
        //   for(i=0;i<2;i++){
        //     dune = new THREE.CylinderGeometry( 2, 3, 20, 3 );
        //     dune.applyMatrix(new THREE.Matrix4().makeRotationZ(randomIntFromInterval(0,1.57)))
        //     dune.applyMatrix(new THREE.Matrix4().makeTranslation(randomIntFromInterval(side1.vertices[1].x, side1.vertices[4].x) ,randomIntFromInterval(side1.vertices[1].y, side1.vertices[5].y - 2), side1.vertices[0].z))
        //     THREE.GeometryUtils.merge(side1, dune)
        //   }
        // }

        if(terrain == 'forest'){
          trunks = []
          treeTops = []
          randomLocations = []
          for(i=0;i<12;i++){
            trunk = new THREE.CylinderGeometry(1,1,10,10,10,false)
            trunk.applyMatrix(new THREE.Matrix4().makeRotationX(1.57))
            randomLocations.push([randomIntFromInterval(side1.vertices[1].x, side1.vertices[4].x), randomIntFromInterval(side1.vertices[1].y, side1.vertices[5].y)])
            trunk.applyMatrix(new THREE.Matrix4().makeTranslation(randomLocations[i][0], randomLocations[i][1], side1.vertices[0].z + 2))
            trunks.push(trunk)
          }

          for(i=0; i<12; i++){
            hold = new THREE.CylinderGeometry(0,3,7,7,7,false)
            hold.applyMatrix(new THREE.Matrix4().makeRotationX(1.57))
            hold.applyMatrix(new THREE.Matrix4().makeTranslation(randomLocations[i][0], randomLocations[i][1], side1.vertices[0].z + 6.1))//(side1.vertices[0].x + side1.vertices[3].x)/2, side1.vertices[0].y, side1.vertices[0].z + 10)
            treeTops.push(hold)
          }


          trunks.forEach(function(trunk){
            THREE.GeometryUtils.merge(side1, trunk)
          })
          treeTops.forEach(function(top){
            THREE.GeometryUtils.merge(side1, top)
          })
        }

        if (terrain == 'tundra'){
          var particleCount = 30,
          particles = new THREE.Geometry(),
          pMaterial = new THREE.ParticleBasicMaterial({
            color: 0xffffff,
            size: 2
          });

      // now create the individual particles
      for (var p = 0; p < particleCount; p++) {
        
        var pX = randomIntFromInterval(side1.vertices[0].x, side1.vertices[3].x),
            pY = randomIntFromInterval(side1.vertices[1].y, side1.vertices[5].y),
            pZ = randomIntFromInterval(50, 75),
            particle = new THREE.Vector4(pX, pY, pZ, 0)

            particle.velocity = new THREE.Vector3(
              0,              
              0, 
              -Math.random()); 
            particle.position = new THREE.Matrix4()

        // add it to the geometry
        particles.vertices.push(particle);
      }

      // create the particle system
      var particleSystem = new THREE.ParticleSystem(
          particles,
          pMaterial);

        particleSystem.particles = particles;

        particleSystem.name = 'particleSys'
        particleSystem.sortParticles = true;

        snowSystems.push( particleSystem )

        scene.add( particleSystem )
        }

        if(terrain == 'volcanic'){
          var mp = new THREE.Vector3((side1.vertices[0].x + side1.vertices[3].x)/2,(side1.vertices[1].y + side1.vertices[5].y)/2)
          var cyl = new THREE.CylinderGeometry(6, 22, 20, 10, 10, false)
          cyl.applyMatrix(new THREE.Matrix4().makeRotationX(1.57))
          cyl.applyMatrix(new THREE.Matrix4().makeTranslation((side1.vertices[0].x + side1.vertices[3].x)/2, side1.vertices[0].y, 20))
          THREE.GeometryUtils.merge(side1, cyl)

          var particleCount = 180,
          particles = new THREE.Geometry(),
          pMaterial = new THREE.ParticleBasicMaterial({
            color: 0x808080,
            size: 1
          });

      // now create the individual particles
      for (var p = 0; p < particleCount; p++) {
        
        var pX = mp.x,
            pY = mp.y,
            pZ = 10,
            particle = new THREE.Vector4(pX, pY, pZ, 0)
            particle.initX = mp.x
            particle.initY = mp.y


        // add it to the geometry
        particles.vertices.push(particle);
      }

      // create the particle system
      var particleSystem = new THREE.ParticleSystem(
          particles,
          pMaterial);

        particleSystem.particles = particles;

        particleSystem.name = 'particleSys'
        particleSystem.sortParticles = true;

        lavaSystems.push( particleSystem )

        scene.add( particleSystem )
        }

        side1.computeCentroids();
        side1.computeFaceNormals();
        side1.computeVertexNormals();

        var hex1 = new THREE.Mesh( side1, material );
        if(terrain == 'ocean'){
          hex1.ocean_delta = 5
        }
        if(terrain == 'tundra'){
          hex1.tundra_delta = 5
        }

        return hex1;
      }
    var boardHexes = []
    function makeBoard(hex_data){
      k = 0
      hex_data.forEach(function(hex_object){
        boardHexes.push(makeHex(hex_object, 0, board3d[k]))
        k++;
      })
      return boardHexes
    }

    var y = 0
    function makeSomeWaves(){
      boardHexes.forEach(function(hex){
        var deltaZ = 2
        if(hex.ocean_delta && y % 40 == 0){
          if(hex.position.z > 5 || hex.position.z < -5 ){
            deltaZ = -deltaZ
          }
          hex.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0, randomIntFromInterval(deltaZ, 0)))
        }
      })
      y++
    }

    
    makeBoard(hex_data);

    boardHexes.forEach(function(hex){
      hex.side = THREE.DoubleSide;
      scene.add( hex );
    })

    var pointLight = new THREE.PointLight(0xffffff, 1.5);
    scene.add( pointLight )

    controls = new THREE.OrbitControls(camera);

    pointLight.position.z = 750
    camera.position.z = 750;


    g = 0
    function makeItSnow(){
      snowSystems.forEach(function(object){
        if(g % 100){
          object.particles.vertices.forEach(function(vert){

          if(vert.z < -15){
            vert.z = 55
          }
          else{
            vert.z -= randomIntFromInterval(0, .5)
          }
          })
        }
      })
      g++
    }

    l = 0

    function makeItLava(){
      i = 0
      lavaSystems.forEach(function(object){
        if(l % 6 == 0){
        object.particles.vertices.forEach(function(vert){
            if(vert.z > randomIntFromInterval(45,100)){
              vert.z = 30
              vert.x = vert.initX
              vert.y = vert.initY
            }
            else{
                if(randomIntFromInterval(-1,1) > 0){
                  vert.z += randomIntFromInterval(0, 1.5)
                  vert.x += randomIntFromInterval(0, .15)
                  vert.y += randomIntFromInterval(0, .15)
                }
                else{
                  vert.z += randomIntFromInterval(0, 1.5)
                  vert.x -= randomIntFromInterval(0, 1)
                  vert.y -= randomIntFromInterval(0, .15)
                }
            }
          })
        }
        i++
        })
      l++
    }
    console.log(lavaSystems)
          // object.geometry.vertices.forEach(function(particle){
          //   if (particle.position.z < 0) {
          //     particle.position.z = 200;
          //     particle.velocity.z = 0;
          //   }

          //   // update the velocity with
          //   // a splat of randomniz
          //   particle.velocity.z -= Math.random() * .1;

          //   // and the position
          //   particle.position += particle.velocity;

          // // flag to the particle system
          // // that we've changed its vertices.
          // object.geometry.__dirtyVertices = true;


    function render() {
      //stats.begin();
      controls.update();
      makeSomeWaves();
      makeItSnow();
      makeItLava();
      requestAnimationFrame(render);
      renderer.render(scene, camera);
      //stats.end();
    }
    render();
    })
  })
})
