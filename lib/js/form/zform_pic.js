/* 
 * @后端通用弹窗模版 v1
 * 探索脚步从未停止
 * @author ghy;
 * @contact qq:249398279
 */
window.zform = (function () {
    var tmpfun;
    var zform = {
        init: function () {
            zform.initEvent();
        }, initEvent: function () {
            $(document).on("click", ".add-dyn", function () {
                var tmp = $(this).parent().find(".dyn-tmp").clone().removeClass("dyn-tmp");
                $(this).parent().find(".dyn-list").append(tmp)
            })
            $(document).on("click", ".up-dyn", function () {
                var parent = $(this).parent();
                var brother = $(parent).prev();
                brother.before(parent);
            })
            $(document).on("click", ".del-dyn", function () {
                var parent = $(this).parent();
                parent.remove();
            })
            //==============close===========
            $(document).on("click", ".z-form .close,.z-form .cancel", function () {
                $(".zform-cover").hide();
                tmpfun = null;
            })
            //===========save 获取数据=======
            $(document).on("click", ".z-form .save", function () {
                zform.save();
            })
        }, bindEvent: function () {

        }, save: function () {
            var data = zform.getData();
            console.log(JSON.stringify(data));
            if (tmpfun != null && typeof tmpfun == "function") {
                tmpfun(data)
            }

        }, getData: function () {
            var data = {};
            $(".z-form .form .item").each(function () {
                var type = $(this).data("ftype") || "text"
                var key = $(this).data("fkey")
                if (key != null && key.length > 0) {
                    //普通input
                    if (type == "text") {
                        var value = ($(this).find("input").val() || "").trim();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //下拉列表
                    if (type = "select") {
                        var value = $(this).find("select").val();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //radio
                    if (type = "radio") {
                        var name = $(this).find("input[type='radio']").attr("name");
                        var value = $(this).find("input[name='" + name + "']").val();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //textarea
                    if (type = "textarea") {
                        var value = $(this).find("textarea").val();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //checkbox
                    if (type = "checkbox") {
                        var checkret = [];
                        $(this).find("input[type='checkbox']:checked").each(function () {
                            var value = $(this).val();
                            checkret.push(value);
                        })
                        if (checkret.length > 0) {
                            data[key] = checkret;
                        }
                    }
                    //dyn list(动态列表)
                    if (type = "dynlist") {
                        var array = zform.getDynlist($(this));
                        if (array.length > 0) {
                            data[key] = array;
                        }
                    }
                }
            })
            return data;
        },
        getDynlist: function (el) {
            var retarray = [];
            $(el).find(".dyn-list .dyn-item").each(function () {
                var map = {};
                var haskey = false;
                $(this).find("input").each(function () {
                    var key = $(this).attr("key");
                    var value = $(this).val();
                    if (key != null && value != null && value.length > 0) {
                        map[key] = value;
                        haskey = true;
                    }
                })
                if (haskey) {
                    retarray.push(map);
                }
            })
            return retarray;
        }, cform: function (data, fun) {
            if (typeof fun == "function") {
                tmpfun = fun
            }
            cform.cform(data);
        }, eform: function (el, data, fun) {
            if (typeof fun == "function") {
                tmpfun = fun
            }
            cform.eform(el, data);
        }
    }
    return zform;
})();
window.cform = (function () {
    var instance;
    var cform = {
        //创建表单
        cform: function (data) {
            var form = _this.getSinleton();
            var panel = $(form).find(".form");
            $(panel).empty();
            for (var key in data) {
                var item = data[key];
                if (item != null) {
                    var type = item["type"];
                    if (type == "text") {
                        var item = _this._getText(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "radio") {
                        var item = _this._getRadio(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "checkbox") {
                        var item = _this._getCheckbox(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "textarea") {
                        var item = _this._getTextArea(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "dynlist") {
                        var item = _this._getDynlist(data[key], key);
                        $(panel).append(item);
                    }

                }

            }

            //=============功能按钮============
            var opwrap = zen("div.item.save-wrap>div.btn.btn-default.cancel+div.btn.btn-success.save");
            $(opwrap).find(".cancel").html("取消")
            $(opwrap).find(".save").html("保存")
            $(panel).append(opwrap);
            //=============显示panel===========
            $(form).show();
        },
        //编辑表单
        eform: function (el, data, fun) {
            var tmpdata = {};
            $(el).find("td").each(function () {
                var key = $(this).data("key");
                var value = $(this).data("value");
                if (key != null && key.length > 0) {
                    for (var tmpkey in data) {
                        if (tmpkey == key) {
                            tmpdata[key] = data[key];
                            if (/^\[/gi.test(value)) {
                                try {
                                    tmpdata[key]["value"] = eval(value);
                                }
                                catch (e) {
                                    console.log("td数据转换出错", el)
                                }
                            }
                            else {
                                tmpdata[key]["value"] = value;
                            }
                            break;
                        }
                    }
                }
            })
            cform.cform(tmpdata);
        },
        _getText: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var value = item["value"];
            var dom = zen("div.item>label");
            $(dom).attr("data-ftype", "text");
            $(dom).attr("data-fkey", key);
            $(dom).find("label").html(name + "：");
            $(dom).append($("<input type='text' value='" + (value || "") + "'/>"));
            return $(dom);
        },
        /**
         * item: {type: "radio", check: [{name: "男", value: "1"}]},
         * */
        _getRadio: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var rlist = item["check"]
            var defvalue = item["value"];
            var dom = zen("div.item.check-item>label");
            $(dom).attr("data-ftype", "radio");
            $(dom).attr("data-fkey", key);
            for (var i in rlist) {
                var t = rlist[i];
                var name = t["name"];
                var value = t["value"];
                var l = $("<label>" + name + "：</label>");
                if (defvalue == value) {
                    var c = $("<input type='radio' name='" + key + "' value='" + value + "' checked/>");
                }
                else {
                    var c = $("<input type='radio' name='" + key + "' value='" + value + "'/>");
                }
                $(dom).append(l);
                $(dom).append(c);
            }
            return $(dom);
        },
        _getCheckbox: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var rlist = item["check"]
            var defvalue = item["value"];
            if (typeof defvalue == "string") {
                defvalue = JSON.parse(defvalue);
            }
            var dom = zen("div.item.check-item>label");
            $(dom).attr("data-ftype", "checkbox");
            $(dom).attr("data-fkey", key);

            for (var i in rlist) {
                var t = rlist[i];
                var name = t["name"];
                var value = t["value"];
                var b = $("<label>" + name + "：</label>")
                var c = $("<input type='checkbox' value='" + value + "'/>");
                for (var m in defvalue) {
                    if (defvalue[m] == value) {
                        c.attr("checked", "true");
                    }
                }
                $(dom).append(b);
                $(dom).append(c);
            }
            return $(dom);
        },
        _getTextArea: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var value = item["value"];
            var dom = zen("div.item>label");
            $(dom).attr("data-ftype", "textarea");
            $(dom).attr("data-fkey", key);
            $(dom).find("label").html(name + "：");
            $(dom).append($("<textarea>" + (value || "") + "</textarea>"));
            return $(dom);
        },
        _getDynlist: function (item, key, value) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var list = item["list"];
            var defvalue = item["value"];

            if (list != null && list.length > 0) {
                var dom = zen("div.item>label+div.dyn-list");
                $(dom).attr("data-ftype", "dynlist");
                $(dom).attr("data-fkey", key);
                $(dom).find("label").html(name + "：");
                var add_btn = zen("span.op-btn.add-dyn>i.fa.fa-plus-square.fa-1x")
                $(dom).append(add_btn);
                var listpanel = $(dom).find(".dyn-list");
                var tmp_item = zen("div.dyn-item.dyn-tmp>span.op-btn.del-dyn+span.op-btn.up-dyn")
                $(tmp_item).find(".del-dyn").append(zen("i.fa.fa-trash-o.fa-1x"))
                $(tmp_item).find(".up-dyn").append(zen("i.fa.fa-arrow-up.fa-1x"));
                $(dom).append(tmp_item);
                for (var i in list) {
                    var name = list[i]["name"];
                    var tkey = list[i]["key"];
                    var b = $("<label>" + name + "：</label>");
                    var c = $($("<input type='text' key='" + tkey + "'>"));
                    $(tmp_item).append(b);
                    $(tmp_item).append(c);
                }
                for (var n in defvalue) {
                    var c_item = zen("div.dyn-item>span.op-btn.del-dyn+span.op-btn.up-dyn")
                    var item = defvalue[n];
                    for (var ckey in item) {
                        var b = $("<label>" + ckey + "：</label>");
                        var c = $($("<input type='text' key='" + item[ckey]["key"] + "'  value='" + item[ckey]["value"] + "'>"));
                        $(c_item).append(b);
                        $(c_item).append(c);
                    }
                    $(c_item).find(".del-dyn").append(zen("i.fa.fa-trash-o.fa-1x"))
                    $(c_item).find(".up-dyn").append(zen("i.fa.fa-arrow-up.fa-1x"));
                    listpanel.append(c_item);
                }
                return dom;
            }
        },
        getSinleton: function () {
//            alert("sdfsd")
            function getInstance() {
                if (instance == null) {
                    instance = new createForm();
                }
                return instance;
            }
            function createForm() {
                var tip = document.createElement("div");
                $(tip).addClass("zform-cover");
                $(tip).append($('<div class="bk"></div>'));
                $(tip).append($('<div class="z-form"><div class="close">×</div><div class="form"></div>'))
                $("body").append(tip);
                return tip;
            }
            return getInstance();
        }
    };
    var _this = cform;
    return cform;
})()
$(function () {
    zform.init();
})


