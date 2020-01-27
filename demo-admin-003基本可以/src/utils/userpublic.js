export function deepcloneRole(source) {
  const targetObj = Array.isArray(source) ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof(source[keys])=="object"){
      targetObj[keys]=deepcloneRole(source[keys])
    }else{
      targetObj[keys]=source[keys]
    }
  });
  return targetObj;
}