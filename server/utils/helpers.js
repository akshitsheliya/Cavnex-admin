const generateId = (prefix = "ID") => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${prefix}-${timestamp}-${random}`.toUpperCase();
};

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + item.quantity * item.rate;
  }, 0);
};

const paginate = (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  return { skip, limit: parseInt(limit) };
};

module.exports = {
  generateId,
  formatCurrency,
  calculateTotal,
  paginate,
};
