//==============alert弹窗===========
var alertStyle = {
    "#zalert": {
        "display": "none",
        "font-family": "'微软雅黑'",
        "top": "0",
        left: "0",
        width: "100%",
        height: "100%",
        position: "fixed",
        "z-index": "99999"
    },
    "#zalert .bk": {
        opacity: "0.5",
        width: "100%",
        height: "100%",
        background: "#000",
        filter: "alpha(opacity=50)"
    },
    "#zalert .z-close": {
        position: "absolute",
        right: "8px",
        "font-size": "24px",
        top: "0px",
        color: "#B3B2B2",
        cursor: "pointer"
    },
    "#zalert .z-close:hover": {
        color: "#5F5A5A"
    },
    "#zalert .panel": {
        "background": "#FFF",
        "border-radius": "3px",
        "position": "fixed",
        "z-index": "99999999",
        width: "400px",
        "min-height": "100px",
        "padding": "15px 20px",
        "left": "50%",
        "top": "25%",
        "margin-left": "-200px"
    }
    ,
    "#zalert .info": {
        "margin": "30px auto",
        "text-align": "center",
        "font-size": "14px",
        height: "24px",
        "line-height": "24px",
        width: "100%"
    },
    "#zalert .zbtn": {
        "width": "60px",
        "border": "1px solid #df1155",
        "color": "#fff",
        "background-color": "#f71d65",
        "font-size": "14px",
        "text-align": "center",
        "cursor": "pointer",
        "margin": "0px auto 20px",
        "top": "25%",
        "padding": "2px 5px"
    },
    "#zalert .zbtn:hover": {
        "background-color": "#FD4884"
    }
}
window.zalert = (function () {
    var zalert = {
        init: function () {
            this.cstyle();
            this.initEvent();
            this.cpage();
        },
        cstyle: function () {
            $('<style type="text/css">' + zalert.getstyle(alertStyle) + '</style>').appendTo("head");
        },
        cpage: function () {
            var dom = zen("div#zalert>div.bk+div.panel");
            var panel = $(dom).find(".panel")
            panel.zen("div.title-wrap>div.z-title+div.z-close");
            panel.zen("div.content>div.info+div.zbtn");
            $(panel).find(".z-close").html("×")
            $(panel).find(".z-title").html("来自章鱼tv的提示")
            $(panel).find(".zbtn").html("确定")
            $("body").append(dom)
        },
        initEvent: function () {
            $(document).on("click", "#zalert .zbtn,#zalert .z-close", function () {
                $("#zalert").hide();
            })
        },
        alert: function (desc, title) {
            $("#zalert").fadeIn();
            $("#zalert .info").html(desc);
        },
        getstyle: function (obj) {
            var stylestr = getstyle(obj)
            function getstyle(obj) {
                var alls = ""
                for (var key in obj) {
                    //样式
                    if (/[#\.]/gi.test(key) && (typeof obj[key] == "object")) {
                        var style = obj[key];
                        var str = "";
                        for (var st in  style) {
                            str += st + ":" + style[st] + ";";
                        }
                        alls += key + "{" + str + "}";
                    }
                }
                return alls;
            }
            return(stylestr);
        }
    }
    $(document).ready(function () {
        zalert.init();
    })
    return function (desc, title) {
        zalert.alert(desc, title)
    };
})();