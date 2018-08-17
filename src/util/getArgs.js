module.exports = (...expected) => {
    const args = process.argv.slice(2);
    return expected
        .map((arg, index) => {
            const o = {}
            o[arg] = args[index]
            return o;
        })
        .reduce((accumulator, val) => {
            return {...accumulator, ...val}
        }, {});
};