export const siteMenus = {
  personal: { label: "Personal Solutions", href: "/personal-solutions", groups: [
    { title: "Life & health", links: [
      ["Life Insurance", "/protect/life-insurance"],
      ["Health Insurance", "/protect/health"],
      ["Critical Illness", "/protect/critical-illness"],
      ["Personal Accident", "/protect/personal-accident"],
    ] },
    { title: "Retirement & savings", links: [
      ["Pensions and Annuities", "/grow/pension-annuities"],
      ["Investments and Mutual Funds", "/grow/investments-mutual-funds"],
    ] },
  ] },
  business: { label: "Business Solutions", href: "/business-solutions", groups: [
    { title: "Employee benefits", links: [
      ["Group Life, Health and Pensions", "/business/group-employee-benefits"],
      ["Group Benefits Enquiry", "/tools#group-benefits"],
    ] },
  ] },
  tools: { label: "Tools & Resources", href: "/tools", groups: [
    { title: "Calculators", links: [
      ["Life Insurance Needs", "/tools#life-insurance"],
      ["Critical Illness Costs", "/tools#critical-illness"],
      ["Education Savings", "/tools#education"],
      ["Retirement Savings", "/tools#retirement"],
      ["Savings and Investment Growth", "/tools#investment"],
    ] },
    { title: "Planning & enquiries", links: [
      ["Help Choosing Insurance", "/tools#router"],
      ["Term Insurance Enquiry", "/tools#term-insurance"],
      ["Group Benefits Enquiry", "/tools#group-benefits"],
      ["Product Documents", "/brochures"],
    ] },
  ] },
} as const;
