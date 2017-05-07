// 依赖jquery
window.popimg = (function(){
    var dominstance = null;
    var imgData = {};
    var config = {
        spacing: 60,
        beforeShowDetail: function(){}
    };
    var popimage = {
        init: function(options){
            config = $.extend(config, options);
            // 初始化必要的dom结构
            dominstance = popimage.getInstance();
            // 绑定相关事件
            popimage.initEvent();
        },
        initDom: function(){
            var overlay = $('<div/>', {
                    'class': 'overlay'
                }),
                modal = $('<div/>', {
                    'class': 'pop-modal',
                    'html': '<div class="pop-close iconfont icon-close_m"></div>\
                             <div class="pop-detail iconfont icon-menu"></div>\
                             <div class="modal_content"><ul class="pop-list"></ul></div>'
                });
            $('body').append(overlay);
            $('body').append(modal);
            return {
                overlay: overlay,
                modal: modal
            };
        },
        initEvent: function(){
            // -resize
            $(window).on('resize', function(){
                // 触发图片宽高计算方法
                popimage.computePosition();
            });
            // -click
            $('body').on('click', '.preview-photo', function(evt){
                var data = $(evt.target).attr('href');
                // 显示图片
                popimage.showImage(data);
                return false;
            });
            // 关闭图片
            dominstance.overlay.on('click', function(){
                popimage.hide();
            });
            $('.pop-close', dominstance.modal).on('click', function(evt){
                popimage.hide();
            });
            // 展示详情
            $('.pop-detail', dominstance.modal).on('click', function(){
                if($('.modal_content>.pop-list', dominstance.modal).hasClass('pop-in')){
                    $('.modal_content>.pop-list', dominstance.modal).removeClass('pop-in').delay(200).animate({top: '-100%'}, 200);
                    return false;
                }
                var data = config.beforeShowDetail() || imgData,
                    tpl = '';
                for(var i in data){
                    tpl += '<li>'+i+' :'+data[i]+'</li>';
                }
                $('.modal_content>.pop-list', dominstance.modal).html(tpl).animate({top: 0}, 400).addClass('pop-in');
            });
        },
        resetDom: function(){
            dominstance.modal.removeClass('animate-out');
        },
        loadImg: function(){
            var dfd = $.Deferred();
            var img = new Image();
            img.src = imgData.src;
            img.onload = function(){
                imgData.width = img.width;
                imgData.height = img.height;
                imgData.ratio = img.width/img.height;
                popimage.computePosition();
                dfd.resolve();
            }
            img.error = function(){
                dfd.reject();
            }
            return dfd;
        },
        hide: function(){
            dominstance.overlay.hide(500, function () {
                $('body').removeClass('pop-show');
            });
            dominstance.modal.addClass('animate-out').delay(300)
                             .removeClass('animate-in');

            setTimeout(function(){
                popimage.resetDom();
            }, 500);
        },
        showImage: function(data){
            imgData.src = data;
            // 通过在body上添加类实现显示
            dominstance.overlay.show(0, function () {
                $('body').addClass('pop-show');
            });
            dominstance.modal.show(0)
                             .addClass('animate-in');
            popimage.loadImg(data).then(function(){
                $('.modal_content>img', dominstance.modal).remove();
                $('.modal_content', dominstance.modal).append('<img src="'+ imgData.src +'"/>');
                console.log(imgData);
            }, function(){
                alert('图片加载失败！');
            });
        },
        computePosition: function(){
            var w = $(window).width(),
                h = $(window).height(),
                setW = Math.min(w-config.spacing*2, imgData.width),
                setH = Math.min(h-config.spacing*2, imgData.height);
                setL = Math.max(config.spacing, (w-imgData.width)/2),
                setT = Math.max(config.spacing, (h-imgData.height)/2);
                // 防止图片变形
                if( setW / setH < imgData.ratio ){
                    // 宽度被拉伸
                    setH = setW / imgData.ratio;
                }
                if( setW / setH > imgData.ratio ){
                    setW = setH * imgData.ratio;
                }
                dominstance.modal.css({ left: Math.abs(setW-w)/2,
                                        top: Math.abs(setH-h)/2,
                                        width: setW,
                                        height: setH });
        },
        getInstance: function(){
            return dominstance ? dominstance: dominstance = popimage.initDom();
        }
    };
    return {
        init: popimage.init,
        showImage: popimage.showImage,
        hide: popimage.hide
    };
})();