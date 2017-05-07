
fis.match('*', {
    release: false,
})

//===================== css 编译处理  ===================
fis.match('*(*all*.scss)', {
    rExt: '.css',
    parser: fis.plugin('node-sass', {// ����scss
    }),
    sourceMap: true,
    // 启用图片插件 (必须 启用 fis-spriter-csssprites 这个插件才能使用此功能)
//    useSprite: true,
//    release: "/static/css/$1",// 迁移项目不能这么设置，需要兼容项目以前引用路径
    // css3 前缀自动补全
    postprocessor: fis.plugin("autoprefixer", {
        "browsers": ['Firefox >= 20', 'Safari >= 6', 'Explorer >= 8', 'Chrome >= 12', "ChromeAndroid >= 2.0"],
        "flexboxfixer": true,
        "gradientfixer": true
    }),
})

// 发布规则
fis.match('*(*all*.js)', {
    release: "$1",
    optimizer: fis.plugin('uglify-js')
}).match('*(*test*.js)', {
    release: "/js/$1",
    optimizer: fis.plugin('uglify-js')
}).match('*(*all*.scss)', {
    release: "/css/$1",
})

// jsptpl 模版
fis.match("*(*.tpl.jsp)", {
    parser: fis.plugin('jsptpl'),
    rExt: '.js',
    release: "/jstpl/$1"
})

//===================== 忽略规则  ===================
fis.set('project.ignore', [
    '**/nbproject/**',
    'dist/**',
    '**/bat/**',
    'node_modules/**',
    '.git/**',
    '.svn/**',
    "**conf.js",
    '**.bat'
]);
