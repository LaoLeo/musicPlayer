Audio.scale = (function() {

	function Scale (progressSeletor, dura, audio){

	    this.n=0; //播放时长，以秒为单位
	    this.timer = null; //计时器
	    this.sum; //歌曲时长
	    this.steps=0; //当前位置
	    this.max; //进度条长度
	    this.total; //记录格式化的歌曲时长

		var $progress = $(progressSeletor);
		this.btn = $progress.find('#btn')[0];
		this.bar = $progress.find('#bar')[0];
		this.step = $progress.find('#bar div')[0];
		this.currNode = $progress.find('.curr')[0];
		this.totalNode = $progress.find('.total')[0];
		
		//初始化
		this.init(dura, audio);				
	};
	Scale.prototype={
		init:function (dura, audio){
			var f=this,g=document,b=window,m=Math;

			//渲染歌曲的格式化总时长
			var total = this.resetTotal(dura)
			f.totalNode.innerHTML = total;

			//歌曲时长
			f.sum = Math.round(parseFloat(dura));
			//进度条长度
			f.max = f.bar.offsetWidth-f.btn.offsetWidth;

			f.btn.onmousedown=function (e){
				var x=(e||b.event).clientX;  //相对于文档的X左标
				var l=this.offsetLeft;  //相对于父节点的left
				var max=f.bar.offsetWidth-this.offsetWidth;
				
				g.onmousemove=function (e){
					var thisX=(e||b.event).clientX;
					var to=m.min(max,m.max(-2,l+(thisX-x)));  //想到达的位置
					f.btn.style.left=to+'px';

					f.listenTo(to, audio);				

					b.getSelection ? b.getSelection().removeAllRanges() : g.selection.empty();
				};
				g.onmouseup=new Function('this.onmousemove=null');
			};

			f.bar.onclick=function(e){
				var x = (e||b.event).clientX;
				var left = this.parentNode.offsetLeft;
				var to =  x - left;
				f.btn.style.left=to+'px';

				f.listenTo(to, audio);

			}
		},
		//调整听歌的进度
		listenTo:function (x, audio){

			this.steps = Math.max(0,x) * 100;
			this.step.style.width= (this.steps/100)+'px';

			this.n = Math.round( ( ( (this.steps/100) * this.sum) )/this.max);
			var m = parseInt(this.n/60);
			var s = parseInt(this.n%60);
			var curr = this.toDub(m) + ':' + this.toDub(s);
			this.currNode.innerHTML = curr;

			clearInterval(Audio.timer);
			audio.currentTime = this.n;
			console.log("now:" + this.n);

			if(!audio.paused){
				Audio.timer = this.running();
			}
		},

		//进度计时
		timing: function(speed) {

			//计时
			var n = ++this.n;
			var m = parseInt(n/60);
			var s = parseInt(n%60);
			var curr = this.toDub(m) + ':' + this.toDub(s);
			this.currNode.innerHTML = curr;

			//progress
			this.steps += speed;
			if(this.steps >= this.max*100) clearInterval(this.timer);

			this.step.style.width = Math.min(this.steps/100, this.max) + 'px';
			this.btn.style.left = Math.min(this.steps/100, this.max) + 'px';

	
		},

		running: function() {
			
			var that = this;
			var speed = (that.max/that.sum).toFixed(2);
			speed = parseFloat(speed) * 100;

			//播放时立即调用
			this.timing(speed);	

			clearInterval(this.timer);
			//必须返回出去，在外才能清除计时器
			this.timer = setInterval(function() {
					//计时
					var n = ++that.n;
					if(n > that.sum) {
						n = that.sum
					}
					var m = parseInt(n/60);
					var s = parseInt(n%60);
					var curr = that.toDub(m) + ':' + that.toDub(s);
					that.currNode.innerHTML = curr;

					//progress
					that.steps += speed;
					if(that.steps >= that.max*100) clearInterval(that.timer);

					that.step.style.width = Math.min(that.steps/100, that.max) + 'px';
					that.btn.style.left = Math.min(that.steps/100, that.max) + 'px';
				}, 1000)

			return this.timer
		},

		//补零
	    toDub: function(n){
	        return n<10?"0"+n:""+n;
	    },

		//重置进度条
		areset: function (){
			this.n=0,this.steps=0;
			this.step.style.width = '0px';
			this.btn.style.left = '0px';
			this.currNode.innerHTML = '00:00';
		},

		//重值歌曲时长
		resetTime: function(duration) {
			this.sum = duration;
			this.total = this.resetTotal(duration);		
			this.totalNode.innerHTML = this.total;			
		},

		//重置两遍的时钟
		resetTotal: function(duration) {
			var d = Math.round(parseFloat(duration));
			var m = parseInt(d/60);
			var s = parseInt(d%60);
			this.total = this.toDub(m) + ':' + this.toDub(s);

			return this.total;
		}
    	
	};

	return {
		Scale: Scale
	}

}())

