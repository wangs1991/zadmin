
window.TPL = window.TPL || {};
(function (TPL) {
    TPL.tplmap = TPL.tplmap || {};
    TPL.getTpl = TPL.getTpl || function (_id) {
        return this.tplmap[_id];
    }
    TPL.tplmap['popimg.tpl'] = '<div class="overlay" style="display: none;"></div><div class="pop-modal"><i class="pop-close iconfont icon-close_m"></i><i class="pop-detail iconfont icon-menu"></i><div class="modal_content"><ul class="pop-list"><!--存放详细信息--></ul><img src="http://fengyun-bar.b0.upaiyun.com/1470742916289691.jpg"></div></div>'
})(TPL);
   