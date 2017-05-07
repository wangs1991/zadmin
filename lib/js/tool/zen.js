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