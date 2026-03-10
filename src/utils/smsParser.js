const CATEGORY_KEYWORDS = {
  Food: ['zomato', 'swiggy', 'restaurant', 'cafe', 'pizza', 'burger', 'food', 'dining'],
  Transport: ['uber', 'ola', 'metro', 'fuel', 'petrol', 'irctc', 'rapido', 'bus'],
  Shopping: ['amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa', 'mall'],
  Entertainment: ['netflix', 'prime', 'spotify', 'hotstar', 'bookmyshow', 'pvr', 'inox'],
  Health: ['pharmacy', 'hospital', 'clinic', 'doctor', 'medical', 'apollo', 'medplus'],
  Utilities: ['electricity', 'water', 'gas', 'broadband', 'jio', 'airtel', 'recharge'],
  Finance: ['emi', 'loan', 'insurance', 'mutual fund', 'sip', 'credit card'],
  Groceries: ['bigbasket', 'blinkit', 'grofers', 'zepto', 'grocery', 'vegetables'],
};

const AMOUNT_PATTERNS = [
  /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)\s*(?:debited|deducted|paid|spent|charged)/i,
  /(?:debited|deducted|paid|spent|charged)[^\d]*(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
  /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
];

const MERCHANT_PATTERNS = [
  /(?:at|to)\s+([A-Za-z0-9\s&\-\.]{3,40?)(?:\s+on|\s+via|\s+ref|\.)/i,
  /(?:for\s+)([A-Za-z0-9\s&\-\.]{3,40})(?:\s+on|\s+ref|$)/i,
];

export function parseSMS(smsBody) {
  if (!smsBody) return null;
  const lower = smsBody.toLowerCase();

  const isDebit = /debit|debited|paid|spent|payment|purchase|charged|withdrawn/i.test(smsBody);
  const isCredit = /credited|received|refund/i.test(smsBody);
  if (!isDebit || isCredit) return null;

  let amount = null;
  for (const pattern of AMOUNT_PATTERNS) {
    const match = smsBody.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''));
      break;
    }
  }
  if (!amount || amount <= 0) return null;

  let merchant = 'Unknown Merchant';
  for (const pattern of MERCHANT_PATTERNS) {
    const match = smsBody.match(pattern);
    if (match) {
      merchant = match[1].trim();
      break;
    }
  }

  let category = 'Others';
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      category = cat;
      break;
    }
  }

  const dateMatch = smsBody.match(/(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/);
  const date = dateMatch ? new Date(dateMatch[1]) : new Date();

  return {
    amount,
    merchant,
    category,
    date: isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString(),
    rawSMS: smsBody,
    id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
  };
}
