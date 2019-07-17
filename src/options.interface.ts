export interface Options {
    /**
     * 处理nej的自定义路径, 转换成 es6 的模块管理
     * 详细信息: https://medium.com/@davidjwoody/how-to-use-absolute-paths-in-react-native-6b06ae3f65d1
     *
     * 转换成如下的方式进行模块的导入
     * import Thing from ‘AwesomeApp/app/some/thing’
     * create 'AwesomeApp/app/package.json' ==> { “name”: “app” } (注意name的值需要和文件夹的名称相同)
     * import Thing from ‘app/some/thing’
     *
     * @example
     * alias = {
     *     '{pro}lib': 'lib',
     *     '{common}': 'common/'
     * }
     *
     * {pro}lib/redux/redux.js ==> lib/redux/redux
     * /pro/lib/redux/redux    ==> lib/redux/redux
     * {common}tree/tree.js    ==> common/tree/tree
     * /common/tree/tree.js    ==> common/tree/tree
     */
    alias?: { [key: string]: string }
    isNejCode: boolean
}
