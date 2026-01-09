// ===============================
// SALES ENGINE
// ===============================

let SALES_CONFIG = [];

export async function loadSalesConfig() {
  if (SALES_CONFIG.length) return SALES_CONFIG;

  const res = await fetch("https://hirshtom-web.github.io/ab/sales-config.csv");
  const text = await res.text();

  SALES_CONFIG = Papa.parse(text, {
    header: true,
    skipEmptyLines: true
  }).data;

  return SALES_CONFIG;
}

export function isSaleActive(sale) {
  if (sale.active !== "true") return false;

  const now = new Date();
  return now >= new Date(sale.start_date) &&
         now <= new Date(sale.end_date);
}

export function getSaleForProduct(product, sales) {
  return (
    sales.find(s =>
      s.scope === "product" &&
      s.scope_value === product.id &&
      isSaleActive(s)
    ) ||
    sales.find(s =>
      s.scope === "category" &&
      s.scope_value === product.category &&
      isSaleActive(s)
    ) ||
    sales.find(s =>
      s.scope === "global" &&
      isSaleActive(s)
    ) ||
    null
  );
}

export function applySale(price, sale) {
  if (!sale) return price;

  if (sale.discount_type === "percent") {
    return price * (1 - sale.discount_value / 100);
  }

  if (sale.discount_type === "amount") {
    return price - sale.discount_value;
  }

  if (sale.discount_type === "fixed") {
    return sale.discount_value;
  }

  return price;
}
