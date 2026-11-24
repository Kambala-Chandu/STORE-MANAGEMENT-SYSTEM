export const localizationService = {
  getLanguages: async () => {
    return [
      { code: "en-US", name: "English (US)", native_name: "English", direction: "LTR", status: "Active", translated_pct: 100 },
      { code: "es-ES", name: "Spanish", native_name: "Español", direction: "LTR", status: "Active", translated_pct: 95 },
      { code: "ar-AE", name: "Arabic", native_name: "العربية", direction: "RTL", status: "Active", translated_pct: 88 }
    ];
  },
  getCurrencies: async () => {
    return [
      { code: "USD", name: "US Dollar", symbol: "$", rate_to_usd: 1.0, flag: "🇺🇸" },
      { code: "EUR", name: "Euro", symbol: "€", rate_to_usd: 0.92, flag: "🇪🇺" },
      { code: "GBP", name: "British Pound", symbol: "£", rate_to_usd: 0.79, flag: "🇬🇧" }
    ];
  },
  getExchangeRates: async () => {
    return [
      { date: "2024-01-01", EUR: 0.91, GBP: 0.78, JPY: 140.5 },
      { date: "2024-01-02", EUR: 0.92, GBP: 0.79, JPY: 141.2 },
      { date: "2024-01-03", EUR: 0.91, GBP: 0.77, JPY: 142.1 }
    ];
  },
  getCountryConfigs: async () => {
    return [
      { id: 1, country: "United States", flag: "🇺🇸", date_format: "MM/DD/YYYY", number_format: "1,234.56", currency: "USD", primary_language: "en-US", tax_system_name: "Sales Tax" },
      { id: 2, country: "United Kingdom", flag: "🇬🇧", date_format: "DD/MM/YYYY", number_format: "1,234.56", currency: "GBP", primary_language: "en-GB", tax_system_name: "VAT" }
    ];
  },
  getTaxConfigs: async () => {
    return [
      { id: 1, country: "US", region: "NY", tax_name: "NY State Sales Tax", rate: 4.0, applies_to: "All", effective_date: "2020-01-01", status: "Active" },
      { id: 2, country: "UK", region: "All", tax_name: "Standard VAT", rate: 20.0, applies_to: "All", effective_date: "2011-01-04", status: "Active" }
    ];
  },
  get12LocalizationKPIs: async () => {
    return [
      { label: "Active Languages", value: "8", trend: "+1", trendUp: true },
      { label: "Supported Currencies", value: "23", trend: "+3", trendUp: true },
      { label: "Countries Configured", value: "15", trend: "+2", trendUp: true },
      { label: "Translation Completion", value: "87%", trend: "+2%", trendUp: true },
      { label: "Auto-Translations", value: "45K", trend: "+12%", trendUp: true },
      { label: "Tax Regions", value: "42", trend: "+5", trendUp: true },
      { label: "Currencies Updated", value: "Daily", trend: "0", trendUp: true },
      { label: "Format Overrides", value: "12", trend: "0", trendUp: true },
      { label: "Custom Strings", value: "1250", trend: "+150", trendUp: true },
      { label: "RTL Locales", value: "2", trend: "0", trendUp: true },
      { label: "Missing Translations", value: "245", trend: "-50", trendUp: true },
      { label: "Tax Rules Active", value: "185", trend: "+12", trendUp: true }
    ];
  },
  saveActiveLanguage: (code) => {
    localStorage.setItem("activeLanguage", code);
  },
  saveActiveCurrency: (code) => {
    localStorage.setItem("activeCurrency", code);
  }
};
