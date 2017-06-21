Audio.playerController = (function(){
	
	var index = 0;

	function play(a, failureCB) {
		var audio = document.getElementById('audio');
			
		audio.play(); //播放

		audio.onplay = function() {
			clearInterval(Audio.timer);
			Audio.timer = a.running(); //进度条走起
		};
		audio.onended = function() {
			Audio.pageStyle.next(); //自动播放下一首
		}
		
		audio.onerror = function() {
			if(failureCB) {
				failureCB('加载出错...请刷新');
			}else {
				alert('发生未知错误');
			}
		}

	}

	function pause() {
		audio.pause();
		audio.onpause = function() {
			clearInterval(Audio.timer);
			console.log(123)
		}		
	}


	function nextSong(a, songs) {
		//重置进度条 并 清除定时器
		a.areset();
		clearInterval(Audio.timer);

		//渲染音乐资源
		index++;
		if(index >= songs.length) {
			index = 0;
		}
		render(songs[index]);
		
	}

	function prevSong(a, songs) {
		//重置进度条
		a.areset();
		clearInterval(Audio.timer);

		index--;
		if(index <= -1) {
			index = songs.length - 1;
		}
		render(songs[index]);
	}

	function render(data) {
		var $bg = $('#playerPage .bg');
		var $song =$('#playerPage .pageContent .musicName h2');
		var $singer = $('#playerPage .pageContent .musicName p span');
		var $img = $('#playerPage .pageContent .positer img');
		var $mpSrc = $('#audio');
		var oAudio = $mpSrc.get(0);
		var dura;

		$bg.css('background-image', 'url('+data.img+')');
		$song.html(data.song);
		$singer.html(data.singer);
		$img.attr('src', data.img);
		$mpSrc.attr('src', data.src);

 	}



	return {
		play: play,
		pause: pause,
		nextSong: nextSong,
		prevSong: prevSong
	}
}())