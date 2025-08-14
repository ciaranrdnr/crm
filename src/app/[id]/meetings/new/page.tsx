'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Form, Input, DatePicker, TimePicker, Select, Button, Switch, Typography, Space, Upload, message } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import dayjs from 'dayjs';
import { Lead } from '@/types';
import { mockLeads } from '@/utils/mock/general';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

const { Title } = Typography;
const { TextArea } = Input;

export default function CreateMeetingPage() {
  const router = useRouter();
  const params = useParams();
  const leadId = params?.id as string;
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const [form] = Form.useForm();
  const [recordingMethod, setRecordingMethod] = useState('live');
  const [aiProcessing, setAiProcessing] = useState({
    smartSummary: true,
    structuredData: true
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [uploadFiles, setUploadFiles] = useState<{
    audio: { name: string } | undefined,
    video: { name: string } | undefined
  }>({
    audio: undefined,
    video: undefined
  });
  const [lead, setLead] = useState<Lead | undefined>();

  const startRecording = () => {
    setIsRecording(true);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    message.success('Recording saved successfully');
  };

  const beforeAudioUpload = (file: File) => {
    const isAudio = ['audio/mpeg', 'audio/wav'].includes(file.type);
    const isLt100MB = file.size / 1024 / 1024 < 100;

    if (!isAudio) {
      message.error('You can only upload MP3/WAV files!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt100MB) {
      message.error('Audio must be smaller than 100MB!');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const beforeVideoUpload = (file: File) => {
    const isVideo = ['video/mp4', 'video/quicktime'].includes(file.type);
    const isLt500MB = file.size / 1024 / 1024 < 500;

    if (!isVideo) {
      message.error('You can only upload MP4/MOV files!');
      return Upload.LIST_IGNORE;
    }
    if (!isLt500MB) {
      message.error('Video must be smaller than 500MB!');
      return Upload.LIST_IGNORE;
    }

    return false;
  };

  const handleAudioChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} audio uploaded successfully`);
      setUploadFiles(prev => ({ ...prev, audio: info.file }));
    }
  };

  const handleVideoChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} video uploaded successfully`);
      setUploadFiles(prev => ({ ...prev, video: info.file }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };


  const onFinish = () => {
    message.success('Meeting created successfully!');
    router.push(`/${leadId}`);
  };

  useEffect(() => {
    const currentLead = mockLeads?.find((lead) => lead?.id == leadId)
    currentLead && setLead(currentLead)
  }, [leadId])

  useEffect(() => {
    form.setFieldsValue({
      type: 'virtual',
      date: dayjs(),
      time: dayjs(),
    });
  }, [form]);


  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push(`/${leadId}`)}
          className="mr-4"
        >
          Back to Lead
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
          <span>Create New Meeting</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Title level={2}>Create New Meeting</Title>
        <Space>
          <Button onClick={() => router.back()}>Cancel</Button>
          <Button type="primary" onClick={() => form.submit()}>Save Meeting</Button>
        </Space>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card title="Lead Information" className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                {lead?.name?.charAt(0)}
              </div>
              <div>
                <div className="font-bold">{lead?.name}</div>
                <div className="text-sm text-gray-600">{lead?.company}</div>
                <div className="flex items-center mt-1">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-1"></span>
                  <span className="text-xs">{lead?.stage}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-600">Email:</span> {lead?.email}</div>
              <div><span className="text-gray-600">Phone:</span> {lead?.phone}</div>
            </div>
          </Card>

          <Card title="Meeting Details" className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                label="Meeting Title"
                name="title"
                rules={[{ required: true }]}
                className="md:col-span-2"
              >
                <Input placeholder="Enterprise Software Discussion" />
              </Form.Item>

              <Form.Item
                label="Date"
                name="date"
                rules={[{ required: true }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Time"
                name="time"
                rules={[{ required: true }]}
              >
                <TimePicker className="w-full" format="HH:mm" />
              </Form.Item>

              <Form.Item
                label="Meeting Type"
                name="type"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="virtual">Virtual</Select.Option>
                  <Select.Option value="phone">Phone</Select.Option>
                  <Select.Option value="in-person">In-person</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item label="Participants" name="participants">
                <Select mode="tags" placeholder="Add participants...">
                  <Select.Option value="sarah.johnson">Sarah Johnson</Select.Option>
                  <Select.Option value="mike.chen">Mike Chen</Select.Option>
                  <Select.Option value="james.wilson">James Wilson</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Meeting Agenda (Optional)"
                name="agenda"
                className="md:col-span-2"
              >
                <TextArea
                  rows={3}
                  placeholder="Discuss enterprise software requirements and pricing..."
                />
              </Form.Item>
            </div>
          </Card>
        </div>

        <Card title="Meeting Capture Method" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${recordingMethod === 'audio' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              onClick={() => setRecordingMethod('audio')}
            >
              <div className="text-center">
                <UploadOutlined className="text-2xl mb-2" />
                <div className="font-medium">Upload Audio File</div>
                <div className="text-sm text-gray-600">MP3, WAV up to 100MB</div>

                {recordingMethod === 'audio' && (
                  <Upload
                    className="mt-2"
                    accept=".mp3,.wav"
                    beforeUpload={beforeAudioUpload}
                    onChange={handleAudioChange}
                    showUploadList={false}
                  >
                    <Button size="small" icon={<UploadOutlined />}>
                      {uploadFiles.audio ? 'Change File' : 'Choose File'}
                    </Button>
                  </Upload>
                )}
                {uploadFiles.audio && recordingMethod === 'audio' && (
                  <div className="mt-2 text-xs text-green-600">
                    {uploadFiles?.audio?.name} selected
                  </div>
                )}
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${recordingMethod === 'video' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              onClick={() => setRecordingMethod('video')}
            >
              <div className="text-center">
                <UploadOutlined className="text-2xl mb-2" />
                <div className="font-medium">Upload Video File</div>
                <div className="text-sm text-gray-600">MP4, MOV up to 500MB</div>

                {recordingMethod === 'video' && (
                  <Upload
                    className="mt-2"
                    accept=".mp4,.mov"
                    beforeUpload={beforeVideoUpload}
                    onChange={handleVideoChange}
                    showUploadList={false}
                  >
                    <Button size="small" icon={<UploadOutlined />}>
                      {uploadFiles.video ? 'Change File' : 'Choose File'}
                    </Button>
                  </Upload>
                )}
                {uploadFiles.video && recordingMethod === 'video' && (
                  <div className="mt-2 text-xs text-green-600">
                    {uploadFiles?.video?.name} selected
                  </div>
                )}
              </div>
            </div>

            <div
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${recordingMethod === 'live' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              onClick={() => setRecordingMethod('live')}
            >
              <div className="text-center">
                <div className={`w-8 h-8 ${isRecording ? 'bg-red-500' : 'bg-blue-500'} rounded-full mx-auto mb-2 flex items-center justify-center transition-colors`}>
                  <div className={`w-4 h-4 bg-white rounded-full ${isRecording ? 'animate-pulse' : ''}`}></div>
                </div>
                <div className="font-medium">Live Recording</div>
                <div className="text-sm text-gray-600">Audio recording with transcript</div>
                {recordingMethod == 'live' ?
                  <Button
                    color={isRecording ? 'danger' : 'primary'}
                    variant='solid'
                    size="small"
                    className="mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      isRecording ? stopRecording() : startRecording();
                    }}
                  >
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Button> : <></>}
              </div>
            </div>
          </div>

          {recordingMethod === 'live' && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isRecording ? 'animate-pulse bg-red-500' : 'bg-green-500'}`}></div>
                <span className="text-sm">{isRecording ? 'Recording in progress' : 'Ready to record'}</span>
                <span className="ml-auto font-mono text-sm">{formatTime(recordingTime)}</span>
              </div>
            </div>
          )}
        </Card>

        <Card title="AI Processing Options" className="mt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Enable AI Smart Summary</div>
                <div className="text-sm text-gray-600">Generate key points and action items</div>
              </div>
              <Switch
                checked={aiProcessing.smartSummary}
                onChange={(checked) => setAiProcessing(prev => ({ ...prev, smartSummary: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Extract Structured Data</div>
                <div className="text-sm text-gray-600">Products, prices, dates, contacts</div>
              </div>
              <Switch
                checked={aiProcessing.structuredData}
                onChange={(checked) => setAiProcessing(prev => ({ ...prev, structuredData: checked }))}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={aiProcessing.smartSummary && aiProcessing.structuredData}
                onChange={(e) => setAiProcessing({
                  smartSummary: e.target.checked,
                  structuredData: e.target.checked
                })}
              />
              <span className="text-sm">Add action items directly to CRM tasks</span>
            </div>
          </div>
        </Card>

        {/* Meeting Notes */}
        <Card title="Meeting Notes" className="mt-6">
          <Form.Item name="notes">
            <TextArea
              rows={6}
              placeholder="Start typing your notes here..."
              className="mb-4"
              showCount
              maxLength={5000}
            />
          </Form.Item>
        </Card>
      </Form>
    </div>
  );
}
