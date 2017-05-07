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
                $(this).parent().find(".dyn-list").append(tmp);
                //上传图片动态列表 特殊处理
                var ipt = $(tmp).find(".zy-imgup");
                if (ipt.length) {
                    ImgUp.wrapImgUp(ipt)
                    ImgUp.bindImgUp($(ipt).parent().find(".zyadmin-upicon"))
                }
                zform.resize();
            })
            $(document).on("click", ".add-zlist", function () {
                var tmp = $(this).parent().find(".list-tmp").clone().removeClass("list-tmp");
                $(this).parent().find(".z-list").append(tmp);
                zform.resize();
            })
            $(document).on("click", ".up-dyn,.up-zlist", function () {
                var parent = $(this).parent();
                var brother = $(parent).prev();
                brother.before(parent);
            })
            $(document).on("click", ".del-zlist,.del-dyn", function () {
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
            console.log("save data:", JSON.stringify(data));
            if (tmpfun != null && typeof tmpfun == "function") {

                tmpfun(data)
            } else {
                alert("callback is null")
            }

        }, getData: function () {
            var data = {};
            $(".z-form .form .item").each(function () {
                var type = $(this).data("ftype");
                var key = $(this).data("fkey")
                var dtype = $(this).attr("dtype");
                if (!Ut.Null(key)) {
                    //普通input
                    if (type == "text") {
                        var value = ($(this).find("input").val() || "").trim();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //普通input
                    else if (type == "time") {
                        var value = ($(this).find("input").val() || "").trim();
                        if (value != null && value.length > 0) {
                            try {
                                var times = Ut.gettime(value)
                                data[key] = times;
                            }
                            catch (e) {
                                alert(e)
                            }
                        }
                    }
                    //下拉列表
                    else if (type == "select") {
                        var value = $(this).find("select").val();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //radio
                    else if (type == "radio") {
                        var name = $(this).find("input[type='radio']").attr("name");
                        var value = $(this).find("input[name='" + name + "']:checked").val();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //textarea
                    else if (type == "textarea") {
                        var value = $(this).find("textarea").val();
                        if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //checkbox
                    else if (type == "checkbox") {
                        var checkret = [];
                        $(this).find("input[type='checkbox']:checked").each(function () {
                            var value = $(this).val();
                            checkret.push(value);
                        })
                        if (checkret.length > 0) {
                            data[key] = checkret;
                        }
                    }
                    //imgup 图片上传
                    else if (type == "imgup") {
                        var value = $(this).find("input").val(); //表单中默认字段
                        var cvalue = $(this).find("input").data("cvalue");// 图片上传 覆盖字段
                        if (cvalue != null) { //覆盖字段不为空，则提交覆盖字段
                            var obj = {};
                            if (typeof cvalue == "string") {
                                try {
                                    obj = eval(data);
                                } catch (e) {
                                }
                            } else {
                                obj = cvalue
                            }
                            data[key] = obj;
                        }
                        else if (value != null && value.length > 0) {
                            data[key] = value;
                        }
                    }
                    //dyn list(动态列表)
                    else if (type == "zlist") {
                        var array = zform.getZlist($(this), dtype);
                        if (array.length > 0) {
                            data[key] = array;
                        }
                    }
                    //dyn list(动态列表)
                    else if (type == "dynlist") {
                        var array = zform.getDynlist($(this));
                        if (array.length > 0) {
                            data[key] = array;
                        }
                    }
                }
            })

            return data;
        },
        getZlist: function (el, dtype) {
            var retarray = [];
            $(el).find(".z-list .zlist-item").each(function () {
                var val = $(this).find("input").val();
                if (!Ut.Null(dtype) && dtype == "number") {
                    val = Number(val) || null;
                } else {
                }
                if (!Ut.Null(val)) {
                    retarray.push(val);
                }
            })
            return retarray;
        },
        getDynlist: function (el) {
            var retarray = [];
            $(el).find(".dyn-list .dyn-item").each(function () {
                var map = {};
                var haskey = false;
                $(this).find("input").each(function () {
                    var key = $(this).attr("key");
                    var value = $(this).val();
                    // 图片上传 覆盖字段
                    var cvalue = $(this).data("cvalue");
                    if (cvalue != null) { //覆盖字段不为空，则提交覆盖字段
                        var obj = {};
                        if (typeof cvalue == "string") {
                            try {
                                obj = eval(cvalue);
                            } catch (e) {
                            }
                        } else {
                            obj = cvalue
                        }
                        haskey = true;
                        if (obj instanceof Array) {
                            if (obj.length > 0) {
                                map = obj[0];
                            }
                        } else {
                            map = obj
                        }

                    }
                    else if (key != null && value != null && value.length > 0) {
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
        }, resize: function () {
            $(".zform-cover .z-form").removeAttr("style")
            $(window).resize();
            var ch = $(".zform-cover").find(".form").height();
            var ph = $(".zform-cover").find(".z-form").height();
            if (ph - ch > 70) {
                $(".zform-cover .z-form").css({"height": ch + 70});
            }
        }
    };

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
                    if (type == "text") {//普通input
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
                    else if (type == "select") {
                        var item = _this._getSlect(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "textarea") {
                        var item = _this._getTextArea(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "zlist") {// 动态列表
                        var item = _this._getList(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "dynlist") {// 动态列表
                        var item = _this._getDynlist(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "imgup") {//上传图片控件
                        var item = _this._getImgUp(data[key], key);
                        $(panel).append(item);
                    }
                    else if (type == "time") {//时间控件
                        var item = _this._getTime(data[key], key);
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
            setTimeout(function () {
                zform.resize();
            }, 1)

        },
        /*
         * 编辑表单
         * 
         * **/
        eform: function (el, data, fun) {
            var tmpdata = {};
            $(el).find("td").each(function () {
                var key = $(this).data("key");//key
                var value = $(this).attr("data-value");
                var forbid = $(this).data("forbid");// 是否为不可编辑字段
                if (key != null && key.length > 0) {
                    if (data[key] && (value == null || value.length == 0)) {
                        if (data[key]["type"] == "text" || data[key]["type"] == "textarea") {
                            value = ($(this).html() || "").trim();//值 默认为文本内容
                        }
                    }
                    else if (data[key] && (data[key]["type"] == "text" || data[key]["type"] == "textarea") && value != null) {
                        value = $(this).attr("data-value");
                    }
                    for (var tmpkey in data) {
                        if (tmpkey == key) {
                            tmpdata[key] = clone(data[key]);
                            if (/^\[/gi.test(value)) {
                                try {
                                    tmpdata[key]["value"] = eval(value);
                                }
                                catch (e) {
                                    console.log("td数据转换出错", el);
                                }
                            } else if (/###/gi.test(value)) {
                                var array = value.split("###");
                                tmpdata[key]["value"] = array;
                            }
                            else {
                                tmpdata[key]["value"] = value;
                            }
                            if (forbid != null && forbid) {
                                tmpdata[key]["forbid"] = true;
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
            var forbid = item["forbid"];
            var dom = zen("div.item>label");
            $(dom).attr("data-ftype", "text");
            $(dom).attr("data-fkey", key);
            $(dom).find("label").html(name + "：");
            $(dom).append($("<input type='text' value='" + (value || "") + "'/>"));
            if (forbid) {
                $(dom).find("input").attr("disabled", "true");
            }
            return $(dom);
        },
        _getImgUp: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var value = item["value"];
            var forbid = item["forbid"];
            var dom = zen("div.item>label");
            $(dom).attr("data-ftype", "text");
            $(dom).attr("data-fkey", key);
            $(dom).find("label").html(name + "：");
            var ipt = $("<input type='text' value='" + (value || "") + "' class='zy-imgup'/>");
            $(dom).append(ipt);
            if (forbid) {
                $(dom).find("input").attr("disabled", "true");
            }
            ImgUp.wrapImgUp(ipt)
            ImgUp.bindImgUp($(ipt).parent().find(".zyadmin-upicon"))
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
        _getSlect: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var rlist = item["select"]
            var defvalue = item["value"];
            var name = item["name"];
            var dom = zen("div.item.select-item>label");
            $(dom).attr("data-ftype", "select");
            $(dom).attr("data-fkey", key);
            var select = $("<select></select>");
            $(dom).find("label").html(name + "：");
            for (var i in rlist) {
                var t = rlist[i];
                var name = t["name"];
                var value = t["value"];
                var option = $("<option value='" + value + "'>" + name + "</option>")
                if (defvalue === value) {
                    option.attr("selected", "true");
                }
                $(select).append(option);
            }
            $(dom).append(select)
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
        _getList: function (item, key, value) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var list = item["list"];
            var defvalue = item["value"];
            var dtype = item["dtype"];
            var dom = zen("div.item>label+div.z-list");
            $(dom).attr("data-ftype", "zlist");
            $(dom).attr("data-fkey", key);
            $(dom).find("label").html(name + "：");
//            var add_btn = zen("span.op-btn.add-zlist>i.fa.fa-plus-square.fa-1x")
            var add_btn = zen("span.op-btn.add-zlist>i.iconfont.icon-add")
            $(dom).append(add_btn);
            var listpanel = $(dom).find(".z-list");
            var tmp_item = zen("div.zlist-item.list-tmp>span.op-btn.del-zlist+span.op-btn.up-zlist")
            $(tmp_item).find(".del-zlist").append(zen("i.iconfont.icon-del"))
            $(tmp_item).find(".up-zlist").append(zen("i.iconfont.icon-up"));
            $(dom).append(tmp_item);
            var c = $($("<input type='text'>"));
            $(tmp_item).append(c);
            for (var n in defvalue) {
                var c_item = zen("div.zlist-item>span.op-btn.del-zlist+span.op-btn.up-zlist")
                var val = defvalue[n];
                var c = $($("<input type='text'   value='" + val + "'>"));
                $(c_item).append(c);
                $(c_item).find(".del-zlist").append(zen("i.iconfont.icon-del"))
                $(c_item).find(".up-zlist").append(zen("i.iconfont.icon-up"));
                listpanel.append(c_item);
            }
            if (dtype != null && dtype == "number") {
                dom.attr("dtype", "number");
            }
            return dom;
        },
        _getDynlist: function (item, key, value) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var list = item["list"];
            var defvalue = item["value"];
            var imgup = item["imgup"] + "" == "true";
            if (list != null && list.length > 0) {
                var dom = zen("div.item>label+div.dyn-list");
                $(dom).attr("data-ftype", "dynlist");
                $(dom).attr("data-fkey", key);
                $(dom).find("label").html(name + "：");
//                var add_btn = zen("span.op-btn.add-dyn>i.fa.fa-plus-square.fa-1x")
                var add_btn = zen("span.op-btn.add-dyn>i.iconfont.icon-add")
                $(dom).append(add_btn);
                var listpanel = $(dom).find(".dyn-list");
                var tmp_item = zen("div.dyn-item.dyn-tmp>span.op-btn.del-dyn+span.op-btn.up-dyn")
                $(tmp_item).find(".del-dyn").append(zen("i.iconfont.icon-del"))
                $(tmp_item).find(".up-dyn").append(zen("i.iconfont.icon-up"));
                $(dom).append(tmp_item);
                for (var i in list) {
                    var name = list[i]["name"];
                    var tkey = list[i]["key"];
                    var b = $("<label>" + name + "：</label>");
                    var c = $($("<input type='text' key='" + tkey + "'>"));
                    $(tmp_item).append(b);
                    $(tmp_item).append(c);
                    if (imgup) {// 标记为上传图片input 当点击添加按钮的时候再去触发绑定上传图片事件
                        c.addClass("zy-imgup");
                    }
                }
                for (var n in defvalue) {
                    var c_item = zen("div.dyn-item>span.op-btn.del-dyn+span.op-btn.up-dyn")
                    var item = defvalue[n];
                    for (var ckey in item) {
                        var b = $("<label>" + ckey + "：</label>");
                        item[ckey]["value"] = item[ckey]["value"] || "";
                        var c = $($("<input type='text' key='" + item[ckey]["key"] + "'  value='" + item[ckey]["value"] + "'>"));

                        $(c_item).append(b);
                        $(c_item).append(c);
                        //上传图片动态列表 特殊处理
                        if (imgup) {
                            c.addClass("zy-imgup");
                            ImgUp.wrapImgUp(c)
                            ImgUp.bindImgUp($(c).parent().find(".zyadmin-upicon"))
                            // 覆盖值             
                            var cvalue = item[ckey]["cvalue"];
                            if (cvalue != null) {
                                c.attr("data-cvalue", JSON.stringify(cvalue));
                            }
                        }
                    }
                    $(c_item).find(".del-dyn").append(zen("i.iconfont.icon-del"))
                    $(c_item).find(".up-dyn").append(zen("i.iconfont.icon-up"));
                    listpanel.append(c_item);
                }
                return dom;
            }

        },
        _getTime: function (item, key) {
            if (item == null || key == null) {
                return;
            }
            var name = item["name"];
            var value = item["value"];
            var forbid = item["forbid"];
            var dom = zen("div.item>label");
            $(dom).attr("data-ftype", "time");
            $(dom).attr("data-fkey", key);
            $(dom).find("label").html(name + "：");
//            $(dom).append($("<input type='text' value='" + (value || "") + "'/>"));
            var ipt = $("<input type='text'/>");
            try {
                ipt.datetimepicker();
                value = value + "";
                if (!Ut.Null(value) && value.length == 13) {
                    var timestr = Ut.getTimeTostr(value);
                    $(ipt).val(timestr);
                }
            }
            catch (e) {

            }
            $(dom).append(ipt);
            if (forbid) {
                $(dom).find("input").attr("disabled", "true");
            }
            return $(dom);
        },
        getSinleton: function () {
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
                $(tip).append($('<div class="z-form"><div class="close">×</div><div class="form-scroll"><div class="form"></div></div></div>'))
                $("body").append(tip);
                return tip;
            }
            return getInstance();
        }
    };
    function clone(obj) {
        function Fn() {
        }
        Fn.prototype = obj;
        var o = new Fn();
        for (var a in o) {
            if (typeof o[a] == "object") {
                o[a] = clone(o[a]);
            }
        }
        return o;
    }
    var _this = cform;
    return cform;
})();
$(function () {
    zform.init();
})