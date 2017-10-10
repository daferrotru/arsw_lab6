var app = (function () {
class Point{
constructor(x, y){
this.x = x;
        this.y = y;
        }
}

var stompClient = null;
    var newConection;
    
        var draw=function (lista){
            var canvas = document.getElementById("canvas");
            var c = canvas.getContext("2d");
            c.beginPath();
            c.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < lista.length - 1; i++) {
                first = lista[i];
                last = lista[i + 1];
                c.moveTo(first.x, first.y);
                c.lineTo(last.x, last.y);
            }
                       
            c.stroke();
        };

        var addPointToCanvas = function (point) {
        var canvas = document.getElementById("canvas");
                var ctx = canvas.getContext("2d");
                ctx.beginPath();
                ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
                ctx.stroke();
        };
        var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
                var rect = canvas.getBoundingClientRect();
                return {
                x: evt.clientX - rect.left,
                        y: evt.clientY - rect.top
                };
        };
        var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
                var socket = new SockJS('/stompendpoint');
                stompClient = Stomp.over(socket);
                //subscribe to /topic/TOPICXX when connections succeed
                stompClient.connect({}, function (frame) {
                    console.log('Connected: ' + frame);
                    stompClient.subscribe('/topic/newpolygon.'+newConection , function (eventbody) {
                        var theObject = JSON.parse(eventbody.body);
                        //alert("Event body: "+ eventbody);
                        //alert("RECEIVED POINTS: X:" + theObject.x+ "y: " + theObject.y);
                        
                        //DRAW POLYGON
                        draw(theObject);
                    });    
                });
        };
        
        
        return {

            init: function () {
                var can = document.getElementById("canvas");
                
                 //if PointerEvent is suppported by the browser:

                if (window.PointerEvent) {
                    canvas.addEventListener("pointerdown", function (event) {
                        var puntos= getMousePosition(event);
                        app.publishPoint(puntos.x,puntos.y);
                        
                    });
                } else {
                    canvas.addEventListener("mousedown", function (event) {
                        var puntos= getMousePosition(event);
                        app.publishPoint(puntos.x,puntos.y);
                    });
                }
                
            },
            publishPoint: function(px, py){
                var pt = new Point(px, py);
                        console.info("publishing point at " + pt);
                        addPointToCanvas(pt);
                        //publicar el evento
                        stompClient.send("/app/newpoint."+newConection, {}, JSON.stringify(pt));
                },
            disconnect: function () {
                if (stompClient !== null) {
                    stompClient.disconnect();
                }
                setConnected(false);
                console.log("Disconnected");
            },
            
            newConection:function (conection){
                var canvas = document.getElementById("canvas");
                var c = canvas.getContext("2d");
                c.clearRect(0, 0, canvas.width, canvas.height);
                newConection=conection;
                document.getElementById("cc").innerHTML = "Current Connection: " + newConection;
                console.log("Conected to: "+newConection);
                connectAndSubscribe();
                
            }
        };
        })();