'use client';

import {
  Row, Col, Typography, Divider,
} from 'antd';

import NavLink from './nav-link';

import type { Story } from '@/types/definitions';
import { useStory } from '@/app/hooks';
import { generateDate } from '@/utils/helpers';

export default function StoryHeader(
  { story }: { story: Story },
): JSX.Element {
  const { story: contextStory } = useStory();
  const { Title, Text } = Typography;

  return (
    <>
      <NavLink />
      <header style={{ marginTop: 20 }}>
        <Row align="middle" gutter={[16, 16]}>
          <Col>
            <Title level={4} style={{ marginBottom: 0, marginTop: 0 }}>
              <a href={story.url} target="_blank" rel="noopener noreferrer">
                {story.title}
              </a>
            </Title>
          </Col>
        </Row>
        <Row align="middle">
          <Col>
            <Text>Author: {story.by}</Text>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Text>Date: {generateDate(story.time)}</Text>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Text>
              Comments: {contextStory?.descendants ?? story.descendants}
            </Text>
          </Col>
        </Row>
      </header>
    </>
  );
}
