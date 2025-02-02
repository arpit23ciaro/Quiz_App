export default function isEmpty(...args: any[]): boolean {
    return args.some(arg => arg === undefined || arg === null || arg === '');
}