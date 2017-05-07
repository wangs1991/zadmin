module.exports = function (content, file, settings, opt) {
     // 第一版，还是采用fis系统去打包之类的，要不然引用关系是个问题。所以不自己额外编译了
//    var path = require('path');
//    var root = fis.project.getProjectPath();
//    var dist = settings.dist || file.subdirname;
    var tpl_tmp = require("./lib/tmp_fn.js")// 输出模版字符串
    var content_str = replaceContent(content);
//    var f2_wrap = fis.file.wrap(path.join(root, dist, file.filename + ".js"));
    var tmp_str = tpl_tmp().replace("##TMP_KEY##", file.filename).replace("##TMP_VALUE##", content_str)
//    f2_wrap.setContent(tmp_str);
    return tmp_str;
}
function replaceContent(str) {
    if (str == null) {
        return str;
    }
    var reg1 = /<%@.*?%>/gi;// jsp 标签引用
    var reg2 = />([\s]*?)</gi;// 标签之间的空格
    var reg3 = />([\s]+)/gi;// > 之后的空格
    var reg4 = /([\s]+)</gi;// < 之前
    str = str.replace(reg1, "").
            replace(/\r\n|\n|\r/g, "\v").
            replace(reg2, function (content, _) {
                return "><"
            }).
            replace(reg3, function (content, _) {
                return ">"
            }).
            replace(reg4, function (content, _) {
                return "<"
            }).
            replace(/'/gi, function (content, _) {
                return "\\'"
            })
    return str;
}