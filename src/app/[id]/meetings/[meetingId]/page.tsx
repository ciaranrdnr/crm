'use client';

import React, { useEffect, useState } from 'react';
import { Card, Button, Tag, Typography, Divider, Tabs, Input, message, Popconfirm, Space } from 'antd';
import { EditOutlined, DownloadOutlined, ArrowLeftOutlined, SearchOutlined, CloseOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import { Lead, Meeting } from '@/types';
import { mockLeads, mockMeetings } from '@/utils/mock/general';

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function MeetingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;
  const meetingId = params?.meetingId as string;
  const [meeting, setMeeting] = useState<Meeting | undefined>();
  const [lead, setLead] = useState<Lead | undefined>();


  useEffect(() => {
    const currentLead = mockLeads?.find((lead) => lead?.id == leadId)
    currentLead && setLead(currentLead)

    const currentMeeting = mockMeetings?.find((meeting) => meeting?.id == meetingId)
    currentLead && setMeeting(currentMeeting)
  }, [leadId, meetingId])


  const transcript = `
00:02:15 John Anderson: Thanks for joining today. I wanted to discuss our Q1 strategy and how your enterprise software solution could fit into our digital transformation initiative.

00:02:45 Sarah Johnson: Absolutely, John. Based on our previous conversations, I understand you're looking at a solution that can handle about 500 users initially, with plans to scale to 1,200 by year-end.

00:03:20 John Anderson: That's correct. We're also looking at a budget of around $45,000 for the initial implementation, with additional licensing costs as we scale.

00:04:10 Mike Chen: We should also discuss the integration points with your existing CRM system to ensure smooth data flow between platforms.

00:05:30 Sarah Johnson: Yes, and we'll need to align on the implementation timeline to coordinate with your Q1 goals.
  `;

  const keyPoints = [
    'Q1 digital transformation initiative planning',
    'Enterprise software requirements for 500-1,200 users',
    'Budget allocation and scaling considerations',
    'CRM integration requirements'
  ];

  const actionItems = [
    'Send detailed proposal by January 20',
    'Schedule technical demo for January 25',
    'Connect with IT team for requirements review'
  ];

  const decisions = [
    'Approved budget of $45,000 for initial implementation',
    'Confirmed timeline for Q1 implementation'
  ];

  const nextSteps = [
    'Technical demo scheduled for January 25',
    'Follow-up meeting with decision makers'
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [notes, setNotes] = useState([
    {
      id: 1,
      content: 'Client seems very interested in scalability features. Mentioned they\'re expecting rapid growth in Q2-Q3.',
      timestamp: '2025-01-15 14:30:00',
      isNew: false
    },
    {
      id: 2,
      content: 'Budget confirmed at $45K for initial phase. Additional licensing budget available for scaling.',
      timestamp: '2025-01-15 14:32:00',
      isNew: false
    }
  ]);
  const [newNote, setNewNote] = useState('');

  const highlightMatch = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ?
        <mark key={i} className="bg-yellow-200">{part}</mark> :
        part
    );
  };

  const filteredTranscript = transcript.split('\n')
    .filter(line => line.trim() !== '')
    .filter(line => searchTerm ? line.toLowerCase().includes(searchTerm.toLowerCase()) : true);

  const resultsCount = searchTerm ? filteredTranscript.length : 0;

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleEditNote = (id: number) => {
    const noteToEdit = notes.find(note => note.id === id);
    setEditingNoteId(id);
    setNewNote(noteToEdit?.content || '');
  };

  const handleSaveNote = (id: number) => {
    if (newNote.trim() === '') {
      message.error('Note cannot be empty');
      return;
    }
    setNotes(prevNotes => prevNotes.map(note =>
      note.id === id ?
        { ...note, content: newNote, timestamp: note?.timestamp || new Date().toLocaleString(), isNew: false } :
        note
    ));
    setEditingNoteId(null);
    setNewNote('');
    message.success('Note updated successfully');
  };

  const handleDeleteNote = (id: number) => {
    setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    message.success('Note deleted successfully');
  };

  const handleAddNote = () => {
    if (newNote.trim() === '') {
      message.error('Note cannot be empty');
      return;
    }
    const newNoteObj = {
      id: Date.now(),
      content: newNote,
      timestamp: new Date().toLocaleString(),
      isNew: true
    };
    setNotes(prevNotes => [...prevNotes, newNoteObj]);
    setNewNote('');
    message.success('Note added successfully');
  };

  const tabItems = [
    {
      key: 'transcript',
      label: 'Transcript',
      children: (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-md">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search transcript..."
                prefix={<SearchOutlined className="text-gray-400" />}
                suffix={
                  searchTerm && (
                    <CloseOutlined
                      onClick={clearSearch}
                      className="cursor-pointer text-gray-400 hover:text-gray-600"
                    />
                  )
                }
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className={`pr-8 ${searchFocused ? 'border-blue-500' : ''}`}
                allowClear
              />
              {searchTerm && (
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                  {resultsCount} match{resultsCount !== 1 ? 'es' : ''}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded border max-h-96 overflow-y-auto">
            {searchTerm && filteredTranscript.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No matches found for {searchTerm}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTranscript.map((line, index) => (
                  <div key={index} className="mb-2 p-2 hover:bg-gray-50 rounded">
                    <pre className="whitespace-pre-wrap text-sm font-mono">
                      {highlightMatch(line)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    },
    {
      key: 'notes',
      label: 'Meeting Notes',
      children: (
        <div className="space-y-4">
          {notes.map(note => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border ${note.isNew ? 'border-l-4 border-l-blue-500' : ''} ${editingNoteId === note.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}
            >
              {editingNoteId === note.id ? (
                <div className='flex flex-col gap-6'>
                  <TextArea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    maxLength={1000}
                    showCount
                    placeholder="Edit your note..."
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    className="border-blue-500"
                  />
                  <div className="flex justify-end mt-2 gap-2">
                    <Button
                      onClick={() => handleSaveNote(note.id)}
                      type="primary"
                      disabled={!newNote.trim()}
                    >
                      Save
                    </Button>
                    <Button onClick={() => setEditingNoteId(null)}>
                      Cancel
                    </Button>
                    <Popconfirm
                      title="Delete this note?"
                      description="Are you sure you want to delete this note?"
                      onConfirm={() => handleDeleteNote(note.id)}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button danger>
                        Delete
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              ) : (
                <div>
                  <Text>{note.content}</Text>
                  <div className="text-sm text-gray-500 mt-2">
                    {note.timestamp}
                  </div>
                  <Button
                    onClick={() => handleEditNote(note.id)}
                    icon={<EditOutlined />}
                    size="small"
                    className="mt-2"
                  >
                    Edit
                  </Button>
                </div>
              )}
            </div>
          ))}

          <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-lg">
            <TextArea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              maxLength={1000}
              showCount
              placeholder="Add post-meeting notes..."
              autoSize={{ minRows: 3, maxRows: 6 }}
              className="hover:border-blue-500"
            />
            <Button
              onClick={handleAddNote}
              type="primary"
              disabled={!newNote.trim()}
              className="mt-2"
            >
              Add Note
            </Button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-10 p-6">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push(`/${leadId}`)}
          className="mr-4"
        >
          Back to Meetings
        </Button>
        <div className="text-gray-500">
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => router.push('/leads')}
          >
            Leads
          </span>
          <span className="mx-2">/</span>
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => router.push(`/${leadId}`)}
          >
            {lead?.name}
          </span>
          <span className="mx-2">/</span>
          <span
            className="cursor-pointer hover:text-blue-600"
            onClick={() => router.push(`/${leadId}`)}
          >
            Meetings
          </span>
          <span className="mx-2">/</span>
          <span className="font-medium">{meeting?.title}</span>
        </div>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <Title level={2} className="!mb-2">
            {meeting?.title} – Meeting Details
          </Title>
          <div className="flex flex-wrap items-center gap-2 text-gray-600">
            <span>{meeting?.date}</span>
            <span>•</span>
            <span>{meeting?.time}</span>
            <span>•</span>
            <Tag>{meeting?.type}</Tag>
            <Tag color="green">{meeting?.status}</Tag>
          </div>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />}>Export</Button>
        </Space>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Lead Contact" className="lg:col-span-1">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
              {lead?.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <div className="font-bold">{lead?.name}</div>
              <div className="text-sm text-gray-600">{lead?.company}</div>
              <div className="text-sm text-gray-600">{lead?.email}</div>
              <div className="text-sm text-gray-600">{lead?.phone}</div>
            </div>
          </div>
        </Card>

        <Card title="Meeting Details" className="lg:col-span-1">
          <div className="space-y-3">
            <div>
              <Text strong>Date:</Text> {meeting?.date}
            </div>
            <div>
              <Text strong>Time:</Text> {meeting?.time}
            </div>
            <div>
              <Text strong>Type:</Text> <Tag>{meeting?.type}</Tag>
            </div>
            <div>
              <Text strong>Status:</Text> <Tag color="green">{meeting?.status}</Tag>
            </div>
          </div>
        </Card>

        <Card title="Participants" className="lg:col-span-1">
          <div className="space-y-3">
            {meeting?.participants.map((participant, index) => (
              <div key={index} className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs mr-3">
                  {participant.split(' ').map(n => n[0]).join('')}
                </div>
                <Text>{participant}</Text>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <Tabs
          items={tabItems}
          tabBarStyle={{ marginBottom: 0 }}
        />
      </Card>

      <Card title="AI Smart Summary" className="mt-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white mr-3">
            AI
          </div>
          <Tag color="purple">AI Generated</Tag>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <Text strong className="text-lg">Key Discussion Points</Text>
            </div>
            <ul className="space-y-2">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <Text strong className="text-lg">Action Items</Text>
            </div>
            <ul className="space-y-2">
              {actionItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <Button
                    size="small"
                    className="mr-3"
                    type="primary"
                    ghost
                  >
                    To do
                  </Button>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Divider className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-3">
              <Text strong className="text-lg">Decisions Made</Text>
            </div>
            <ul className="space-y-2">
              {decisions.map((decision, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {decision}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="flex items-center mb-3">
              <Text strong className="text-lg">Next Steps</Text>
            </div>
            <ul className="space-y-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">→</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Structured Data Extraction" className="mt-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white mr-3">
            📊
          </div>
          <Tag color="green">AI Extracted</Tag>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium">Product/Service</th>
                <th className="text-left p-3 font-medium">Quantity</th>
                <th className="text-left p-3 font-medium">Value</th>
                <th className="text-left p-3 font-medium">Deadline</th>
                <th className="text-left p-3 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">Enterprise Software</td>
                <td className="p-3">500-1,200 users</td>
                <td className="p-3">$45,000</td>
                <td className="p-3">Q1 2025</td>
                <td className="p-3">
                  <Tag color="green">High</Tag>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">CRM Integration</td>
                <td className="p-3">1 project</td>
                <td className="p-3">Included</td>
                <td className="p-3">February 2025</td>
                <td className="p-3">
                  <Tag color="orange">Medium</Tag>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
