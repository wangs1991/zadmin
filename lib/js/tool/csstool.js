/**
 * @version 1.0
 * @description 第一版实现基础解析，暂时不支持高级语法
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