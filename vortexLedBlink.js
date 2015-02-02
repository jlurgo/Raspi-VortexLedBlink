var Vortex = require('vortexjs');
var Gpio = require('onoff').Gpio;
var led = new Gpio(17, 'out');
var io = require('socket.io-client');

var NodoRouter = Vortex.NodoRouter;
var NodoConectorSocket = Vortex.NodoConectorSocket;
var NodoPortalBidi = vx.NodoPortalBidi;

var portal = new NodoPortalBidi();

var connSocket = new NodoConectorSocket({
	id: "1",
	socket: io.connect("https://router-vortex.herokuapp.com"), 
	verbose: true, 
	alDesconectar:function(){
		console.log("Socket desconectado");
	}
});    

portal.conectarCon(connSocket);
connSocket.conectarCon(portal);

portal.pedirMensajes({
	tipoDeMensaje:"raspi_vortex_led_blink.led_on"
},function(msg){
	led.writeSync(1);
	console.log("llego mensale de encendido");
});

portal.pedirMensajes({
	tipoDeMensaje:"raspi_vortex_led_blink.led_off"
},function(msg){
	led.writeSync(0);
	console.log("llego mensale de apagado");
});

console.log("comenzando");