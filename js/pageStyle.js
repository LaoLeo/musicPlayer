Audio.pageStyle = (function(){
	var songs = [{
		src: 'http://ws.stream.qqmusic.qq.com/5166863.m4a?fromtag=46',
		img: 'http://imgcache.qq.com/music/photo/album_500/28/500_albumpic_148828_0.jpg',
		singer: '张杰',
		song: '逆战'
	},{
		src: 'http://ws.stream.qqmusic.qq.com/107192078.m4a?fromtag=46',
		img: 'http://imgcache.qq.com/music/photo/album_500/91/500_albumpic_1458791_0.jpg',
		singer: '周杰伦',
		song: '告白气球'
	},{
		src: 'http://ws.stream.qqmusic.qq.com/107283617.m4a?fromtag=46',
		img: 'http://imgcache.qq.com/music/photo/album_500/40/500_albumpic_1471640_0.jpg',
		singer: 'JC',
		song: '说散就散'
	},{
		src: 'http://ws.stream.qqmusic.qq.com/102345074.m4a?fromtag=46',
		img: 'http://imgcache.qq.com/music/photo/album_500/81/500_albumpic_982081_0.jpg',
		singer: '花童',
		song: '普通disco'
	},{
		src: 'http://ws.stream.qqmusic.qq.com/97744.m4a?fromtag=46',
		img: 'http://imgcache.qq.com/music/photo/album_500/17/500_albumpic_8217_0.jpg',
		singer: '周杰伦',
		song: '简单爱'
	}];

	function changePlay(){

		var audio = document.getElementById('audio');
		var dura;
		var a;
		var b;
		audio.onloadedmetadata = function() {
			dura = this.duration;
			a = new Audio.scale.Scale('.lanren', dura);
		}

		audio.onended = function() {
			Audio.playerController.nextSong(a, songs);
			Audio.playerController.play(a, dataWaining);
		}

		var playContainer =  document.getElementsByClassName('playContainer')[0];		
		var flag = false;

		playContainer.addEventListener('click', function(event){
			var target = event.target;

			if(target.title && target.title == 'start'){
				flag = !flag;

				if(flag){
					//console.log(a.n)
					playStatus(); //播放
					if(b) {
						Audio.playerController.play(b, dataWaining);
					}else {
						Audio.playerController.play(a, dataWaining);
					}	
					
				}else {
					pauseStatus(); //暂停
					if (b) {
						Audio.playerController.pause(b);
					} else {
						Audio.playerController.pause(a);
					};				
				}
			}else if(target.title && target.title == 'forward') {
				Audio.playerController.nextSong(a, songs);				
				flag = true;																	
			}else if(target.title && target.title == 'rewind'){
				Audio.playerController.prevSong(a, songs);
				flag = true;			
			};

			audio.ondurationchange = function() {
				var t = this.duration;
				if( t != dura ){
					b = new Audio.scale.Scale('.lanren', t);
					if(flag){
						playStatus(); //播放
						Audio.playerController.play(b, dataWaining);
					}else {
						Audio.playerController.pause(b);
					}
				}else {
					dataWaining('网络延迟请重新播放');
				}
				
			} 		

		}, false);

		
	
	};

	function playStatus(){
		var $playBtn = $('#playerPage .playerComponent .BtnBig.playBtn');
		var $positer = $('#playerPage .positer img');

		$playBtn.removeClass();
		$playBtn.addClass('pauseBtn BtnBig');  //显示播放状态
		$positer.css('-webkit-animation-play-state', 'running'); //开始旋转动画
	};

	function pauseStatus(){
		var $playBtn = $('#playerPage .playerComponent .BtnBig.pauseBtn');
		var $positer = $('#playerPage .positer img');

		$playBtn.removeClass();
		$playBtn.addClass('playBtn BtnBig');  //显示暂停状态
		$positer.css('-webkit-animation-play-state', 'paused'); //停止旋转
	};


	//错误回调
	function dataWaining(error){
		alert(error);

		return false;
	};




	return {
		changePlay: changePlay,
		pauseStatus: pauseStatus,
		playStatus: playStatus
	}
}())

