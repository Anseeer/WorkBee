export function formatId(prefix: string, id: string, sliceLength: number = 10): string {
    const cleanId = id.replace(/[^a-zA-Z0-9]/g, ""); 
    const shortId = cleanId.substring(0, sliceLength).toUpperCase();
    return `${prefix}#${shortId}`;
}
