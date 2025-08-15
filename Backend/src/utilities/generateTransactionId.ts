export async function generateTransactionId(paymentId: string) {
    return `TXN-${paymentId}-${Date.now()}`;
}
