/**
 * 后端版本控制 加载 js 类库和css 类库
 * @author ghy
 * @constant qq249398279
 * */
(function () {
    var Z = document.getElementsByTagName('script')[0];
    var csss = [
        "http://static.ws.kukuplay.com/common/lib/jquery-ui/v1.8.21/jquery-ui.1.8.21.min.css",
        "http://static.ws.kukuplay.com/common/styles/dataTables.bootstrap.css",
//        "http://static.ws.kukuplay.com/common/lib/zylib/v3.0/adminpageV3.7.css" //后端样式
        "/lib/css/adminpageV3.0.css", //后端样式

    ];
    var jss = [
        "http://static.ws.kukuplay.com/common/lib/bootstrap/v3.3.5/js/bootstrap.min.js", //bootstrap 核心
        "http://static.ws.kukuplay.com/common/lib/jquery-ui/v1.8.21/jquery-ui.1.8.21.min.js", //jquery ui 日期插件
        "http://static.ws.kukuplay.com/common/scripts/lib/jquery.dataTables.min.js", // 数据表格
        "http://static.ws.kukuplay.com/common/scripts/lib/dataTables.bootstrap.js",
//        "http://static.ws.kukuplay.com/common/lib/zylib/v3.0/adminV3.1.min.js",
//        "/js/admin/form/imgajaxupload.js",
//        "/js/admin/form/zform.js",
        "/dist/zadmin.all.js",
    ];

    for (var i = 0; i < csss.length; i++) {
        var tmpcss = document.createElement('link');
        tmpcss.rel = "stylesheet";
        tmpcss.href = csss[i];
        Z.parentNode.insertBefore(tmpcss, Z);
    }
//    var t = +new Date()
//    while ( + new Date < t + 5000)
//        ;
    for (var i = 0; i < jss.length; i++) {
        var tmpjs = document.createElement('script');
        tmpjs.type = 'text/javascript';
        tmpjs.async = false;
        tmpjs.src = jss[i];
        Z.parentNode.insertBefore(tmpjs, Z);
    }
    window.HOME_LINK = "/";
//    window.CONF_URL="/adminpage.json";
    window.CONF_URL="http://www.inter.zhangyu.tv/api/getadminpagelink";
    window.zadmin = (function (fun) {
        var tmpfun = [];
        admin = {
            ready: function (fun) {
                if (typeof fun === "function") {
                    tmpfun.push(fun);
                }
            }, init: function () {
                for (var i in tmpfun) {
                    tmpfun[i]();
                }
            }
        };
        return admin;
    })();
})();

/**
 * 
 * 页面配置 没有下面配置则默认从服务器获取信息  地址 "/api/getadminpagelink"
 * 章鱼tv 后端配置从服务器获取 不需要此配置
 * 小型项目（博客，单个项目等）可采用下面配置
 * 
 * */
window.AdminRightPage = [{
        name: "按钮1",
        cla: "logout"
    }, {
        name: "按钮2",
        cla: "logout"
    }
]