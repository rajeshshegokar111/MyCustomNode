var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/CustomNode");

var outputSchema = new mongoose.Schema({
  topic: String,
  status: String,
  payload: Number,
  min: Number,
  max: Number,
  minThreshold: Number,
  maxThreshold: Number
});

var Output = mongoose.model("Output", outputSchema);

module.exports = function(RED) {
    function CustomNode(config) {
        RED.nodes.createNode(this,config);
        this.config = JSON.parse(JSON.stringify(config));
        var node = this;
        this.on('input', function(msg, done) {
            const inputPayload = msg.payload;
     		
     		if(inputPayload.payload < 0 ){
     				msg.status = 'ERROR_LOW';
     		}
     		if(inputPayload.payload > 100){
     				msg.status = "ERROR_HIGH";
     		}

     		if(inputPayload.topic == "Topic 1" || inputPayload.topic == "topic1"){
     			if(Number(inputPayload.payload) < node.config.minThreshold){
     				msg.status = "WARN_LOW";
     			} else if(Number(inputPayload.payload) > node.config.maxThreshold){
     				msg.status = "WARN_HIGH";
     			} else{
     				msg.status = "OK";
     			}
     			msg.topic = inputPayload.topic;
     			msg.payload = inputPayload.payload;
     			msg.min = node.config.min;
     			msg.max = node.config.max;
     			msg.maxThreshold = node.config.maxThreshold;
     			msg.minthreshold = node.config.minThreshold;
     		}
     		if(inputPayload.topic == "Topic 2" || inputPayload.topic == "topic2"){
     			if(Number(inputPayload.payload) < node.config.minThreshold2){
     				msg.status = "WARN_LOW";
     			} else if(Number(inputPayload.payload) > node.config.maxThreshold2){
     				msg.status = "WARN_HIGH";
     			} else{
     				msg.status = "OK";
     			}
     			msg.topic = inputPayload.topic;
     			msg.payload = inputPayload.payload;
     			msg.min = node.config.min2;
     			msg.max = node.config.max2;
     			msg.maxThreshold = node.config.maxThreshold2;
     			msg.minthreshold = node.config.minThreshold2;
     		}
     			var myData = new Output({"topic": msg.topic, "status": msg.status, "payload": msg.payload, "min": msg.min,
     				"max": msg.max, "minThreshold": msg.minThreshold, "maxThreshold": msg.maxThreshold});
  					myData.save()
    			.then(item => {
    			node.send(msg);
      			done();
   			 	})
    			.catch(err => {
    			msg.err = err;
    			node.send(msg);
      			console.error("error",err);
      			done(err);
    		});
            	//node.send(msg);   //in case db connection not needed then it will directly send data to debug node.
        });
    }
    RED.nodes.registerType("customnode",CustomNode);
}