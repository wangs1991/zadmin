/* 
 * To change this license header, choose License Headers in Project Properties.
 * and open the template in the editor.
 */
$(function () {
    $("body").append($(__inline('popimg.html')));

    window.popimg = new Vue({
        el: "#popimg",
        data: {
            dominstance: null,
            imgData: {},
            config: {
                spacing: 60,
                beforeShowDetail: function(){}
            }
        },
        methods: {
            init: function(options){
                this.config = $.extend(this.config, options);
                // 初始化必要的dom结构
                this.dominstance = this.getInstance();
                // 绑定相关事件
                this.initEvent();
            },
            showImage: function(evt){
                var data = $(evt.target).attr('href'),
                    that = this;
                this.imgData.src = data;
                // 通过在body上添加类实现显示
                this.dominstance.overlay.show(0, function () {
                    $('body').addClass('pop-show');
                });
                this.dominstance.modal.show(0)
                    .addClass('animate-in');
                this.loadImg(data).then(function(){
                    $('.modal_content>img', that.dominstance.modal).remove();
                    $('.modal_content', that.dominstance.modal).append('<img src="'+ that.imgData.src +'"/>');
                    console.log(that.imgData);
                }, function(){
                    alert('图片加载失败！');
                });
                return false;
            },
            hide: function(){
                var that = this;
                this.dominstance.overlay.hide(500, function () {
                    $('body').removeClass('pop-show');
                });
                this.dominstance.modal.addClass('animate-out').delay(300)
                    .removeClass('animate-in');

                setTimeout(function(){
                    that.resetDom();
                }, 500);
            },
            getInstance: function(){
                if(!this.dominstance){
                    this.dominstance = {
                        overlay: $('.overlay'),
                        modal: $('.pop-modal')
                    };
                }
                console.log(this.dominstance);
                return this.dominstance;
            },
            initEvent: function(){
                    var that = this;
                    // -resize
                    $(window).on('resize', function(){
                        // 触发图片宽高计算方法
                        that.computePosition();
                    });
            },
            showInfo: function(){
                if($('.modal_content>.pop-list', that.dominstance.modal).hasClass('pop-in')){
                    $('.modal_content>.pop-list', that.dominstance.modal).removeClass('pop-in').delay(200).animate({top: '-100%'}, 200);
                    return false;
                }
                var data = that.config.beforeShowDetail() || that.imgData,
                    tpl = '';
                for(var i in data){
                    tpl += '<li>'+i+' :'+data[i]+'</li>';
                }
                $('.modal_content>.pop-list', this.dominstance.modal).html(tpl).animate({top: 0}, 400).addClass('pop-in');
            },
            computePosition: function(){
                var w = $(window).width(),
                    h = $(window).height(),
                    config = this.config,
                    imgData = this.imgData,
                    setW = Math.min(w-this.config.spacing*2, imgData.width),
                    setH = Math.min(h-this.config.spacing*2, imgData.height);
                // 防止图片变形
                if( setW / setH < imgData.ratio ){
                    // 宽度被拉伸
                    setH = setW / imgData.ratio;
                }
                if( setW / setH > imgData.ratio ){
                    setW = setH * imgData.ratio;
                }
                this.dominstance.modal.css({ left: Math.abs(setW-w)/2,
                    top: Math.abs(setH-h)/2,
                    width: setW,
                    height: setH });
            },
            loadImg: function(){
                var dfd = $.Deferred(),
                    img = new Image()
                    that = this;
                img.src = this.imgData.src;
                img.onload = function(){
                    that.imgData.width = img.width;
                    that.imgData.height = img.height;
                    that.imgData.ratio = img.width/img.height;
                    that.computePosition();
                    dfd.resolve();
                }
                img.error = function(){
                    dfd.reject();
                }
                return dfd;
            },
            resetDom: function(){
                this.dominstance.modal.removeClass('animate-out');
            }
        },
        ready: function () {
        },
        computed: {
            modalLoc: function(){
                console.log(this);
                return {
                    'test': this.$options.methods.computePosition()
                };
            }
        }
    })
    popimg.init();
})