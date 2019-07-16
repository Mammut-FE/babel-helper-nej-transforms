import { dirname, isAbsolute, relative } from 'path';

/**
 * 转换 nej 中的依赖关系为相对路径的文件引用
 *
 * @param {string} nejPath
 * @param {string} filePath
 */
export function transformNejDepPath(nejPath: string, filePath: string) {

    if (nejPath.startsWith('.') && nejPath.endsWith('.js')) {
        return nejPath.replace(/\.js$/, '');
    }

    if (nejPath.startsWith('{platform')) {
        // {platform}element.js
        return nejPath.replace(/^{platform}/, './platform/').replace(/\.js$/, '');
    }

    let relativePath;
    if (!nejPath.endsWith('.js')) {
        // base/util
        nejPath = `./${nejPath}.js`;
    }

    relativePath = relative(dirname(filePath), nejPath);

    if (!relativePath.startsWith('.')) {
        // relative 同级目录会省略前面的 './', eg: ./util => util
        // 需要手动补充
        relativePath = './' + relativePath;
    }

    return relativePath.replace(/\.js$/, '');
}
