

var url = null;
var ws = null;
var msgId = 0;
const wsStates = { "OPEN":1,"CLOSING":2,"CLOSED":3,"CONNECTING":0};

onmessage = function(evt){
    console.log("got message from main");
    console.log(evt.data);

    if(evt.data.task){
        switch( evt.data.task ){
            
            case "connect":
                if(ws && ws.readyState !== wsStates.CLOSED){
                    if(ws.readyState == wsStates.OPEN)
                        postMessage({type:"socket",status:"error",msg:"connection already open"});        
                    else
                        postMessage({type:"socket",status:"error",msg:"not in the right state"});        
                }
                else{
                    url = evt.data.url;
                    socketConnect();
                }
            break;

            case "disconnect":
                if(!ws || ws.readyState !== wsStates.OPEN){
                    postMessage({type:"socket",status:"error",msg:"not in the right state"});        
                }
                else{
                    ws.close();
                }
            break;
            
            case "send":
                if(!ws || ws.readyState !== wsStates.OPEN){
                    postMessage({type:"socket",status:"error",msg:"not open" });        
                }
                else{
                    // @todo - validate and prepare json in a extra function
                    if(!evt.data.msg.params){
                        msgId++;
                        evt.data.msg.params = {"id":msgId,"ts":Date.now() };
                    }
                    ws.send( JSON.stringify( evt.data.msg) );
                }
            break;
            
            default:
                console.log( evt.data.task + " : task not valid");
            break;
        }
    }

}

function wsOnError(evt){
    console.log(evt);
    postMessage({type:'socket',status:'error',msg:"need to reconnect"});
}
function wsOnMessage(evt){
    console.log(evt);
    //@todo - protocol handling could be done here or outside the worker 
    postMessage({type:'protocol',"response":JSON.parse(evt.data)});
}
function wsOnClose(){
    //@todo - check if the socket was closed by the user, if so no reconnect required
    postMessage({type:'socket',status:'close'});
    ws = null;
}
function wsOnOpen(){
    postMessage({type:'socket',status:'open'});
}


function socketConnect(){
    ws = new WebSocket(url);
    ws.onerror   = wsOnError;
    ws.onmessage = wsOnMessage;
    ws.onclose   = wsOnClose;
    ws.onopen    = wsOnOpen;
}

