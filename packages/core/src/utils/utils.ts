export const generateSelector = (s: string) => s.startsWith('[') || s.startsWith('.') ? s : `.${s}`
