Audio.playerController = (function(){
	
	Audio.index = 0;

	function play(a, failureCB) {
		var audio = document.getElementById('audio');
			
		audio.play(); //播放

		audio.onplay = function() {
			clearInterval(Audio.timer);
			if(a.running) {
				Audio.timer = a.running(); //进度条走起
			}else {
				alert('歌曲还在缓冲中...');
				return;
			}					
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
		}		
	}


	function nextSong(a, songs) {
		//重置进度条 并 清除定时器
		a.areset();
		clearInterval(Audio.timer);

		//渲染音乐资源
		Audio.index++;
		var index = Audio.index;
		if(index >= songs.length) {
			index = 0;
		}
		render(songs[index]);
		
	}

	function prevSong(a, songs) {
		//重置进度条
		a.areset();
		clearInterval(Audio.timer);

		Audio.index--;
		var index = Audio.index;
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
		prevSong: prevSong,
		render: render
	}
}())