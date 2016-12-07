$(document).ready(function(){
	//棋
	var canvas=$('#canvas').get(0);
	var ctx=canvas.getContext('2d');
	var sep=40;
	var sR=4;
	var bR=18;
	var qizi={};
	var flag=true;
	var de1=0;
	var de2=0;
	var t1;
	var t2;
	var canvas1=$('#miaobiao1').get(0);
	var ctx1=canvas1.getContext('2d');
	var canvas2=$('#miaobiao2').get(0);
	var ctx2=canvas2.getContext('2d');
	var leftTime=$('.leftTime');
	var rightTime=$('.rightTime');
	var audio=$('.audio').get(0);
	var s=0;
	var img=$('.box img');
	var a=$('.box a');
	var start=$('.start');
	var gameStates='pause';
	var kongbai={};
	var AI=false;
	start.on('click',function(){
		
		$('.fenmian').hide()
		$('.info').removeClass('active');
		$('.zhao').removeClass('active');
		reStart();
	})
	//退出
	$('.exit').on('click',function(){
		$('.info').removeClass('active');
		$('.zhao').removeClass('active');
		$('.fenmian').show()
	})
	function lambada(x){
		return (x+0.5)*sep+0.5;
	}
	//棋盘上的五个小点
	function circle(x,y){
		ctx.save();
		ctx.beginPath();
		ctx.arc(lambada(x),lambada(y),sR,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	function M(a,b){
		return a+'_'+b;
	}
	//画棋盘
	function drawQipan(){
		ctx.clearRect(0,0,600,600)
		ctx.save();
		ctx.beginPath();
		for(i=0;i<15;i++){
			ctx.moveTo(lambada(0),lambada(i));
			ctx.lineTo(lambada(14),lambada(i));
			ctx.moveTo(lambada(i),lambada(0));
			ctx.lineTo(lambada(i),lambada(14));
		}
		ctx.stroke();
		ctx.closePath();
		circle(3,3);
		circle(7,7);
		circle(11,3);
		circle(3,11);
		circle(11,11);
		ctx.restore();
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				kongbai[M(i,j)]=true;
			}
		}
	}
	drawQipan();
	//落子
	function luozi(x,y,color){
		ctx.save();
		ctx.translate(lambada(x),lambada(y))
		ctx.beginPath();
		var g=ctx.createRadialGradient(-4,-4,0,0,0,18);
		if(color=='black'){
			g.addColorStop(0.2,'#ddd');
			g.addColorStop(0.3,'#ccc');
			g.addColorStop(1,'black');
			gameStates='play';
		}else{
			g.addColorStop(0.2,'#fff');
			g.addColorStop(1,'#ddd');
			
			gameStates='play';
		}
		ctx.fillStyle=g;
		ctx.arc(0,0,bR,0,Math.PI*2);
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=3;
		ctx.shadowColor='#666';
		ctx.shadowBlur=5;
		ctx.closePath();
		ctx.fill();
		ctx.restore();
		qizi[x+'_'+y]=color;
		
		delete kongbai[M(x,y)];
//		qizi.push(x,y,color);
	}
	
//	function you(x,y){
//		var kaiguan=false;
//		$.each(qizi,function(i,v){
//			if(v.x==x&&v.y==y){
//				kaiguan=true;
//			}
//		})
//		return kaiguan
//	}
	function handleClick(e){	
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);
		if(qizi[x+'_'+y]){
			return;
		}
//		if(you(x,y)){
//			return;
//		}
		//人机
		if(AI){
			luozi(x,y,'black');
			t1=setInterval(render1,1000);
			clearInterval(t2);
			if(panduan(x,y,'black')>=5){
				$(canvas).off('click');
				clearInterval(t1);
				leftTime.html('00:00');
				rightTime.html('00:00');
				$('.zhao').addClass('active')
				$('.info').addClass('active');
				$('.info').find('.win').html('黑棋');
			}
			var p=intel();
			luozi(p.x,p.y,'white');
			t2=setInterval(render2,1000);
			clearInterval(t1)
			if(panduan(p.x,p.y,'white')>=5){
				$(canvas).off('click');
				clearInterval(t2);
				leftTime.html('00:00');
				rightTime.html('00:00');
				$('.zhao').addClass('active')
				$('.info').addClass('active');
				$('.info').find('.win').html('白棋');
			}
			audio.play();
			return false;
		}
		
		//人人
		if(flag){
			luozi(x,y,'black');
			t1=setInterval(render1,1000);
			clearInterval(t2);
			if(panduan(x,y,'black')>=5){
				$(canvas).off('click');
				clearInterval(t1);
				leftTime.html('00:00');
				rightTime.html('00:00');
				$('.zhao').addClass('active');
				$('.info').addClass('active');
				$('.info').find('.win').html('黑棋');
			}
		}else{
			luozi(x,y,'white');
			t2=setInterval(render2,1000);
			clearInterval(t1)
			if(panduan(x,y,'white')>=5){
				$(canvas).off('click');
				clearInterval(t2);
				leftTime.html('00:00');
				rightTime.html('00:00');
				$('.zhao').addClass('active');
				$('.info').addClass('active')
				$('.info').find('.win').html('白棋');
			}
		}
		flag=!flag;
		audio.play();
	}
	$(canvas).on('click',handleClick);
	//判断
	function panduan(x,y,color){
		row=1;
		i=1;while(qizi[M(x+i,y)]==color){ row++; i++;}
		i=1;while(qizi[M(x-i,y)]==color){ row++; i++;}
		col=1;
		i=1;while(qizi[M(x,y+i)]==color){ col++; i++;}
		i=1;while(qizi[M(x,y-i)]==color){ col++; i++;}
		zX=1;
		i=1;while(qizi[M(x+i,y+i)]==color){ zX++; i++;}
		i=1;while(qizi[M(x-i,y-i)]==color){ zX++; i++;}
		yX=1;
		i=1;while(qizi[M(x-i,y+i)]==color){ yX++; i++;}
		i=1;while(qizi[M(x+i,y-i)]==color){ yX++; i++;}
//		if(qizi[M(x+1,y)]=='black'){
//			r+=1;
//			if(qizi[M(x+2,y)]=='black'){
//				r+=1;
//				if(qizi[M(x=3,y)]=='black'){
//					r+=1;
//				}
//			}
//		}
		return Math.max(row,col,zX,yX);
	}
	//棋谱
	function chessManual(){
		var i=1;
		ctx.save();
		ctx.font='15px/0 microsoft yahei';
		ctx.textAlign='center';
		ctx.textBaseline='middle';
		for(var k in qizi){
			var arr=k.split('_');
			if(qizi[k]=='white'){
				ctx.fillStyle='black';
			}else{
				ctx.fillStyle='white';
			}
			ctx.fillText(i++,lambada(parseInt(arr[0])),lambada(parseInt(arr[1])))
		}
		ctx.restore();
		$('.box').addClass('active2')
		if($('.box').find('img').length){
			$('.box').find('img').attr('src',canvas.toDataURL())
		}else{
			$('<img>').attr('src',canvas.toDataURL()).appendTo($('.box'));
		}
		if($('.box').find(a).length){
			$('.box').find(a).attr('href',canvas.toDataURL()).attr('download','qipu.png')
		}else{
			$('<a>').attr('href',canvas.toDataURL()).attr('download','qipu.png').appendTo($('.box'));
		}
	}
	//查看棋谱
	$('.manual').on('click',function(){
		chessManual();
	})
	
	//关闭棋谱
	$('.close').on('click',function(){
		$('.box').removeClass('active2')
		for(var k in qizi){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			luozi(x,y,qizi[k]);
		}
	})
	//人机
	//棋盘上所有空白位置
	//每个函数调用 cal(pos.x,pos,y,)
	function intel(){
		var max=-Infinity;
		var pos={}
		for(var k in kongbai){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			var m=panduan(x,y,'black');
			if(m>max){
				max=m;
				pos={x:x,y:y};
				console.log(pos)
			}
		}
		var max2=-Infinity;
		var pos2={};
		for(var k in kongbai){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			var m2=panduan(x,y,'white');
			if(m2>max2){
				max2=m2;
				pos2={x:x,y:y};
			}
		}
		if(max>max2){
			return pos;
		}else{
			return pos2;
		}
	}

	//模式
	$('.renren').on('click',function(){	
		if(gameStates=='play'){
			return;
		}
		$('.renji').html('<img src="img/renji.png" alt="" />')
		$(this).html('<img src="img/rpt.png" alt="" />')
		AI=false;
	})
	$('.renji').on('click',function(){	
		if(gameStates=='play'){
			return;
		}
		$('.renren').html('<img src="img/renren.png" alt="" />')
		$(this).html('<img src="img/rrj.png" alt="" />')
		AI=true;
	})
	//再来一局,重新开始
	function reStart(){
		ctx.clearRect(0,0,600,600)
		$('.info').removeClass('active');
		$('.zhao').removeClass('active');
		drawQipan();
		qizi={};
		flag=true;
		$(canvas).on('click',handleClick);
		gameStates='pause';
		
	}
	$('.again').on('click',reStart)
	$('.new').on('click',reStart)
	//miaobiao
	leftTime.html('00:00');
	rightTime.html('00:00');
	function zhen1(){
		ctx1.save();
		ctx1.translate(65,65);
		var date=new Date();
		s+=1
		ctx1.rotate(Math.PI/180*6*s);
		ctx1.beginPath();
		ctx1.arc(0,0,4,0,Math.PI*2);
		ctx1.moveTo(0,4);
		ctx1.lineTo(0,15);
		ctx1.moveTo(0,-4);
		ctx1.lineTo(0,-35)
		ctx1.closePath();
		ctx1.stroke();
		ctx1.restore();
	}
	zhen1()
	function render1(){
		ctx1.save();
		ctx1.clearRect(0,0,200,200);
		zhen1();
		de1+=1;
		ctx1.restore();
		var m1=Math.floor(de1/60);
		var n1=de1%60;
		if(n1<10&&m1<10){
			leftTime.html('0'+m1+':0'+n1);
		}else if(n1<10){
			leftTime.html(m1+':0'+n1);
		}else if(m1<10){
			leftTime.html('0'+m1+':'+n1);
		}else{
			leftTime.html(m1+':'+n1);
		}
		$('.biao2').get(0).play();
		$('.biao1').get(0).pause();
	}

	function zhen2(){
		ctx2.save();
		ctx2.translate(65,65);
		var date=new Date();
		s+=1;
		ctx2.rotate(Math.PI/180*6*s);
		ctx2.beginPath();
		ctx2.arc(0,0,4,0,Math.PI*2);
		ctx2.moveTo(0,4);
		ctx2.lineTo(0,15);
		ctx2.moveTo(0,-4);
		ctx2.lineTo(0,-35)
		ctx2.closePath();
		ctx2.stroke();
		ctx2.restore();
	}
	zhen2();
	function render2(){
		ctx2.save();
		ctx2.clearRect(0,0,200,200);
		zhen2();
		ctx1.restore();
		de2+=1;
		var m2=Math.floor(de2/60);
		var n2=de2%60;
		if(n2<10&&m2<10){
			rightTime.html('0'+m2+':0'+n2);
		}else if(n2<10){
			rightTime.html(m2+':0'+n2);
		}else if(m2<10){
			rightTime.html('0'+m2+':'+n2);
		}else{
			rightTime.html(m2+':'+n2);
		}
		$('.biao1').get(0).play();
		$('.biao2').get(0).pause();
	}
	
	
	
	
	
	
	
	
	
	
	
})
