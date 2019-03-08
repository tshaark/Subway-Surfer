/// <reference path="webgl.d.ts" />

let coins = class {
    constructor(gl, pos) {
        this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

        this.positions = [];
        var n=40;
        var r=1.0;
        var M_PI=Math.PI;
        // var g_vertex_buffer_data[9*n+9];
        for ( i = 0; i < n; i++)
        {
            var angle1 = (10*M_PI*i)/180;
            var angle2 = (10*M_PI*(i+1))/180;
            var x1=Math.cos(angle1);
            var y1=Math.sin(angle1);
            var x2=Math.cos(angle2);
            var y2=Math.sin(angle2);
            this.positions.push(r*x1);
            this.positions.push(r*y1);
            this.positions.push(0.1);

            this.positions.push(r*x2);
            this.positions.push(r*y2);
            this.positions.push(0.1);

            this.positions.push(r*x1);
            this.positions.push(r*y1);
            this.positions.push(-0.1);
            
            
            this.positions.push(r*x1);
            this.positions.push(r*y1);
            this.positions.push(-0.1);
            
            this.positions.push(r*x2);
            this.positions.push(r*y2);
            this.positions.push(-0.1);
            
            this.positions.push(r*x2);
            this.positions.push(r*y2);
            this.positions.push(0.1);

           
            this.positions.push(0.0);
            this.positions.push(0.0);
            this.positions.push(-0.1);

            this.positions.push(r*x1);
            this.positions.push(r*y1);
            this.positions.push(-0.1);
            
            this.positions.push(r*x2);
            this.positions.push(r*y2);
            this.positions.push(-0.1);

            
            
            this.positions.push(0.0);
            this.positions.push(0.0);
            this.positions.push(0.1);

            this.positions.push(r*x1);
            this.positions.push(r*y1);
            this.positions.push(0.1);

            this.positions.push(r*x2);
            this.positions.push(r*y2);
            this.positions.push(0.1);           
        } 
        this.rotation = 0;

        this.pos = pos;

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
        
        this.textureCoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        
        this.textureCoordinates = [];
        for(i=0;i<n;i++)
        {
            var angle1 = (10*M_PI*i)/180;
            var angle2 = (10*M_PI*(i+1))/180;
            var x1=Math.cos(angle1);
            var y1=Math.sin(angle1);
            var x2=Math.cos(angle2);
            var y2=Math.sin(angle2);


            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            
           
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            
            
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5-0.5*x1);
            this.textureCoordinates.push(0.5-0.5*y1);
            this.textureCoordinates.push(0.5-0.5*x2);
            this.textureCoordinates.push(0.5-0.5*y2);
            
            
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5);
            this.textureCoordinates.push(0.5-0.5*x1);
            this.textureCoordinates.push(0.5-0.5*y1);
            this.textureCoordinates.push(0.5-0.5*x2);
            this.textureCoordinates.push(0.5-0.5*y2);
        }
        
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoordinates),
                        gl.STATIC_DRAW);
        
        this.normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        this.vertexNormals = [];

        for ( i = 0; i < n; i++)
        {
            var angle1 = (10*M_PI*i)/180;
            var angle2 = (10*M_PI*(i+1))/180;
            var x1=Math.cos(angle1);
            var y1=Math.sin(angle1);
            var x2=Math.cos(angle2);
            var y2=Math.sin(angle2);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(-1.0);
            
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(-1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(-1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(1.0);
            
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(-1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(-1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(-1.0);
            
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(1.0);
            
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(0.0);
            this.vertexNormals.push(1.0);           
        } 

        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexNormals),
                    gl.STATIC_DRAW);


        this.buffer = {
            position: this.positionBuffer,
            textureCoord: this.textureCoordBuffer,
            normals: this.normalBuffer,
        }

    }

    drawCoins(gl, projectionMatrix, programInfo, deltaTime) {   
        const modelViewMatrix = mat4.create();
        mat4.translate(
            modelViewMatrix,
            modelViewMatrix,
            this.pos
            );
        
        // this.rotation += Math.PI / (((Math.random()) % 100) + 50);
        
        mat4.rotate(modelViewMatrix,
            modelViewMatrix,
            this.rotation,
            [0, 1, 0]);
            
        
        {
            const numComponents = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.position);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }
            
        {
            const num = 2; // every coordinate composed of 2 values
            const type = gl.FLOAT; // the data in the buffer is 32 bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.textureCoord);
            gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, num, type, normalize, stride, offset);
            gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
        }
        {
            const nums = 3;
            const type = gl.FLOAT;
            const normalize = false;
            const stride = 0;
            const offset = 0;
            gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer.normals);
            gl.vertexAttribPointer(
                programInfo.attribLocations.vertexNormal,
                nums,
                type,
                normalize,
                stride,
                offset);
            gl.enableVertexAttribArray(
                programInfo.attribLocations.vertexNormal);
          }
        
        
        // Tell WebGL which indices to use to index the vertices
        // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer.indices);

        // Tell WebGL to use our program when drawing
        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, modelViewMatrix);
        mat4.transpose(normalMatrix, normalMatrix);
        

        gl.useProgram(programInfo.program);

        // Set the shader uniforms

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.normalMatrix,
            false,
            normalMatrix);
        gl.activeTexture(gl.TEXTURE0);

        // Bind the texture to texture unit 0
        gl.bindTexture(gl.TEXTURE_2D, textureCoin);
        
        // Tell the shader we bound the texture to texture unit 0
        gl.uniform1i(programInfo.uniformLocations.uSampler, 0);
        {
            const type = gl.UNSIGNED_SHORT;
            const offset = 0;
            // gl.drawElements(gl.TRIANGLES, 3*n, type, offset);
            gl.drawArrays(gl.TRIANGLES, 0,this.positions.length/3);
        }
        this.rotation += 0.05;

    }
};
