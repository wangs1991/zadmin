
window.Zimgmask = {
    init: function () {
        this.cstyle();
        this.initEvent();
        this.cpage();
    },
    cstyle: function () {
        var imagestyle = {
            ".maskimg": {
                "cursor": "pointer",
                color: "#ba8bdc"
            },
            ".zmaskpanel": {
                position: "fixed",
                width: "100%",
                top: "0px",
                bottom: "0px",
                "z-index": "1000",
                background: "rgba(0,0,0,0.65)",
                display: " none",
                ".image-info": {
                    position: "absolute",
                    height: "40px",
                    width: "100%",
                    top: "-40px",
                    color: "whitesmoke",
                    "font-size": "12px",
                    "text-align": "center",
                    " padding-bottom": "0px",
                    ".link": {
                        color: "whitesmoke",
                        "&:hover": {
                            color: "#ef4545"
                        }
                    },
                },
                ".mask-image": {
                    position: "fixed",
                    left: "50%",
                    top: "50%",
                    border: "1px solid #000000",
                    ".imagescroll": {
                        position: "relative",
                        ".img": {
                            "max-width": "100%"
                        }
                    },
                },
                ".mask-image-close ": {
                    position: "absolute",
                    "z-index": "10",
                    height: "30px",
                    width: "30px",
                    " line-height": "150px",
                    overflow: "hidden",
                    background: "#ff6464",
                    "border-radius": "50%",
                    right: "-15px",
                    top: "-15px",
                    ".zimgclose": {
                        display: "block",
                        height: "30px",
                        width: "30px",
                        overflow: "hidden",
                        cursor: "pointer",
                        "text-align": "center",
                        "line-height": "26px",
                        opacity: "1",
                        "color": "#fff",
                        "font-size": "30px"
                    }
                },
            }
        };
        CssTool.makstyle(imagestyle)
    }, cpage: function () {
       var dom = zen("div.zmaskpanel>div.mask-image>div.image-info+div.mask-image-close");
        var imageinfo = $(dom).find(".image-info");
        imageinfo.zen("p+a.link");
        $(imageinfo).find("a").attr("href", "").attr("target", "_blank");
        var maskimage = $(dom).find(".mask-image");
        maskimage.zen("div.imagescroll>img");
        $(maskimage).find("img").attr("src", "");
        var imageclose = $(dom).find(".mask-image-close");
        imageclose.zen(".zimgclose");
        $(imageclose).find(".zimgclose").attr("onclick", "jQuery('.zmaskpanel').fadeOut()").html("×");
        $("body").append(dom)
    },
    initEvent: function () {
        $(".maskimg").on("click", function (e) {
            var link = $(this).attr("_link") || $(this).html();
            Zimgmask.changeImage(link);
        });
    }, changeImage: function (link) {
        $('.mask-image img').remove();
        var _w = $(window).width() - 200;
        var _h = $(window).height() - 100;
        var img = new Image();
        img.src = link;
        img.onload = function () {
            $(img).addClass("img")
            var img_size = img.height.toString() + "*" + img.width;
            $('.image-info p ').html('图片尺寸：' + img_size).css({"margin": "0px"});
            $('.image-info a ').attr("href", link).html('图片地址：' + link);
            if (img.width <= _w)
            {
                $('.mask-image ').css('width', img.width).css('height', img.height).css('margin-left', -img.width / 2).css('margin-top', -img.height / 2);
                $('.imagescroll ').css('width', img.width);
                $('.mask-image img').css('width', img.width).css('height', img.height);
                if (img.height >= _h)
                {
                    $('.mask-image ').css('height', _h).css('margin-top', -(_h) / 2);
                    $('.imagescroll ').css('height', _h);
                    $('.imagescroll').css('overflow-y', 'auto');
                    $('.imagescroll').css('overflow-x', 'hidden');
                }
            } else
            {
                $('.mask-image ').css('width', _w).css('height', img.height).css('margin-left', -_w / 2).css('margin-top', -img.height / 2);
                $('.imagescroll ').css('width', _w);
                $('.mask-image img').css('width', _w).css('height', img.height);
                if (img.height >= _h)
                {
                    $('.mask-image ').css('height', _h).css('margin-top', -(_h) / 2);
                    $('.imagescroll ').css('height', _h);
                    $('.imagescroll').css('overflow-y', 'auto');
                    $('.imagescroll').css('overflow-x', 'hidden');
                }
            }
            $('.mask-image .imagescroll').append(img);
        };
        img.src = link;
        $('.zmaskpanel').fadeIn();
    }
};
$(function () {
    Zimgmask.init();
});