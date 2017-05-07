/**
 * 章鱼tv 后端 渲染核心模块
 * @hongyu
 * @qq：249398279
 * @version v3.0
 * */
var Admins = (function () {
    var admin = {
        init: function () {
            this.load();
            this.layout();
            this.initEvent();
        },
        layout: function () {
            this.timePicker();
            //延时加载==========datatable===============
            setTimeout(function () {
                $('#table,#example').length && $('#table,#example').dataTable({
                    "iDisplayLength": 100,
                    "sScrollX": "100%",
                    "sScrollXInner": "100%",
                    "aLengthMenu": [100, 200, 300]});
                $('#table10').length && $('#table10').dataTable({
                    "iDisplayLength": 10,
                    "aLengthMenu": [[10, 20, 50, 100], [10, 20, 50, 100]],
                    "sScrollX": "100%",
                    "sScrollXInner": "100%"
                });
            }, 500)
        },
        timePicker: function () {
            $(".time").each(function () {
                var time = $(this).attr("time");
                if (Ut) {
                    var str = Ut.getTimeTostr(time)
                    $(this).html(str);
                }
            })
            try {
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
                $(".timepicker").datetimepicker();
            }
            catch (e) {

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
                    admin.cpage(AdminPage);
                    admin.cRightPage();
                } else {
                    var url = window.CONF_URL;
                    if (Ut.Null(url)) {
                        url = "/zyadmin/link/adminlink";
                    }
                    $.ajax({
                        url: url,
                        type: "post",
                        data: ({}),
                        dataType: "json",
                        success: function (ret) {
                            admin.cpage(ret);
                            Admins.cRightPage();
                        }
                    })
                }
            }
//            this.cRightPage();
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
                if (window.HOME_LINK) {
                    topnav.find("a").attr("href", window.HOME_LINK)
                }
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
                        $(col).find(".col-title").html(taglink[i].name);
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
                if (topdata["tag"] == null) {
                    continue;
                }
                for (var n = 0; n < topdata["tag"].length; n++) {
                    var tagdata = topdata["tag"][n]
                    if (tagdata["links"] == null) {
                        continue;
                    }
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
                        else {
                            if (linkitem["item"] != null) {
                                for (var j in linkitem["item"]) {
                                    if (linkitem["item"][j] == pathname || "http://" + host + linkitem["item"][j] == href) {
                                        ctop = topdata["name"];
                                        ctag = tagdata["name"];
                                        clink = linkitem["name"];
                                        ret["ctop"] = ctop
                                        ret["ctag"] = ctag
                                        ret["clink"] = clink
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return ret;
        }, cRightPage: function () {
            if (window.AdminRightPage) {
                var r = zen("div.topbar-right")
                for (var i in AdminRightPage) {
                    var btn = zen("a.link")
                    var name = AdminRightPage[i].name
                    var url = AdminRightPage[i].url
                    var cla = AdminRightPage[i].cla
                    $(btn).html(name)
                    if (url != null) {
                        $(btn).attr("href", url);
                    }
                    $(btn).addClass(cla)
                    $(r).append(btn)
                }
                $(".topbar").append($(r))
            }
        }
    }
    var ret = {
        init: function () {
            admin.init();
        },
        cRightPage: function () {
            admin.cRightPage();
        }
    }
    return ret;
})();
$(document).ready(function () {
//    Admins.init();
    if (window.zadmin) {
//        zadmin.init();
    }
})