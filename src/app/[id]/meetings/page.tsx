'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Select, Tag, Space, Typography, DatePicker } from 'antd';
import { PlusOutlined, SearchOutlined, FilterOutlined, VideoCameraOutlined, PhoneOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import type { Lead, Meeting } from '@/types';
import { mockLeads, mockMeetings } from '@/utils/mock/general';

const { Title } = Typography;
const { RangePicker } = DatePicker;

export default function LeadMeetingsPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;

  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [lead, setLead] = useState<Lead | undefined>();

  useEffect(() => {
    const currentLead = mockLeads?.find((lead) => lead?.id == leadId)
    currentLead && setLead(currentLead)
  }, [leadId])


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
          <span className="text-sm">{participants.length} people</span>
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

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchText.toLowerCase()) ||
      meeting.leadContact.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    const matchesType = typeFilter === 'all' || meeting.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push(`/${leadId}`)}
          className="mr-4"
        >
          Back to {lead?.name}
        </Button>
        <div className="text-gray-500">
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push('/leads')}>
            Leads
          </span>
          <span className="mx-2">/</span>
          <span className="cursor-pointer hover:text-blue-600" onClick={() => router.push(`/${leadId}`)}>
            {lead?.name}
          </span>
          <span className="mx-2">/</span>
          <span>Meetings</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="!mb-2">Meetings & Activities</Title>
          <p className="text-gray-600">Track all interactions for {lead?.name} at {lead?.company}</p>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">Total: <span className="font-bold">{mockMeetings.length}</span> meetings</span>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => router.push(`/${leadId}/meetings/new`)}
        >
          New Meeting
        </Button>
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
      />
    </div>
  );
}