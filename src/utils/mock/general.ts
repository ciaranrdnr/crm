import { Lead, Meeting } from "@/types";

export const mockReps = ['John Smith', 'Emma Wilson', 'Michael Chen', 'Sarah Johnson', 'David Rodriguez']

export const mockLeads: Lead[] = [
  {
    id: 'L001',
    name: 'John Anderson',
    company: 'TechCorp Solutions',
    email: 'john.anderson@techcorp.com',
    phone: '+1 (555) 123-4567',
    productInterest: ['Enterprise Software'],
    stage: 'Proposal Sent',
    dealValue: 45000,
    lastActivity: '2 days ago',
    assignedSalesRep: 'Sarah Johnson',
    dateAdded: 'January 15, 2025',
    notes: 'Interested in enterprise solution for 500+ employees. Budget approved.',
    companyType: 'Technology'
  },
  {
    id: 'L002',
    name: 'Maria Rodriguez',
    company: 'Global Industries',
    email: 'maria.r@globalind.com',
    phone: '+1 (555) 987-6543',
    productInterest: ['Consulting'],
    stage: 'Contacted',
    dealValue: 75000,
    lastActivity: '1 week ago',
    assignedSalesRep: 'Michael Chen',
    dateAdded: 'January 10, 2025',
    companyType: 'Manufacturing'
  },
  {
    id: 'L003',
    name: 'David Kim',
    company: 'StartupXYZ',
    email: 'david@startupxyz.com',
    phone: '+1 (555) 456-7890',
    productInterest: ['Training'],
    stage: 'Closed Won',
    dealValue: 25000,
    lastActivity: '3 days ago',
    assignedSalesRep: 'Sarah Johnson',
    dateAdded: 'January 8, 2025',
    companyType: 'Startup'
  },
  {
    id: 'L004',
    name: 'Emily Watson',
    company: 'InnovateCorp',
    email: 'emily.watson@innovate.com',
    phone: '+1 (555) 234-5678',
    productInterest: ['CRM Software'],
    stage: 'Qualified',
    dealValue: 60000,
    lastActivity: '5 days ago',
    assignedSalesRep: 'Emma Wilson',
    dateAdded: 'January 12, 2025',
    companyType: 'Technology'
  },
  {
    id: 'L005',
    name: 'Robert Chen',
    company: 'DataFlow Systems',
    email: 'robert.chen@dataflow.com',
    phone: '+1 (555) 345-6789',
    productInterest: ['Analytics Platform'],
    stage: 'Negotiation',
    dealValue: 120000,
    lastActivity: '1 day ago',
    assignedSalesRep: 'John Smith',
    dateAdded: 'January 5, 2025',
    companyType: 'Technology'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'M001',
    title: 'Product Demo & Requirements Review',
    date: 'Jan 15, 2025',
    time: '2:00 PM - 3:00 PM',
    type: 'Virtual',
    participants: ['John Anderson', 'Sarah Johnson', 'Mike Chen'],
    status: 'Completed',
    leadId: 'L001',
    leadContact: 'John Anderson',
    description: 'Discussed enterprise features and pricing'
  },
  {
    id: 'M002',
    title: 'Initial Discovery Call',
    date: 'Jan 12, 2025',
    time: '10:00 AM - 11:30 AM',
    type: 'Phone',
    participants: ['John Anderson', 'Sarah Johnson'],
    status: 'Completed',
    leadId: 'L002',
    leadContact: 'John Anderson',
    description: 'Understanding business needs and pain points'
  },
  {
    id: 'M003',
    title: 'Follow-up & Proposal Discussion',
    date: 'Jan 18, 2025',
    time: '3:00 PM - 4:00 PM',
    type: 'In-person',
    participants: ['John Anderson', 'Sarah Johnson', 'Mike Chen'],
    status: 'Scheduled',
    leadId: 'L003',
    leadContact: 'John Anderson',
    description: 'Review proposal details and next steps'
  }
];
