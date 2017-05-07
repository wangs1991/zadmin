var Ut = (function () {
    Ut = {
        getParam: function (key) {
            var search = window.location.search;
            var param = {}
            var arry = search.replace("?", "").split("&")
            for (var i in arry) {
                var item = arry[i]
                param[item.split("=")[0]] = item.split("=")[1]
            }
            if (key != null) {
                return param[key];
            }
            else {
                return param;
            }
        }, gettime: function (str) {
            var ret = null;
            if (str == null || str.length == 0) {
                return;
            }
            var arry = str.split(" ");
            if (arry != null && arry.length > 1) {
                var dayarry = (arry[0] || "-").split("-");
                var y = dayarry[0];
                var M = Number(dayarry[1]) - 1;
                var d = dayarry[2]
                var harry = arry[1].split(":");
                var h = harry[0];
                var m = harry[1];
                ret = new Date(y, M, d, h, m).getTime();
            }
            return ret;
        }, Null: function (e) {
            return e == null || e == "" || e.length == 0;
        }, isURL: function (str) {
            if (str.match(/(http[s]?|ftp):\/\/[^\/\.]+?\..+(\w|\/)$/i) == null) {
                return false
            }
            else {
                return true;
            }
        },
        getTimeTostr: function (time) {
            var str = "";
            var time = (Number(time) || -1)
            if (time > 0) {
                var date = new Date(time)
                var M = (date.getMonth() + 1);
                M = M < 10 ? "0" + M : M;
                var D = (date.getDate());
                D = D < 10 ? "0" + D : D;
                var H = (date.getHours());
                H = H < 10 ? "0" + H : H;
                var m = (date.getMinutes());
                m = m < 10 ? "0" + m : m;
                str = date.getFullYear() + "-" + M + "-" + D + " " + H + ":" + m
            }
            return str;
        },
        search: function (key, value) {
            var param = Ut.getParam();
            param[key] = value;
            var array = [];
            for (var keys in param) {
                if (keys != null && keys.length > 0) {
                    array.push(keys + "=" + param[keys]);
                }
            }
            var str = array.join("&");
            return str;
        }
    }
    return Ut;
})();
/**
 * @version 1.0
 * @description 第一版实现基础解析，暂时不支持
 * @author hongyu.gong
 * @date 2015-11-6
 * */
var CssTool = {
    makstyle: function (styleobj) {
        var stylestr = this.getstyle(styleobj);
        $('<style type="text/css">' + stylestr + '</style>').appendTo("head");
    },
    getstyle: function (styleobj) {
        var retstr = "";
        var styarray = this._getstyleArray(styleobj)
        for (var i = 0; i < styarray.length; i++) {
            var styles = styarray[i];
            for (var j = styles.length - 1; j >= 0; j--) {
                var style = styles[j];
                for (var ids in style) {
                    var idksys = ids.replace(/[#]/gi, " #").replace(/[\.]/gi, " .").replace(/&\s/gi, "&").replace(/&/gi, "")
                    var str = style[ids];
                    retstr += idksys + "{" + str + "}";
                }
            }
        }
        retstr = retstr.replace(/^\s/gi, "")
        return retstr;
    },
    _getstyleArray: function (obj) {
        var array = [];
        for (var key in obj) {
            var ret = this._getyles(key, obj[key]);
            array.push(ret);
        }
        return array;
    },
    _getyles: function (key, pa) {
        var array = [];
        var ret = [];
        getstyle(key, pa);
        function getstyle(perfix, obj) {
            var tmp = {}
            for (var key in obj) {
                if (/[#\.&]/gi.test(key) && (typeof obj[key] == "object")) {
                    getstyle(perfix + key, obj[key]);
                } else {
                    tmp[perfix] = (tmp[perfix] || "") + key + ":" + obj[key] + ";";
                }
            }
            array.push(tmp)
        }
        return array
    }
};
/**
 * @author ghy
 * @desc zen 模版基础类库
 * @contact qq 249398279
 * */
jQuery.fn.zen = function (selector, callback) {
    var $this = $(this);
    if (typeof selector == undefined)
        return $this;
    selector.replace(/^([^>+]+)(([>+])(.*))?/, function ($0, instruction, $1, operator, subSelector) {
        instruction.replace(/^([^*]+)(\*([0-9]+))?/, function ($0, tag, multiplier, factor) {
            if (factor == undefined)
                factor = 1;
            if (factor < 1)
                factor = 1;
            var tagName = tag.match(/[^.#]+/)[0];
            for (var i = 1; i <= factor; i++) {
                var el = $('<' + tagName + '>');
                tag.replace(/([.#])([^.#]+)/g, function ($0, kind, name) {
                    if (kind == '#') {
                        el.attr('id', name);
                    } else if (kind == '.') {
                        el.addClass(name);
                    }
                });
                $this.append(el);
                if (operator == undefined) {
                    if (callback != undefined)
                        jQuery.each([el], callback);
                } else if (operator == '+') {
                    $this.zen(subSelector, callback);
                } else if (operator == '>') {
                    el.zen(subSelector, callback);
                }
            }
        });
    });
    return $(this);
}
window.zen = function (selector, callback) {
    var dom = $("<span>").zen(selector, callback).html();
    return  $(dom);
}
/**
 * @author ghy
 * @desc tip 小插件，针对后端，报名之类的表格数据特别多，影响布局的页面
 * @contact qq 249398279
 * */
window.fytip = (function ($) {
    var instance;
    var inlock = false;
    var flock = false;
    var fytip = {
        init: function () {
            this.layout();
            this.initEvent();
        },
        layout: function () {
            var style = {
                ".fy-slide-tip": {
                    position: "fixed",
                    padding: "5px",
                    "z-index": "1000",
                    "font-size": "12px",
                    "line-height": "1.4",
                    opacity: "0.95",
                    top: "0px",
                    ".arrow": {
                        "position": "absolute",
                        width: "0",
                        height: "0",
                        "border-color": "transparent",
                        "border-style": "solid",
                        "border-width": "5px 5px 5px 5px",
                        "&.top-arrow": {
                            left: "50%",
                            bottom: "-5px",
                            "margin-left": "-5px",
                            "border-top-color": "#425160"
                        },
                        "&.right-arrow": {
                            top: "50%",
                            left: "-5px",
                            "margin-top": "-5px",
                            "border-right-color": "#425160"
                        }
                    },
                    ".tip-inner": {
                        "max-width": "400px",
                        "padding": "12px 8px",
                        color: "#fff",
                        "text-align": "center",
                        "text-decoration": "none",
                        "border-radius": "0",
                        background: "#163342"
                    }
                }
            }
            if ($(".fy-tip").length) {
                CssTool.makstyle(style);
            }
        },
        initEvent: function () {
            $(".fy-tip").on({mouseenter: function () {
                    inlock = true;
                    var tip = $(_this.getSinleton());
                    var top = $(this).offset().top;
                    var left = $(this).offset().left;
                    var w = $(this).innerWidth();
                    var h = $(this).innerHeight();
                    var type = $(this).attr("data-tip") || "top";
                    var desc = $(this).attr("data-desc");
                    if (desc == "content") {
                        desc = $(this).html();
                    }
                    _this.reset();
                    tip.find(".arrow").addClass(type + "-arrow");
                    tip.find(".tip-inner").html(desc);
                    var sw = tip.width();
                    var sh = tip.height();
                    if (type == "top") {
                        tip.css({left: (left - (sw - w + 5) / 2), top: (top - sh - 10)});
                    }
                    if (type == "right") {
                        tip.css({left: (left + w + 2), top: (top - (sh - h) / 2 - 5)});
                        tip.addClass("")
                    }
                    tip.show();
                },
                mouseleave: function () {
                    inlock = false;
                    setTimeout(function () {
                        if (!inlock && !flock) {
                            var tip = $(_this.getSinleton());
                            tip.hide();
                        }
                    }, 50)
                }
            })
            $(document).on("mouseenter", ".fy-slide-tip",
                    function () {
                        flock = true;
                    })
            $(document).on("mouseleave", ".fy-slide-tip",
                    function () {
                        flock = false;
                        var tip = $(_this.getSinleton());
                        tip.hide();
                    })
        },
        reset: function () {
            var arrow = $(_this.getSinleton()).find(".arrow");
            arrow.removeClass("top-arrow")
            arrow.removeClass("right-arrow")
            arrow.removeClass("left-arrow")
            arrow.removeClass("bottom-arrow")
        },
        getSinleton: function () {
            function getInstance() {
                if (instance == null) {
                    instance = new createTip();
                }
                return instance;
            }
            function createTip() {
                var tip = document.createElement("div");
                $(tip).addClass("fy-slide-tip");
                $(tip).append($('<div class="arrow"></div>'));
                $(tip).append($('<div class="tip-inner"></div>'))
                $("body").append(tip);
                return tip;
            }
            return getInstance();
        }
    }
    var _this = fytip;
    return fytip;
})($);
$(document).ready(function () {
    fytip.init();
})
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
/**
 * 章鱼tv 后端 渲染核心模块
 * @hongyu
 * @qq：249398279
 * @version v2.8
 * */
var Admins = (function () {
    var admin = {
        init: function () {
            this.load();
            this.layout();
            this.initEvent();
        },
        layout: function () {
            $(".time").each(function () {
                var time = $(this).attr("time");
                if (Ut) {
                    var str = Ut.getTimeTostr(time)
                    $(this).html(str);
                }
            })
            var start = $("#start-time").attr("start") || Ut.getParam("start");
            var end = $("#end-time").attr("end") || Ut.getParam("end");
            if (start != null) {
                if (start.length == 10) {
                    start = Number(start) * 1000
                }
                var start = new Date(Number(start));
                var str = Ut.getTimeTostr(start)
                $("#start-time").val(str);
            }
            if (end != null) {
                if (end.length == 10) {
                    end = Number(end) * 1000
                }
                var end = new Date(Number(end));
                var str2 = Ut.getTimeTostr(end)
                $("#end-time").val(str2);
            }

        },
        initEvent: function () {
            $("table").on("click", ".trup", function () {
                var parent = $(this).parent().parent();
                var brother = $(parent).prev();
                brother.before(parent);
            });
            $("table").on("click", ".trdown", function () {
                var parent = $(this).parent().parent();
                var brother = $(parent).next();
                brother.after(parent);
            });
            $("table").on("click", ".trdel", function () {
                var parent = $(this).parent().parent();
                parent.remove();
            });
            $(".nav-tabs").on("click", "li a", function () {
                $(this).parent().parent().find(".active").removeClass("active");
                $(this).parent().addClass("active");
                var _id = $(this).attr("data-id");
                $(".nav-content").removeClass("active");
                $("#" + _id).addClass("active");
            })
        },
        load: function () {
            if ($(".topbar").length == 0) {
                if ((typeof AdminPage != "undefined") && AdminPage != null) {
                    setTimeout(function () {
                        admin.cpage(AdminPage);
                    }, 10)
                } else {
                    $.ajax({
                        url: "/api/getadminpagelink",
                        type: "post",
                        data: ({}),
                        dataType: "json",
                        success: function (ret) {
                            admin.cpage(ret);
                        }
                    })
                }
            }
        },
        cpage: function (data) {
            //布局页面
            if (data) {
                //========读取变量============
                var ctop = "";
                var ctag = ""
                var clink = ""
                //检查配置
                if (typeof AdminConf != "undefined") {
                    ctop = AdminConf["top"];
                    ctag = AdminConf["tag"];
                    clink = AdminConf["link"];
                }
                else {
                    var ret = admin.getCurrentPage(data)
                    ctop = ret["ctop"];
                    ctag = ret["ctag"];
                    clink = ret["clink"];
                }
                //==========创建 导航框架=============
                var topnav = zen("div.topbar>div.topbar-left.left-home>a>i.fa.fa-home.fa-3x");
                var navbar = zen("div.topbar-left")
                topnav.append(navbar);
                topnav.find("a").attr("href", "/admin")
                $("body").prepend(topnav);
                //===============包裹 内容页面 ===================
//                $("#content").wrap("<div class='main-content'><div class='content-inner left-content'><div class='content-body'></div></div></div>")
                $("#content").wrap(zen("div.main-content>div.content-inner.left-content>div.content-body"))
                //========一级导航=========
                var mainContent = $(".main-content");
                mainContent.zen("div.left-slide-bar>ul")
                var leftSlide = mainContent.find(".left-slide-bar");
                //========二级导航=========
                var inner = $(".content-inner");
                inner.zen("div.inner-slide-bar>div.list")
                var innerSlide = inner.find(".inner-slide-bar");
                //========添加页面=============
                var topdata = null;
                for (var i in data) {
                    //===========添加导航链接==============
                    var topitem = data[i]
                    var name = topitem["name"];
                    var url = topitem["url"];
                    var navitem = $("<div><a href='" + url + "'><span></span></a></div>");
                    navitem.addClass("topbar-nav-btn");
                    navitem.find("a").attr("src", url);
                    navitem.find("span").html(name);
                    $(navbar).append(navitem);
                    if (name == ctop) {
                        topdata = topitem;
                        navitem.addClass("active")
                    }
                    //=======添加悬浮提示导航=======
                    var dropmenu = zen("div.dropdown-menu");
                    var taglink = topitem["tag"] || [];
                    for (var i = 0; i < taglink.length; i++) {
                        var col = zen("div.topbar-nav-col>div.col-title+ul");
                        var links = taglink[i]["links"] || [];
                        for (var m = 0; m < links.length; m++) {
                            var src = links[m]["url"];
                            var name = links[m]["name"];
                            var link = $("<li ><a href='" + src + "'>" + name + "</a></li>");
                            $(col).find("ul").append(link);
                        }
                        dropmenu.append(col);
                    }
                    navitem.append(dropmenu);
                }
                //=============添加一级导航 链接============
                var tagdata = null;
                if (topdata != null && topdata["tag"] != null) {
                    for (var n = 0; n < topdata["tag"].length; n++) {
                        var liitem = topdata["tag"][n]
                        var li = $("<li><a href='" + liitem["url"] + "'>" + liitem["name"] + "</a></li>")
                        leftSlide.find("ul").append(li)
                        if (liitem["name"] == ctag) {
                            li.addClass("active");
                            tagdata = liitem;
                        }
                    }
                }
                //============添加二级导航 链接=============
                if (tagdata != null && tagdata["links"] != null && tagdata["links"].length > 0) {
                    var ul = $("<ul></ul>")
                    var title = tagdata["title"] || name
                    for (var i = 0; i < tagdata["links"].length; i++) {
                        var linkitem = tagdata["links"][i];
                        var link = $("<li><a href='" + linkitem["url"] + "'><div class='link'>" + linkitem["name"] + "</div></a></li>")
                        ul.append(link)
                        if (linkitem["name"] == clink) {
                            link.find("a").addClass("current");
                        }
                    }
                    innerSlide.find(".list").append(ul)
                    innerSlide.append("<div class='title'>" + title + "</div>")
                }
            }
        },
        getCurrentPage: function (data) {
            var pathname = window.location.pathname;
            var href = window.location.href;
            var host = window.location.host;
            var ctop = ""
            var ctag = "";
            var clink = "";
            var ret = {};
            for (var i in data) {
                var topdata = data[i]
                for (var n = 0; n < topdata["tag"].length; n++) {
                    var tagdata = topdata["tag"][n]
                    for (var m = 0; m < tagdata["links"].length; m++) {
                        var linkitem = tagdata["links"][m]
                        if (linkitem["url"] == pathname || "http://" + host + linkitem["url"] == href) {
                            ctop = topdata["name"];
                            ctag = tagdata["name"];
                            clink = linkitem["name"];
                            ret["ctop"] = ctop
                            ret["ctag"] = ctag
                            ret["clink"] = clink
                        }
                    }
                }
            }
            return ret;
        }
    }
    var ret = {
        init: function () {
            admin.init();
        }
    }
    return ret;
})();
$(document).ready(function () {
    Admins.init();
})