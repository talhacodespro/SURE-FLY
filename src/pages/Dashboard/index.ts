export { default as Analytic } from './Analytic/Analytic'

// Company
export { default as AddCompany } from './Company/AddCompany'
export { default as ListCompany } from './Company/ListCompany'

// Sales
export { default as AddSales } from './Sales/AddSales'
export { default as ListSales } from './Sales/ListSales'

// Passport
export { default as AddPassport } from './Passport/AddPassport'
export { default as ListPassport } from './Passport/ListPassport'

// Sales type data
export const salesTypes = ['Ticket', 'Hajj', 'Umrah', 'Visit Visa', 'Employment Visa'] as const

// Sales type
export type SalesType = (typeof salesTypes)[number]

// Extra values
export type ExtraValueMap = {
  Ticket: {
    ticketNumber: string
    sector: string
    ticketIssueDate: Date | null
    pnr: string
    air: string
    flightDate: Date | null
  }
  Hajj: {
    packageName: string
    year: string
  }
  Umrah: {
    packageName: string
    hotel: string
  }
  'Visit Visa': {
    country: string
  }
  'Employment Visa': {
    company: string
    country: string
  }
}
