'use client';

import React, { useState } from 'react';
import { Table, Button, Input, Select, Tag, Space, Avatar, Typography, Row, Col, Modal, Form, message } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, TeamOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import type { Lead } from '@/types';
import { mockLeads, mockReps } from '@/utils/mock/general';
import TopNavigation from '@/components/navigation';
import { useResponsive } from '@/utils/hooks-helper';

const { Title } = Typography;
const { TextArea } = Input;

export default function LeadsPage() {
  const router = useRouter();
  const { isMobile } = useResponsive()
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [pipelineStage, setPipelineStage] = useState('All Stages');
  const [productInterest, setProductInterest] = useState('All Products');
  const [assignedRep, setAssignedRep] = useState('All Reps');
  const [sortBy, setSortBy] = useState('Last Activity');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [leads, setLeads] = useState(mockLeads);

  const getStageColor = (stage: string) => {
    const stageColors: Record<string, string> = {
      'Contacted': 'blue',
      'Qualified': 'cyan',
      'Proposal Sent': 'orange',
      'Negotiation': 'purple',
      'Closed Won': 'green'
    };
    return stageColors[stage] || 'default';
  };

  const getProductInterestColor = (product: string) => {
    const productColors: Record<string, string> = {
      'Enterprise Software': 'blue',
      'Consulting': 'green',
      'Training': 'orange',
      'CRM Software': 'purple',
      'Analytics Platform': 'cyan'
    };
    return productColors[product] || 'blue';
  };

  const columns = [
    {
      title: 'LEAD NAME',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Lead) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#1890ff', fontSize: '16px' }}>
            {text.split(' ').map(n => n[0]).join('')}
          </Avatar>
          <div>
            <div
              className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 text-base"
              onClick={() => router.push(`/${record.id}`)}
            >
              {text}
            </div>
            <div className="text-sm text-gray-500">Lead ID: #{record.id}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'COMPANY',
      dataIndex: 'company',
      key: 'company',
      render: (text: string, record: Lead) => (
        <div>
          <div className="font-medium text-gray-900 text-base">{text}</div>
          <div className="text-sm text-gray-500">{record.companyType || 'Technology'}</div>
        </div>
      ),
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
      render: (text: string) => (
        <div className="text-blue-600 hover:text-blue-800 cursor-pointer">{text}</div>
      ),
    },
    {
      title: 'PHONE',
      dataIndex: 'phone',
      key: 'phone',
      render: (text: string) => (
        <div className="text-gray-600">{text}</div>
      ),
    },
    {
      title: 'PRODUCT INTEREST',
      dataIndex: 'productInterest',
      key: 'productInterest',
      render: (text: string) => (
        <Tag color={getProductInterestColor(text)} className="px-3 py-1 text-sm font-medium">
          {text}
        </Tag>
      ),
    },
    {
      title: 'STAGE',
      dataIndex: 'stage',
      key: 'stage',
      render: (stage: string) => (
        <Tag color={getStageColor(stage)} className="px-3 py-1 text-sm font-medium">
          {stage}
        </Tag>
      ),
    },
    {
      title: 'LAST ACTIVITY',
      dataIndex: 'lastActivity',
      key: 'lastActivity',
      render: (text: string) => (
        <div className="text-gray-600">{text}</div>
      ),
    },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchText.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchText.toLowerCase());
    const matchesStage = pipelineStage === 'All Stages' || lead.stage === pipelineStage;
    const matchesProduct = productInterest === 'All Products' || lead?.productInterest?.includes(productInterest);
    const matchesRep = assignedRep === 'All Reps' || lead.assignedSalesRep === assignedRep;
    return matchesSearch && matchesStage && matchesProduct && matchesRep;
  });

  const handleClearFilters = () => {
    setPipelineStage('All Stages');
    setProductInterest('All Products');
    setAssignedRep('All Reps');
    setSortBy('Last Activity');
    setSearchText('');
  };

  const handleAddLead = () => {
    form
      .validateFields()
      .then((values) => {
        const newLead: Lead = {
          id: `L${String(leads.length + 1).padStart(3, '0')}`,
          name: values.name,
          company: values.company,
          email: values.email,
          phone: values.phone,
          productInterest: values.productInterest,
          stage: values.stage,
          dealValue: values.dealValue || 0,
          lastActivity: 'Just added',
          assignedSalesRep: values.assignedRep,
          dateAdded: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          notes: values.notes,
          companyType: values.companyType
        };

        setLeads([newLead, ...leads]);
        setIsModalVisible(false);
        form.resetFields();
        message.success('Lead added successfully!');
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  return (
    <>
      <TopNavigation logo={<>CRM</>} notificationCount={2} avatarSrc='' selectedKey={['leads']} menuItems={[{ key: 'leads', label: 'Leads' }, { key: 'deals', label: 'Deals' }, { key: 'reports', label: 'Reports' }]} />
      <div className="min-h-screen bg-gray-50 p-6 ">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
            <div className="flex items-end gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <Title level={2} className="mb-0">Leads</Title>
                  <div className="text-gray-500">Manage your sales pipeline</div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-8">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">{filteredLeads.length} active leads</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Input
                placeholder="Search leads, companies, emails..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-80"
                size="large"
              />
              <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => setIsModalVisible(true)}>
                Add New Lead
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm gap-3">
            <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-4`}>
              <div className={`flex items-center gap-2 ${isMobile ? 'justify-between' : 'justify-start'}`}>
                <span className="text-sm font-medium text-gray-700">Pipeline Stage:</span>
                <Select value={pipelineStage} onChange={setPipelineStage} className="w-40" size="middle">
                  <Select.Option value="All Stages">All Stages</Select.Option>
                  <Select.Option value="Proposal Sent">Proposal Sent</Select.Option>
                  <Select.Option value="Contacted">Contacted</Select.Option>
                  <Select.Option value="Closed Won">Closed Won</Select.Option>
                  <Select.Option value="Qualified">Qualified</Select.Option>
                  <Select.Option value="Negotiation">Negotiation</Select.Option>
                </Select>
              </div>
              <div className={`flex items-center gap-2 ${isMobile ? 'justify-between' : 'justify-start'}`}>
                <span className="text-sm font-medium text-gray-700">Product Interest:</span>
                <Select value={productInterest} onChange={setProductInterest} className="w-40" size="middle">
                  <Select.Option value="All Products">All Products</Select.Option>
                  <Select.Option value="Enterprise Software">Enterprise Software</Select.Option>
                  <Select.Option value="Consulting">Consulting</Select.Option>
                  <Select.Option value="Training">Training</Select.Option>
                  <Select.Option value="CRM Software">CRM Software</Select.Option>
                  <Select.Option value="Analytics Platform">Analytics Platform</Select.Option>
                </Select>
              </div>
              <div className={`flex items-center gap-2 ${isMobile ? 'justify-between' : 'justify-start'}`}>
                <span className="text-sm font-medium text-gray-700">Assigned Rep:</span>
                <Select value={assignedRep} onChange={setAssignedRep} className="w-32" size="middle">
                  <Select.Option value="All Reps">All Reps</Select.Option>
                  <Select.Option value="John Smith">John Smith</Select.Option>
                  <Select.Option value="Emma Wilson">Emma Wilson</Select.Option>
                  <Select.Option value="Michael Chen">Michael Chen</Select.Option>
                  <Select.Option value="Sarah Johnson">Sarah Johnson</Select.Option>
                </Select>
              </div>
              <div className={`flex items-center gap-2 ${isMobile ? 'justify-between' : 'justify-start'}`}>
                <span className="text-sm font-medium text-gray-700">Sort by:</span>
                <Select value={sortBy} onChange={setSortBy} className="w-32" size="middle">
                  <Select.Option value="Last Activity">Last Activity</Select.Option>
                  <Select.Option value="Name">Name</Select.Option>
                  <Select.Option value="Company">Company</Select.Option>
                </Select>
              </div>
              <Button icon={<FilterOutlined />} onClick={handleClearFilters} className="text-blue-600 border-blue-600 hover:bg-blue-50">
                Clear Filters
              </Button>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm max-w-screen overflow-x-auto">
          <Table
            columns={columns}
            dataSource={filteredLeads}
            rowKey="id"
            pagination={false}
            className="leads-table"
            size="large"
          />
        </div>

        <Modal
          title="Add New Lead"
          open={isModalVisible}
          onOk={handleAddLead}
          onCancel={handleModalCancel}
          width={600}
          okText="Add Lead"
          cancelText="Cancel"
        >
          <Form form={form} layout="vertical" requiredMark={false}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Full Name"
                  rules={[{ required: true, message: 'Please enter the lead name' }]}
                >
                  <Input placeholder="Enter full name" />
                </Form.Item>
              </Col>
              <Col span={12}>
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
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: 'Please enter phone number' }]}
                >
                  <Input placeholder="Enter phone number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="Company"
                  rules={[{ required: true, message: 'Please enter company name' }]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyType"
                  label="Company Type"
                  rules={[{ required: true, message: 'Please select company type' }]}
                >
                  <Select placeholder="Select company type">
                    <Select.Option value="Technology">Technology</Select.Option>
                    <Select.Option value="Manufacturing">Manufacturing</Select.Option>
                    <Select.Option value="Startup">Startup</Select.Option>
                    <Select.Option value="Enterprise">Enterprise</Select.Option>
                    <Select.Option value="Healthcare">Healthcare</Select.Option>
                    <Select.Option value="Finance">Finance</Select.Option>
                    <Select.Option value="Education">Education</Select.Option>
                    <Select.Option value="Retail">Retail</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="productInterest"
                  label="Product Interest"
                  rules={[{ required: true, message: 'Please select product interest' }]}
                >
                  <Select placeholder="Select product interest">
                    <Select.Option value="Enterprise Software">Enterprise Software</Select.Option>
                    <Select.Option value="Consulting">Consulting</Select.Option>
                    <Select.Option value="Training">Training</Select.Option>
                    <Select.Option value="CRM Software">CRM Software</Select.Option>
                    <Select.Option value="Analytics Platform">Analytics Platform</Select.Option>
                    <Select.Option value="Marketing Automation">Marketing Automation</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="stage"
                  label="Pipeline Stage"
                  rules={[{ required: true, message: 'Please select pipeline stage' }]}
                  initialValue="Contacted"
                >
                  <Select placeholder="Select pipeline stage">
                    <Select.Option value="Contacted">Contacted</Select.Option>
                    <Select.Option value="Qualified">Qualified</Select.Option>
                    <Select.Option value="Proposal Sent">Proposal Sent</Select.Option>
                    <Select.Option value="Negotiation">Negotiation</Select.Option>
                    <Select.Option value="Closed Won">Closed Won</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="assignedRep"
                  label="Assigned Rep"
                  rules={[{ required: true, message: 'Please select assigned rep' }]}
                >
                  <Select placeholder="Select assigned rep">
                    {mockReps.map((rep) => {
                      return (
                        <Select.Option value={rep}>{rep}</Select.Option>
                      )
                    })}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="dealValue"
                  label="Deal Value ($)"
                >
                  <Input placeholder="Enter deal value" type="number" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="notes"
              label="Notes"
            >
              <TextArea rows={3} placeholder="Enter any additional notes about this lead..." />
            </Form.Item>
          </Form>
        </Modal>
      </div >
    </>
  );
}
