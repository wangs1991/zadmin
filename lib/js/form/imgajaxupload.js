/**
 * 
 *图片上传 控件
 * 
 * */
window.ImgUp = (function () {
    var imgup = {
        init: function () {
            this.wrapAllImgUp();
            this.layout();
            this.viewImg();

        }, initEvent: function () {

        },
        layout: function () {
            loadJs("http://static.ws.kukuplay.com/common/lib/ajaximg/ajaxupload.js", function () {
                imgup.bindAllImgUp();
            })
        },
        wrapAllImgUp: function () {
            $(".zy-imgup").each(function () {
                imgup.wrapImgUp($(this));
            })
        },
        wrapImgUp: function (el) {
            $(el).wrap("<div class='zyform-up-wrap'></div>");
//            var eyeicon = $('<i class="fa fa-eye zyadmin-eyeicon"></i>')
//            var upbtn = $('<i class="fa fa-cloud-upload zyadmin-upicon"></i>')
            var eyeicon = $('<i class="iconfont icon-eye f12 zyadmin-eyeicon"></i>')
            var upbtn = $('<i class="iconfont icon-upload f12 zyadmin-upicon"></i>')
            $(el).parent().append(eyeicon).append(upbtn);
        },
        bindAllImgUp: function () {
            $(".zyform-up-wrap .zyadmin-upicon").each(function () {
                imgup.bindImgUp($(this));
            })
        },
        bindImgUp: function (el) {
            window.UpConf = window.UpConf || {};
            var url = UpConf["upurl"] || "/picture/multiupload";
            var retimg = UpConf["returl"] || "origin";
            var fun = UpConf["success"];
            if (url != null && url.length > 0) {
                new AjaxUpload(el, {
                    action: url,
                    name: 'upfile',
                    data: ({maxWidth: "120", maxHeight: "120"}),
                    dataType: 'json',
                    autoSubmit: true,
                    onSubmit: function (file, ext) {
                    },
                    onComplete: function (file, retobj) {
                        console.log("上传回调:" + retobj)
                        if (typeof retobj == "string") {
                            try {
                                retobj = JSON.parse(retobj);
                            }
                            catch (e) {
                                console.log("返回数据转换为对象失败。。。", retobj)
                            }
                        }
                        if (retobj != null) {
                            if (retobj instanceof Array) {//数组处理多图片上传
                                for (var i in retobj) {
                                    var obj = retobj[i]
                                    var img = obj[retimg]//原始图 字段
                                    var url = img["url"];
                                    $(el).parent().find("input").val(url);
                                }
                            }
                            else { // 单图片上传接口
                                var imgurl = retobj[retimg]//原始图 字段
                                if (imgurl instanceof Array) {//返回数组 取第一个图片地址
                                    if (imgurl != null && imgurl.length > 0) {
                                        $(el).parent().find("input").val(imgurl[0]);
                                    }
                                }
                                else if (typeof imgurl == "string") {
                                    $(el).parent().find("input").val(imgurl);
                                }
                            }
                            if (typeof fun == "function") {
                                fun(retobj, $(el).parent().find("input"))
                            }
                        }
                        else {
                            alert("返回数据为空")
                        }
                    }
                });
            }
        },
        viewImg: function () {
            $(document).on("mouseenter", ".zyadmin-eyeicon", function () {
                var imgurl = $(this).parent().find("input").val();
                if (imgurl.match(/(http[s]?|ftp):\/\/[^\/\.]+?\..+(\w|\/)$/i) == null) {
                    return false
                }
                if ($(this).parent().find(".viewimg").length) {
                    $(this).parent().find(".viewimg").attr("src", imgurl).show();
                } else {
                    $(this).parent().append("<img class='viewimg' src='" + imgurl + "'/>")
                    $(this).parent().find("img").show();
                }
            })
            $(document).on("mouseleave", ".zyform-up-wrap", function () {
                $(this).parent().find(".viewimg").hide();
            })
        }
    }
    var loadJs = function (src, fun) {
        var script = null;
        script = document.createElement("script");
        script.type = "text/javascript";
        if (typeof fun === "function") {
            script.onload = script.onreadystatechange = function () {
                var r = script.readyState;
                if (!r || r === 'loaded' || r === 'complete') {
                    script.onreadystatechange = null;
                    fun();
                }
            };
        }
        script.src = src;
        document.getElementsByTagName("head")[0].appendChild(script);
    };
    return imgup;
})()
$(function () {
    ImgUp.init();
})
