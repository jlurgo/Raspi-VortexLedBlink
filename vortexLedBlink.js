var Vortex = require('vortexjs');
var Gpio = require('onoff').Gpio;
var led = new Gpio(17, 'out');
var sck = require('socket.io-client')('https://router-vortex.herokuapp.com');

var NodoRouter = Vortex.NodoRouter;
var NodoConectorSocket = Vortex.NodoConectorSocket;
var NodoPortalBidi = Vortex.NodoPortalBidi;

var portal = new NodoPortalBidi();

sck.on("connect", function(){
	console.log("conectado");
}); 

sck.on("connect_error", function(error){
	console.log("error", error);
}); 

sck.on("connect_timeout", function(){
	console.log("timeout");
}); 

var connSocket= new NodoConectorSocket({
	id: "1",
	socket: sck, 
	verbose: true, 
	alDesconectar:function(){
		console.log("Socket desconectado");
	}
});  

portal.conectarCon(connSocket);
connSocket.conectarCon(portal);

portal.pedirMensajes(new Vortex.FiltrosYTransformaciones.FiltroXEjemplo({
	tipoDeMensaje:"raspi_vortex_led_blink.led_on"
}),function(msg){
	console.log("llego mensale de encendido");
	led.writeSync(1);
});

portal.pedirMensajes(new Vortex.FiltrosYTransformaciones.FiltroXEjemplo({
	tipoDeMensaje:"raspi_vortex_led_blink.led_off"
}),function(msg){
	console.log("llego mensale de apagado");
	led.writeSync(0);
});

console.log("comenzando");