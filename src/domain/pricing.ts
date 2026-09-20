export const SERVICE_FEE = 20;

export function calculatePrice(hourlyRate: number) {
  return {
    courtSubtotal: hourlyRate,
    serviceFee: SERVICE_FEE,
    customerTotal: hourlyRate + SERVICE_FEE,
  };
}
