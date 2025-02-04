export default function isEmpty(...args) {
    return args.some(arg => arg === undefined || arg === null || arg === '');
}
