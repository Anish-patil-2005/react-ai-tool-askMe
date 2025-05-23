export function checkHeading (str)  {
    return /^\*\*.*\*$/.test(str.trim());
}




export  function replaceHeading(str) {
    return str.replace(/^\*\*|\*$/g, '');
}