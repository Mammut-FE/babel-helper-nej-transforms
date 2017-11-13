export const TEXT_DEPS = /^text!|^regular!|^json!|\.html$|\.css$|\.json$/i;

/**
 * 转义特殊字符
 * @param str 
 */
export const escape = (str: string) => {
    const excape = /(\/|{|}|\.)/g;
    return str.replace(excape, '\\' + '$1')
};

/**
 * 根据 alias 生成对应的正则表达式
 * @param alias 
 */
export const genAliasRe = (alias: { [key: string]: string }): RegExp => {
    const reStr = [];

    for (const key in alias) {
        reStr.push(`^${escape(key)}`);
    }

    return new RegExp(reStr.join('|'));
};
