'use client';

import {
  Row, Col, Typography, Divider,
} from 'antd';

import type { Story } from '@/types/definitions';

export default function StoryHeader(
  { story }: { story: Story },
): JSX.Element {
  const { Title, Text } = Typography;

  return (
    <header>
      <Row align="middle" gutter={[16, 16]}>
        <Col>
          <Title level={4} style={{ marginBottom: 0, marginTop: 0 }}>
            <a href={story.url} target="_blank" rel="noopener noreferrer">{story.title}</a>
          </Title>
        </Col>
      </Row>
      <Row align="middle">
        <Col>
          <Text>Author: {story.by}</Text>
        </Col>
        <Divider type="vertical" />
        <Col>
          <Text>Date: {new Date(story.time * 1000).toLocaleDateString()}</Text>
        </Col>
        <Divider type="vertical" />
        <Col>
          <Text>Comments: {story.descendants}</Text>
        </Col>
      </Row>
    </header>
  );
}
