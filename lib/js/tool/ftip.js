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
                    var desc = $(this).attr("data-desc") || "content";
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