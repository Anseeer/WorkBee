export function toISTDateOnly(d: Date): string {
    return d.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}