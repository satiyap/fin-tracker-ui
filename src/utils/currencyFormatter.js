/**
 * Format a number to Indian Rupee format with the ₹ symbol
 * 
 * @param {number} amount - The amount to format
 * @returns {string} Formatted string in Indian Rupee format (e.g., ₹1,00,000.00)
 */
export const formatIndianRupee = (amount) => {
    if (amount === null || amount === undefined) {
      return '₹0.00';
    }
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };
  
  /**
   * Format a number to Indian number format without currency symbol
   * 
   * @param {number} amount - The amount to format
   * @returns {string} Formatted string in Indian number format (e.g., 1,00,000.00)
   */
  export const formatIndianNumber = (amount) => {
    if (amount === null || amount === undefined) {
      return '0.00';
    }
    
    const formatter = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    
    return formatter.format(amount);
  };