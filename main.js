var cubeRotation = 0.0;
var time = 0;
var headd,bodyy,legL,legR;
var c1,flag=0,upVelocity = 1.0,flagCoin = 0,flagSlide = 0,timeSlide = 0;
var coin,hazard,speedBreaker,bootup,bootdown;
var wallL = new Array();
var wallR = new Array();
var cont = new Array();
var track1 = new Array();
var track2 = new Array();
var track3 = new Array();
var playerX=0.0,playerY=0.0,playerZ=-10.0;
var textureCube,textureWall,textureTrack,textureContainer,textureCoin,textureHazard,textureBreaker,textureHead,textureBootsup,textureBootsdown;
var i=0;
var aboveTrain = 0;
var programInfo;
main();

//
// Start here
//


function main() {


  const canvas = document.querySelector('#glcanvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  textureBody = loadTexture(gl, 'body.jpg');
  textureWall = loadTexture(gl, 'wall1.jpeg');
  textureTrack = loadTexture(gl, 'tr.png');
  textureContainer = loadTexture(gl, 'container.png');
  textureCoin = loadTexture(gl, 'coin.png');
  textureHazard = loadTexture(gl, 'hazad.png');
  textureBreaker = loadTexture(gl, 'breaker.jpeg');
  textureHead = loadTexture(gl, 'head.jpeg');
  textureBootsup = loadTexture(gl, 'bootsup.png');
  textureBootsdown = loadTexture(gl, 'bootsdown.jpeg');

  bodyy = new body(gl, [playerX, playerY, playerZ]);
  headd = new head(gl, [playerX, playerY+1.0, playerZ]);
  bootup = new bootsup(gl, [0.0, 1.0, -20 + 0.8])
  bootdown = new bootsdown(gl, [0.0, 0.4, -20.0 ])
  speedBreaker = new breaker(gl, [0.0, 0.0, -40.0]);
  for(i=0;i<50;i++)
  {
    var a = Math.floor(Math.random() * 101);
    if(a%2 == 0)
    {
      cont.push( new container(gl, [14/3,1.2,-i*50.0]));
    }
    else if(a%3 == 0)
    {
      cont.push( new container(gl, [0.0,1.2,-i*70.0]));
    }
    else
    {
      cont.push( new container(gl, [-14/3,1.2,-i*80.0]));
    }
  }
  for(i=0;i<100;i++)
  {
    wallL.push(new wall(gl,[7.0,0.0,-i*50]));
    wallR.push(new wall(gl,[-7.0,0.0,-i*50]));
  }
  for(i=0;i<100;i++)
  {
    track1.push(new track(gl,[0.0,0.0,-i*50]));
    track2.push(new track(gl,[14/3,0.0,-i*50]));
    track3.push(new track(gl,[-14/3,0.0,-i*50]));
  }
  coin = new coins(gl, [0.0,1.2,-30.0]);
  hazard = new hazardboards(gl, [14/3,2.2,-50.0]);
  
  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }
  
  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uNormalMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;

  // Fragment shader program

  const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;

  const fsSource1 = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);
      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
      precision highp float;
      vec4 color = texture2D(uSampler, vTextureCoord);
      float gray = dot(color.rgb,vec3(0.299,0.587,0.114));
      gl_FragColor = vec4(vec3(gray),1.0);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  // if(flagGray = 0)
  // {
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const shaderProgram1 = initShaderProgram(gl, vsSource, fsSource1);
  // }


  // Collect all the info needed to use the shader program.
  // Look up which attributes our shader program is using
  // for aVertexPosition, aVevrtexColor and also
  // look up uniform locations.
   programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
      textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
      uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.

  var then = 0;

  // Draw the scene repeatedly
  
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;
    drawScene(gl, programInfo, deltaTime);
    var x = bodyy.pos[0];
    var y = bodyy.pos[1];
    var z = bodyy.pos[2];

///////////////////////////////////////////////////////////////////////////////////////////////

    //convert into loop later for multiple coins
    if(Math.sqrt((coin.pos[0]-x)*(coin.pos[0]-x) + (coin.pos[1]-y)*(coin.pos[1]-y) + (coin.pos[2]-z)*(coin.pos[2]-z))<= 1.21)
    {
      coin.pos[2] -= 50.0;
    }
///////////////////////////////////////////////////////////////////////////////////////////////

    for(i=0; i<50 ; i++)
    {
      var x1 = cont[i].pos[0];
      var y1 = cont[i].pos[1];
      var z1 = cont[i].pos[2];

      if(x - x1 <= 1.2 && x - x1 >= -1.2 && z - z1 <= 4.0 && z - z1 >= -4.0 && y - y1 <= 2.0 && y - y1 >= 1.5)
      {
        aboveTrain = 1;
        break;
      }
      else if(x - x1 <= 1.2 && x - x1 >= -1.2 && z - z1 <= 4.0 && z - z1 >= -4.0 && y - y1 <= 1.5)
      {
        alert("GAME OVER");
        // break;
      }
      else
      {
        aboveTrain = 0;
      }
    }

///////////////////////////////////////////////////////////////////////////////////////////////

    //later convert into loops for multiple hazard boards
    var x1 = hazard.pos[0];
    var y1 = hazard.pos[1];
    var z1 = hazard.pos[2];
    if(x1 - x <= 0.6 && x1 - x >= -0.6 && z1 - z >= -0.2 && z1 - z <= 0.2 && y1 - y <= 2.2 && y1 - y >= -1.2)
    {
      alert("game over");
    }



///////////////////////////////////////////////////////////////////////////////////////////////
   


    //convert into loop later for multiple speedbreakers
    if(speedBreaker.pos[0] == x && speedBreaker.pos[1] == y)
    {
      if( z-speedBreaker.pos[2] <= 0.2 && z-speedBreaker.pos[2] >= -0.2)
      {
        if(time == 1)
        {
         alert("GAME OVER");
        }
        time = 1;
      }
    }
    if(time > 0)
    {
      bodyy.pos[2]-= 0.1;
      headd.pos[2]-= 0.1;
      time++;
      if(time >=120)
      {
        time = 0;
      }  
    }
    else
    {
      bodyy.pos[2]-= 0.3;
      headd.pos[2]-= 0.3;
    }

////////////////////////////////////////////////////////////////////////////////////////////////


    Mousetrap.bind('down', function() { 
      if(flagSlide == 0) 
      {
        flagSlide = 1;
        bodyy.pos[1] -= 0.3;
        headd.pos[1] -= 0.3;
      }
    });
    if(flagSlide)
    {
      timeSlide++;
      if(timeSlide >= 30)
      {
        flagSlide = 0;
        timeSlide = 0;
        bodyy.pos[1] += 0.3;
        headd.pos[1] += 0.3;
      }
    }
    Mousetrap.bind('right', function() { 
      if(bodyy.pos[0]<14/3)
      {
        bodyy.pos[0] += 14/3;
        headd.pos[0] += 14/3;
      }
    });
    Mousetrap.bind('left', function() { 
      if(bodyy.pos[0]>-14/3)
      {
        bodyy.pos[0] -= 14/3;
        headd.pos[0] -= 14/3;
      }
    });
    
    Mousetrap.bind('up', function() { 
      if(flag == 0) 
      {
        flag = 1;
      }
    });
    if(flag == 1 && aboveTrain == 0)
    {
      bodyy.pos[1]+=upVelocity;
      headd.pos[1]+=upVelocity;
      upVelocity -= 0.1;
      if(bodyy.pos[1] <= 0.0)
      {
        bodyy.pos[1]=0;
        headd.pos[1]=1.0;
        flag = 0;
        upVelocity = 1.0;
      }
    }
    Mousetrap.bind('g', function() { 
      programInfo = {
        program: shaderProgram1,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram1, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderProgram1, 'aVertexNormal'),
          textureCoord: gl.getAttribLocation(shaderProgram1, 'aTextureCoord'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram1, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram1, 'uModelViewMatrix'),
          normalMatrix: gl.getUniformLocation(shaderProgram1, 'uNormalMatrix'),
          uSampler: gl.getUniformLocation(shaderProgram1, 'uSampler'),
        },
      };
    });

    Mousetrap.bind('c', function() { 
      programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
          textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
          normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
          uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
        },
      };
    });
 ///////////////////////////////////////////////////////////////////////////////////////////////



    requestAnimationFrame(render);

  }
  requestAnimationFrame(render);
}

//
// Draw the scene.
//
function drawScene(gl, programInfo, deltaTime) {
  gl.clearColor(135.0/256.0, 206.0/256.0, 250.0/256.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
    var cameraMatrix = mat4.create();
    mat4.translate(cameraMatrix, cameraMatrix, [0.0, 3.0, bodyy.pos[2]+10.0]);
    var cameraPosition = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    var up = [0, 1, 0];

    mat4.lookAt(cameraMatrix, cameraPosition, [0.0,1.0,bodyy.pos[2]], up);

    var viewMatrix = cameraMatrix;//mat4.create();

    //mat4.invert(viewMatrix, cameraMatrix);

    var viewProjectionMatrix = mat4.create();
    
    mat4.multiply(viewProjectionMatrix, projectionMatrix, viewMatrix);
    for(i=0;i<100;i++)
    {
      track1[i].drawTrack(gl, viewProjectionMatrix, programInfo, deltaTime);
      track2[i].drawTrack(gl, viewProjectionMatrix, programInfo, deltaTime);
      track3[i].drawTrack(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    speedBreaker.drawBreaker(gl, viewProjectionMatrix, programInfo, deltaTime);    
    bodyy.drawBody(gl, viewProjectionMatrix, programInfo, deltaTime);
    headd.drawHead(gl, viewProjectionMatrix, programInfo, deltaTime);
    hazard.drawHazardboards(gl, viewProjectionMatrix, programInfo, deltaTime);
    if(flagCoin == 0)
    {
      coin.drawCoins(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i=0;i<100;i++)
    {
      wallL[i].drawWall(gl, viewProjectionMatrix, programInfo, deltaTime);
      wallR[i].drawWall(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    for(i=0;i<50;i++)
    {
      cont[i].drawContainer(gl, viewProjectionMatrix, programInfo, deltaTime);
    }
    bootup.drawBootsup(gl, viewProjectionMatrix, programInfo, deltaTime);
    bootdown.drawBootsdown(gl, viewProjectionMatrix, programInfo, deltaTime);
}

//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

//
// Initialize a texture and load an image.
// When the image finished loading copy it into the texture.
//
function loadTexture(gl, url) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn off mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

function isPowerOf2(value) {
  return (value & (value - 1)) == 0;
}
