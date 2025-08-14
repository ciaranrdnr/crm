export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  productInterest: string[];
  stage: 'Contacted' | 'Proposal Sent' | 'Closed Won' | 'Qualified' | 'Negotiation';
  dealValue: number;
  lastActivity: string;
  assignedSalesRep: string;
  dateAdded: string;
  notes?: string;
  companyType?: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'Virtual' | 'Phone' | 'In-person';
  participants: string[];
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  leadId: string;
  leadContact: string;
  description?: string;
  transcript?: string;
  keyPoints?: string[];
  actionItems?: string[];
  decisions?: string[];
  nextSteps?: string[];
}