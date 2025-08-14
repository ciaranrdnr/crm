'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Avatar, Typography, Divider, Timeline, Space, Tabs, Modal, Form, Input, Select, message, DatePicker, Table } from 'antd';
import { EditOutlined, CalendarOutlined, DeleteOutlined, MailOutlined, PhoneOutlined, ArrowLeftOutlined, ExclamationCircleOutlined, SearchOutlined, PlusOutlined, FilterOutlined, VideoCameraOutlined, UserOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { mockLeads } from '@/utils/mock/general';
import { Lead, Meeting } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [lead, setLead] = useState<Lead | undefined>();

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');


  useEffect(() => {
    const currentLead = mockLeads?.find((lead) => lead?.id == leadId)
    currentLead && setLead(currentLead)
  }, [leadId])

  const activities = [
    {
      type: 'email',
      title: 'Email Sent: Proposal Follow-up',
      description: 'Sent detailed proposal for enterprise software implementation. Awaiting response.',
      time: '2 days ago'
    },
    {
      type: 'call',
      title: 'Phone Call: Requirements Discussion',
      description: '45-minute call discussing technical requirements and implementation timeline.',
      time: '1 week ago'
    },
    {
      type: 'meeting',
      title: 'Meeting: Initial Consultation',
      description: 'In-person meeting to understand business needs and pain points. AI summary available.',
      time: '2 weeks ago'
    }
  ];

  const mockMeetings: Meeting[] = [
    {
      id: 'M001',
      title: 'Product Demo & Requirements Review',
      date: 'Jan 15, 2025',
      time: '2:00 PM - 3:00 PM',
      type: 'Virtual',
      participants: ['John Anderson', 'Sarah Johnson', 'Mike Chen'],
      status: 'Completed',
      leadId: leadId,
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
      leadId: leadId,
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
      leadId: leadId,
      leadContact: 'John Anderson',
      description: 'Review proposal details and next steps'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'email': return <MailOutlined className="text-blue-500" />;
      case 'call': return <PhoneOutlined className="text-green-500" />;
      case 'meeting': return <CalendarOutlined className="text-purple-500" />;
      default: return null;
    }
  };

  const handleEditLead = () => {
    lead && form.setFieldsValue({
      name: lead?.name,
      company: lead?.company,
      email: lead?.email,
      phone: lead?.phone,
      productInterest: lead?.productInterest,
      stage: lead?.stage,
      dealValue: lead?.dealValue,
      assignedSalesRep: lead?.assignedSalesRep,
      notes: lead?.notes,
      companyType: lead?.companyType
    });
    setIsEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    form
      .validateFields()
      .then((values) => {
        setLead(prev => ({
          ...prev,
          ...values
        }));
        setIsEditModalVisible(false);
        message.success('Lead updated successfully!');
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleDeleteLead = () => {
    confirm({
      title: 'Are you sure you want to delete this lead?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone. All associated meetings and data will be lost.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success('Lead deleted successfully!');
        router.push('/');
      },
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Virtual': return <VideoCameraOutlined className="text-blue-500" />;
      case 'Phone': return <PhoneOutlined className="text-green-500" />;
      case 'In-person': return <UserOutlined className="text-orange-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'green';
      case 'Scheduled': return 'blue';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };


  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchText.toLowerCase()) ||
      meeting.leadContact.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });


  const columns = [
    {
      title: 'Date & Time',
      key: 'datetime',
      render: (record: Meeting) => (
        <div>
          <div className="font-medium">{record.date}</div>
          <div className="text-sm text-gray-500">{record.time}</div>
        </div>
      ),
    },
    {
      title: 'Meeting Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Meeting) => (
        <div>
          <div
            className="font-medium cursor-pointer hover:text-blue-600"
            onClick={() => router.push(`/${leadId}/meetings/${record.id}`)}
          >
            {text}
          </div>
          <div className="text-sm text-gray-500">{record.description}</div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <div className="flex items-center space-x-2">
          {getTypeIcon(type)}
          <span>{type}</span>
        </div>
      ),
    },
    {
      title: 'Participants',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants: string[]) => (
        <div className="flex items-center">
          <div className="flex -space-x-1 mr-2">
            {participants.slice(0, 3).map((_, index) => (
              <div
                key={index}
                className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center text-xs text-white"
              >
                {participants[index]?.split(' ').map(n => n[0]).join('')}
              </div>
            ))}
          </div>
          <span className="text-sm">{participants.length}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'AI Data',
      key: 'aiData',
      render: () => (
        <div className="flex space-x-2">
          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center">
            <span className="text-xs text-purple-600">📄</span>
          </div>
          <div className="w-6 h-6 bg-yellow-100 rounded flex items-center justify-center">
            <span className="text-xs text-yellow-600">💡</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Meeting) => (
        <Space size="small">
          <Button size="small" type="link" onClick={() => router.push(`/${leadId}/meetings/${record.id}`)}>
            View
          </Button>
          <Button size="small" type="link">Download</Button>
          <Button size="small" type="link" danger>Delete</Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'activity',
      label: 'Activity History',
      children: (
        <Timeline
          items={activities.map(activity => ({
            dot: getActivityIcon(activity.type),
            children: (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <Text strong>{activity.title}</Text>
                    <div className="text-gray-600 mt-1">{activity.description}</div>
                  </div>
                  <Text className="text-sm text-gray-500">{activity.time}</Text>
                </div>
                <div className="mt-2">
                  <Space size="small">
                    <Button size="small" type="link" onClick={() => router.push(`/${leadId}/meetings/${mockMeetings[0]}`)}>View</Button>
                    <Button size="small" type="link">Edit</Button>
                    <Button size="small" type="link" danger>Delete</Button>
                  </Space>
                </div>
              </div>
            )
          }))}
        />
      )
    },
    {
      key: 'meetings',
      label: 'Meetings & AI Assistant',
      children: (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-600">Total: <span className="font-bold">{mockMeetings.length}</span> meetings</span>
              </div>
            </div>

          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Search meetings..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-md"
            />
            <RangePicker className="max-w-md" />
            <Select
              placeholder="All Types"
              value={typeFilter}
              onChange={setTypeFilter}
              className="w-32"
            >
              <Select.Option value="all">All Types</Select.Option>
              <Select.Option value="Virtual">Virtual</Select.Option>
              <Select.Option value="Phone">Phone</Select.Option>
              <Select.Option value="In-person">In-person</Select.Option>
            </Select>
            <Select
              placeholder="All Status"
              value={statusFilter}
              onChange={setStatusFilter}
              className="w-32"
            >
              <Select.Option value="all">All Status</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
              <Select.Option value="Scheduled">Scheduled</Select.Option>
              <Select.Option value="Cancelled">Cancelled</Select.Option>
            </Select>
            <Button icon={<FilterOutlined />}>Clear Filters</Button>
            <Button>Export</Button>
          </div>

          <Table
            columns={columns}
            dataSource={filteredMeetings}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            className="bg-white rounded-lg shadow-sm"
          /></>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push('/leads')}
          className="mr-4"
        >
          Back to Leads
        </Button>
        <div className="text-gray-500">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/leads')}>
            Leads
          </span>
          <span className="mx-2">/</span>
          <span>{lead?.name}</span>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-4 gap-6">
          <Avatar size={64} style={{ backgroundColor: '#1890ff', fontSize: '24px' }}>
            {lead?.name[0]}
          </Avatar>
          <div>
            <Title level={2} className="!mb-1">{lead?.name}</Title>
            <Text className="text-lg text-gray-600">{lead?.company}</Text>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <Text className="text-sm">Active Lead</Text>
              <Text className="text-sm text-gray-500 ml-4">Last contacted 2 days ago</Text>
            </div>
          </div>
        </div>
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEditLead}>Edit Lead</Button>
          <Button
            type="primary"
            icon={<CalendarOutlined />}
            onClick={() => router.push(`/${leadId}/meetings/new`)}
          >
            Create New Meeting
          </Button>
          <Button danger icon={<DeleteOutlined />} onClick={handleDeleteLead}>Delete Lead</Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Contact Information" className="lg:col-span-1">
          <div className="space-y-4">
            <div>
              <Text strong>Name</Text>
              <div>{lead?.name}</div>
            </div>
            <div>
              <Text strong>Company</Text>
              <div>{lead?.company}</div>
            </div>
            <div>
              <Text strong>Email</Text>
              <div className="text-blue-600">{lead?.email}</div>
            </div>
            <div>
              <Text strong>Phone</Text>
              <div className="text-blue-600">{lead?.phone}</div>
            </div>
            <div>
              <Text strong>Product Interest</Text>
              <div className="mt-1">
                {lead && lead?.productInterest?.map(interest => (
                  <Tag key={interest} color="blue" className="mb-1">{interest}</Tag>
                ))}
              </div>
            </div>
            <div>
              <Text strong>Pipeline Stage</Text>
              <div className="mt-1">
                <Tag color="orange">{lead?.stage}</Tag>
              </div>
            </div>
            <div>
              <Text strong>Deal Value</Text>
              <div className="text-2xl font-bold text-green-600">${lead?.dealValue.toLocaleString()}</div>
            </div>
            <div>
              <Text strong>Assigned Sales Rep</Text>
              <div className="flex items-center mt-1 gap-2">
                <Avatar size="small" className="mr-2">SJ</Avatar>
                {lead?.assignedSalesRep}
              </div>
            </div>
            <div>
              <Text strong>Date Added</Text>
              <div>{lead?.dateAdded}</div>
            </div>
            <Divider />
            <div>
              <Text strong>Notes</Text>
              <div className="mt-2 p-3 bg-gray-50 rounded">{lead?.notes}</div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <Tabs items={tabItems} />
        </Card>
      </div>

      <Modal
        title="Edit Lead"
        open={isEditModalVisible}
        onOk={handleSaveEdit}
        onCancel={() => setIsEditModalVisible(false)}
        width={600}
        okText="Save Changes"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" requiredMark={false}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please enter the lead name' }]}
            >
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter a valid email' }
              ]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
            <Form.Item
              name="phone"
              label="Phone Number"
              rules={[{ required: true, message: 'Please enter phone number' }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item
              name="company"
              label="Company"
              rules={[{ required: true, message: 'Please enter company name' }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>
            <Form.Item
              name="companyType"
              label="Company Type"
            >
              <Select placeholder="Select company type">
                <Select.Option value="Technology">Technology</Select.Option>
                <Select.Option value="Manufacturing">Manufacturing</Select.Option>
                <Select.Option value="Startup">Startup</Select.Option>
                <Select.Option value="Enterprise">Enterprise</Select.Option>
                <Select.Option value="Healthcare">Healthcare</Select.Option>
                <Select.Option value="Finance">Finance</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="productInterest"
              label="Product Interest"
            >
              <Select mode="multiple" placeholder="Select product interests">
                <Select.Option value="Enterprise Software">Enterprise Software</Select.Option>
                <Select.Option value="Consulting">Consulting</Select.Option>
                <Select.Option value="Training">Training</Select.Option>
                <Select.Option value="CRM Software">CRM Software</Select.Option>
                <Select.Option value="Analytics Platform">Analytics Platform</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="stage"
              label="Pipeline Stage"
            >
              <Select placeholder="Select pipeline stage">
                <Select.Option value="Contacted">Contacted</Select.Option>
                <Select.Option value="Qualified">Qualified</Select.Option>
                <Select.Option value="Proposal Sent">Proposal Sent</Select.Option>
                <Select.Option value="Negotiation">Negotiation</Select.Option>
                <Select.Option value="Closed Won">Closed Won</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="assignedSalesRep"
              label="Assigned Rep"
            >
              <Select placeholder="Select assigned rep">
                <Select.Option value="John Smith">John Smith</Select.Option>
                <Select.Option value="Emma Wilson">Emma Wilson</Select.Option>
                <Select.Option value="Michael Chen">Michael Chen</Select.Option>
                <Select.Option value="Sarah Johnson">Sarah Johnson</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item
            name="dealValue"
            label="Deal Value ($)"
          >
            <Input placeholder="Enter deal value" type="number" />
          </Form.Item>
          <Form.Item
            name="notes"
            label="Notes"
          >
            <TextArea rows={3} placeholder="Enter any additional notes about this lead?..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}