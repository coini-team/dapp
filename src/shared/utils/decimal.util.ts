import { ethers } from 'ethers';

// export const getEthBigAmount_ = (amount: string, decimals: number): bigint => {
//   // Parse the amount to a float.
//   const numericAmount = parseFloat(amount);
//   if (isNaN(numericAmount) || numericAmount < 0.0000001 || amount.length > 8) {
//     throw new NotFoundException('Invalid amount');
//   }
//   // Convert the amount to the smallest unit of the token.
//   const amountInDecimal = (parseInt(amount) / 1e6).toString();
//   // Parse the amount to a decimal.
//   const decimalAmount = ethers.parseUnits(amountInDecimal, 6);
//   return decimalAmount;
// };

// export const getDecimalAmount = (amount: string): string => {
//   const numericAmount = parseFloat(amount);
//   if (isNaN(numericAmount) || numericAmount < 0.0000001 || amount.length > 8) {
//     throw new NotFoundException('Invalid amount');
//   }
//   const decimalAmount = (parseInt(amount) / 1e6).toString();
//   return decimalAmount;
// };

// input: 4000n - output: 0.004
export const getEthDecimalAmount = (
  amount: string,
  decimals: number,
): number => {
  const decimalAmount = parseInt(amount) / Math.pow(10, decimals);
  return decimalAmount;
};

// input: 4000n - output: 4000
export const getEthBigAmount = (amount: string, decimals: number): bigint => {
  const amountInDecimal = (
    parseInt(amount) / Math.pow(10, decimals)
  ).toString();
  const decimalAmount = ethers.parseUnits(amountInDecimal, decimals);
  return decimalAmount;
};
