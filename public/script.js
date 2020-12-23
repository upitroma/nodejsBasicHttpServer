//connect to server
var socket = io.connect(window.location.href);

//get html elements
var clickBtn = document.getElementById("testButton"),
    serverResponseDisplay = document.getElementById("serverResponse")


//networking out
clickBtn.addEventListener("click", function(){
    socket.emit("buttonClicked")
}); 

//networking in
socket.on("serverUpdate",function(data){
    serverResponseDisplay.innerHTML=data.message;
    console.log(data.message)
})