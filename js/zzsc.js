$(function(){
	// 先取得 #abgne-block-20120527 及其相关区域及元素。
	// 并依次计算每等份的宽度
	var _slices = 9,	// 切成九等份
		_index = 0,		// 预设展示第几个
		_zIndex = 999, 
		$block = $('#zzsc').css('position', 'relative'), 
		$slides = $block.find('a').css('z-index', _zIndex).hide(), 
		_width = $block.width(), 
		_height = $block.height(), 
		_sliceWidth = _width / _slices,	// 每等份的宽度
		_lastSliceWidth = _sliceWidth + (_width - _sliceWidth * _slices),	// 剩余的宽度
		_img = $slides.eq(_index).show().find('img').attr('src'), 
		timer, 
		speed = 2000,	// 轮播速度
		_animateSpeed = 600,	// 动画速度
		_isHover = false,	// 滑鼠是否移到 $block 上
		_isComplete = true;	// 动画是否已全部执行完
		// 依 _slices 数量来产生相对应的 div 区域
		var _sliceDiv = '', _control = '';
		for(var i=0;i<_slices;i++){
			var _w = i == _slices - 1 ? _lastSliceWidth : _sliceWidth, _l = i * _sliceWidth;//?:条件语句
			_sliceDiv += '<div class="abgne-slice slide-' + i + '" style="left:' + _l + 'px;top:0;width:' + _w + 'px;height:100%;background-image:url(' + _img + ');background-position:-' + _l + 'px 0;position:absolute;background-repeat:no-repeat;"></div>';
		}
		
		// 依 $slides 数量来产生按钮
		for(var i=0;i<$slides.length;i++){
			_control += '<li class="abgne-control control-' + (i + 1) + '">' + (i + 1) + '</li>';
		}
		
		// 分別把 div 区域及按钮加入到 $block 中
		var $abgneSlides = $block.append(_sliceDiv, '<ul class="abgne-controls">' + _control + '</ul>').find('.abgne-slice'), 
			$abgneControls = $block.find('.abgne-controls').css('z-index', _zIndex + 2).find('li').eq(_index).addClass('current').end();
		
		// 当点击到 .abgne-controls li 时
		$abgneControls.click(function(){
			// 若动画未完成前不接受其它新的事件
			if(!_isComplete) return;
			
			var $this = $(this), 
				$slide = $slides.eq($this.index()), 
				_completeTotal = 0;
			
			// 若现在显示的跟点击到的是同一个时, 就不处理
			if($this.hasClass('current')) return;

			// 帮点击到的 li 加上 .current, 并移除上一个 .current 
			$this.addClass('current').siblings('.current').removeClass('current');
			_isComplete = false;
			_index = $this.index();
			
			// 取得相对应的图片的路径
			_img = $slide.find('img').attr('src');
			// 先让每一个区域的背景图片为刚刚取得的图片
			// 并进行动画
			$abgneSlides.each(function(i){
				var $ele = $(this);
				$ele.css({
					top: i % 2 == 0 ? _height : -_height,
					opacity: 0, 
					zIndex: _zIndex + 1, 
					backgroundImage: 'url(' + _img + ')'
				}).stop().animate({
					top: 0, 
					opacity: 1
				}, _animateSpeed, function(){
					$ele.css('zIndex', _zIndex - 1);
					if(i == _slices - 1){
						$block.css('background-image', 'url(' + _img + ')');
						$slide.show().siblings('a:visible').hide();
						_isComplete = true;
						// 当动画完成且滑鼠没有移到 $block 上时, 再启动计时器
						if(!_isHover)timer = setTimeout(auto, speed);
					}
				});
			});
		});
		
		$block.hover(function(){
			// 当滑鼠移入 $block 时停止计时器
			_isHover = true;
			clearTimeout(timer);
		}, function(){
			// 当滑鼠移出 $block 时启动计时器
			_isHover = false;
			timer = setTimeout(auto, speed);
		});
		
		// 自动轮播使用
		function auto(){
			_index = (_index + 1) % $slides.length;
			$abgneControls.eq(_index).click();
		}
		
		// 启动计时器
		timer = setTimeout(auto, speed);
	});