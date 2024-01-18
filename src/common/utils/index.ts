export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const getClassFromImport = (_import, name = 'default') => {
    return _import[name] ? getClassFromImport(_import[name], name) : _import;
};
