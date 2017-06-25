Audio.pageStyle = (function(){

	function init() {
		var winHeight = $(window).height();
		var navHeight =	$('nav').outerHeight(true);
		$('#playerPage .bg').height(winHeight - navHeight);

		$('.left').click(turnPlayer);
		$('.right').click(function() {
			$('#searchPage').removeClass('touming');
			$('#playerPage').fadeOut();
			$('#searchPage').fadeIn();	
			$('.mynav p').find('span:eq(0)').css({'background-color': '#000000'});
			$('.mynav p').find('span:eq(1)').css({'background-color': '#ffffff'});
		})
	}
	var a; //进度条对象
	var dura; //歌曲时长
	var flag; //播放开关
	function changePlay(){

		var audio = document.getElementById('audio');
		var playContainer =  document.getElementsByClassName('playContainer')[0];		
		flag = false;
		
		audio.onloadedmetadata = function() {
			dura = this.duration;
			a = new Audio.scale.Scale('.lanren', dura, this);
		};	

		playContainer.addEventListener('click', function(event){
			var target = event.target;

			if(target.title && target.title == 'start'){
				flag = !flag;

				if(flag){
					//console.log(a.n)
					playStatus(); //播放
					Audio.playerController.play( a, dataWaining);
					
				}else {
					pauseStatus(); //暂停
					Audio.playerController.pause(a);
			
				}
			}else if(target.title && target.title == 'forward') {
				Audio.playerController.nextSong(a, Audio.songs);				
				flag = true;																	
			}else if(target.title && target.title == 'rewind'){
				Audio.playerController.prevSong(a,  Audio.songs);
				flag = true;			
			};

			audio.ondurationchange = function() {
				var t = this.duration;
				if( t != dura ){
					if(a.resetTime) {
						a.resetTime(t);
					} else {
						dataWaining("歌曲还在缓冲中...")
					}	

					if(flag){
						playStatus(); //播放
						Audio.playerController.play(a, dataWaining);
					}else {
						Audio.playerController.pause(a);
					}
				}else {
					dataWaining('网络延迟请重新播放');
				}
			}		

		}, false);	
	
	};

	function next() {
		flag = true;
		pauseStatus();
		Audio.playerController.nextSong(a,  Audio.songs);				
	
		audio.ondurationchange = function() {
			var t = this.duration;
			if( t != dura ){
				if(a.resetTime) {
					a.resetTime(t);
				} else {
					dataWaining("歌曲还在缓冲中...")
				}

				if(flag){
					playStatus(); //播放
					Audio.playerController.play(a, dataWaining);
				}else {
					Audio.playerController.pause(a);
				}
			}else {
				dataWaining('网络延迟请重新播放');
			}
		}		
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

	function turnPlayer() {

		$('#searchPage').fadeOut();
		$('#playerPage').fadeIn();
		$('.mynav p').find('span:eq(1)').css({'background-color': '#000000'});
		$('.mynav p').find('span:eq(0)').css({'background-color': '#ffffff'});
	}



	return {
		changePlay: changePlay,
		pauseStatus: pauseStatus,
		playStatus: playStatus,
		init: init,
		next: next,
		turnPlayer: turnPlayer
	}
}())

