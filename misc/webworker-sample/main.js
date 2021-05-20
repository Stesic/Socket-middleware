
const socketWorker = new Worker('worker.js');

socketWorker.onmessage = function(evt){
    console.log("message from worker");
    console.log(evt);
    if(evt.data.type && evt.data.type=="protocol"){
        document.getElementById('textinfo').value += JSON.stringify(evt.data.response) + "\n==============\n";
    }
    if(evt.data.type && evt.data.type=="socket"){
        document.getElementById('socketinfo').value += JSON.stringify(evt.data) + "\n==============\n";
    }

}

function startSocket(url){
    socketWorker.postMessage({"task":"connect","url":url});
}

function sendSocket(message){
    socketWorker.postMessage({"task":"send","msg":message});
}

function stopSocket(){
    socketWorker.postMessage({"task":"disconnect"});
}