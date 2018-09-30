;// 尽量把业务相关的js都封装到了CMC命名空间下
(function($, CMC) {
	var showLeftMenu = function() {
		$('.web-sidebar').css({
			'transform' : 'translate(0, 0px)',
			'left' : '0'
		});
		$('.content-wrapper').css('margin-left', '196px');
		$('.s-call-right').hide();
	};
	var hideLeftMenu = function() {
		$('.web-sidebar').css({
			'transform' : 'translate(-190px, 0px)',
			'left' : '-190px'
		});
		$('.content-wrapper').css('margin-left', '20px');
		$('.s-call-right').show();
	};
	$(document).ready(function() {
		// 点击侧边栏导航显示隐藏
		$('.s-call-left').click(hideLeftMenu);
		$('.s-call-right').click(showLeftMenu);
		// 弹窗垂直居中
		function centerModals() {
			$('#myModal,#myModal-add,#myModal-down,#myModal-del').each(function() {
				var $clone = $(this).clone().css('display', 'block').appendTo('body');
				var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
				top = top > 0 ? top : 0;
				$clone.remove();
				$(this).find('.modal-content').css("margin-top", top);
			});
		}
		$('#myModal,#myModal-add,#myModal-down,#myModal-del').on('show.bs.modal', centerModals);
		$(window).on('resize', centerModals);
		// 加载
		var count = 0;
		function rotate() {
			var elem2 = document.getElementById('div3');
			elem2.style.MozTransform = 'scale(0.5) rotate(' + count + 'deg)';
			elem2.style.WebkitTransform = 'scale(0.5) rotate(' + count + 'deg)';
			if (count === 360) {
				count = 0
			}
			count += 45;
			window.setTimeout(rotate, 100);
		}
	});
	// export到全局
	var menu = CMC.Menu || (CMC.Menu = {});
	menu.showLeftMenu = showLeftMenu;
	menu.hideLeftMenu = hideLeftMenu;
})(jQuery, window.CMC || (window.CMC = {}));
