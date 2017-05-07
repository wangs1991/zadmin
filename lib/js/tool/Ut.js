window.Ut = (function () {
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
        },
        gettime: function (str) {
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
        },
        Null: function (e) {
            return e == null || e == "" || e.length == 0;
        },
        isURL: function (str) {
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