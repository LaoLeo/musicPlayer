Audio.appController = (function(){
	
	function start() {
		Audio.pageStyle.init();
		Audio.pageStyle.changePlay();
		
	}

	return {
		start: start
	}
}())