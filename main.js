
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies,
	Vector = Matter.Vector,
	Body = Matter.Body;
     
var engine = Engine.create();
 
 var canvas = document.createElement('canvas'),
    context = canvas.getContext('2d');


document.body.appendChild(canvas);
realityExists=false
resetWorld=()=>{             
World.clear(engine.world)
realityExists=false
window.boxA = Bodies.rectangle(00, 200, 80, 80, {inertia:Infinity,friction:0.002,density:0.0001,color:"#f00"});
window.otherBodies=[Bodies.circle(-380, 100, 40, 10),Bodies.circle(-460, 10, 40, 10)
				,Bodies.rectangle(1000, 50, 80, 1000, { isStatic: true })
				,Bodies.rectangle(-1000, 50, 80, 1000, { isStatic: true })
				,Bodies.rectangle(300, 200, 80, 80)
				,Bodies.rectangle(500, 200, 80, 80,)
				,Bodies.rectangle(600, 200, 80, 80, )
				,Bodies.rectangle(700, 200, 80, 80, )
				,Bodies.rectangle(300, 200, 80, 80, )
				,Bodies.rectangle(500, 200, 80, 80, )
				,Bodies.rectangle(600, 200, 80, 80, )
				,Bodies.rectangle(700, 200, 80, 80, )
				,Bodies.rectangle(300, 200, 80, 80, )
				,Bodies.rectangle(500, 200, 80, 80, )
				,Bodies.rectangle(600, 200, 80, 80, )
				,Bodies.rectangle(700, 200, 80, 80, )
				,Bodies.rectangle(500, 200, 160, 40)
				,Bodies.rectangle(500, 200, 160, 40)
				,Bodies.rectangle(500, 200, 160, 40)];
window.ground = Bodies.rectangle(400, 380, 8100, 60, { isStatic: true ,friction:0.01});
window.jumpSensor = Bodies.rectangle(0, 0, 70, 10, {
    sleepThreshold: 99999999999,
    isSensor: true
});
realityExists=true
World.add(engine.world, [boxA, ground].concat(otherBodies));
}


options={
	cdx:0,
	cdy:1
};
var input={left:false,right:false,up:false,down:false};
function PIP(point, vs) {//copied from github
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};
var sel=0
var clicked=0
var clickedII=0
var selpos=0
document.onmousemove=(e)=>{
	if (e) {
		clickedII=[e.clientX,e.clientY];
	}
	clicked=[clickedII[0]+options.cdx,clickedII[1]+options.cdy];
	if (sel) {
		selpos=Vector.add(sel.position,Vector.create())
		Matter.Body.setPosition(sel,{x:clicked[0],y:clicked[1]});
		let scaleFactor=Vector.magnitude(Vector.sub(sel.position,boxA.position))/Vector.magnitude(Vector.sub(selpos,boxA.position))
		if (isNaN(scaleFactor)) scaleFactor=1
		Body.scale(sel,scaleFactor,scaleFactor)
	}
}
window.addEventListener("click", function(e) {
	if (sel) {
		Matter.Body.set(sel,{isStatic:false})
		sel=0;
		return
	}
	var bodies = Matter.Composite.allBodies(engine.world);
	    for (var i = 1; i < bodies.length; i += 1) {
			var vertices = bodies[i].vertices.map((x)=>[x.x,x.y]);
			let temp=PIP(clicked,vertices)
			Matter.Body.set(bodies[i],{clickPoint:temp})
			if (temp&&!bodies[i].isStatic) {
				sel=bodies[i];
				break;
			}
		}
});
 (function render() {
canvas.width = document.body.clientWidth-100;
canvas.height = document.body.clientHeight-100;
	 if (realityExists) {
		 let avgWeight=20
	 if (jumpSensor) {Body.setPosition(jumpSensor,Vector.add(boxA.position,{x:0,y:50}))}
	 options.cdx=(((boxA.position.x-canvas.width+clickedII[0]))+options.cdx*avgWeight )/(1+avgWeight)
	 options.cdy=(((boxA.position.y-canvas.height+clickedII[1]))+options.cdy*avgWeight)/(1+avgWeight)
	 if (isNaN(options.cdx)) options.cdx=0
	 if (isNaN(options.cdy)) options.cdy=0
	 Matter.Body.applyForce(boxA,boxA.position,{x:(input.left?-0.0006:0)+(input.right?0.0006:0),y:0})
	 //document.onmousemove()
    var bodies = Matter.Composite.allBodies(engine.world);


    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.beginPath();
	
	context.fillStyle = "#f00"
			context.fillRect(boxA.position.x-options.cdx-40
						,boxA.position.y-options.cdy-40
						,80
						,80)
	
	let collides=false
	bodies.forEach((x)=>{collides=collides||(Matter.SAT.collides(jumpSensor,x).collided&&x!=boxA)})
	if (input.up&&collides) {Body.setVelocity(boxA,{x:boxA.velocity.x,y:-14})}
	
	if (sel!=0) {
		Matter.Body.setPosition(sel,{x:clicked[0],y:clicked[1]});
		Body.setVelocity(sel,Vector.create())
		let collides=false
		bodies.forEach((x)=>{collides=collides||(Matter.SAT.collides(sel,x).collided&&sel!=x)})
		if (collides) {
			Body.scale(sel,0.97,0.97)
		} else {
		context.fillRect(sel.position.x-options.cdx
						,sel.position.y-options.cdy
						,10
						,10)
		
	}}
	
	if (clicked!=0) {
		context.fillRect((clicked[0]-options.cdx)
						,(clicked[1]-options.cdy)
						,2,2)
	}
    for (var i = 0; i < bodies.length; i += 1) {
		if (!bodies[i].color) {Body.set(bodies[i],{color:"#"+Math.floor(Math.random()*16777215).toString(16)})}
    context.fillStyle = bodies[i].color;
	context.strokeStyle="#0"
	context.beginPath()
        var vertices = bodies[i].vertices;

        context.moveTo(vertices[0].x-options.cdx, vertices[0].y-options.cdy);

        for (var j = 1; j < vertices.length; j += 1) {
            context.lineTo(vertices[j].x-options.cdx, vertices[j].y-options.cdy);
        }

        context.lineTo(vertices[0].x-options.cdx, vertices[0].y-options.cdy);
    context.lineWidth = 3;
	context.fill()
	context.stroke()
    }

	 }
    window.requestAnimationFrame(render);
	 })();
Engine.run(engine);
window.addEventListener("keyup", function(event) {
    switch (event.code) {
        case "ArrowRight":
            input.right = false
            break;
        case "ArrowLeft":
            input.left = false
            break
        case "ArrowUp":
            input.up = false
            break;
        case "ArrowDown":
            input.down = false
            break;
    }
});
window.addEventListener("keydown", function(event) {
    switch (event.code) {
        case "ArrowRight":
            input.right = true
            break;
        case "ArrowLeft":
            input.left = true
            break;
        case "ArrowUp":
            input.up = true
            break;
        case "ArrowDown":
            input.down = true
            break;
        case "KeyR":
            resetWorld()
            break;
}})
window.oncontextmenu = function(e) {
	e.preventDefault()
	if (sel) {

			Body.setAngularVelocity(sel,sel.angularVelocity+0.01)
	
		
	}
}
resetWorld()