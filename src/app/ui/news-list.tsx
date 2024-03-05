'use client';

import {
  useState, useEffect, useRef, useCallback,
} from 'react';
import {
  List, Button, Row, Col, Avatar, Typography,
} from 'antd';
import { ProjectTwoTone } from '@ant-design/icons';
import Link from 'next/link';

import { getStories } from '../lib/data';

import { pageRoutes } from '@/utils/routes';
import type { Story } from '@/types/definitions';
import { generateDate } from '@/utils/helpers';

function StoriesListHeader(
  { onRefresh, isRefreshing }
  : { onRefresh: () => void, isRefreshing: boolean },
): JSX.Element {
  const { Text } = Typography;

  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Avatar src="H-logo.png" />
        <Text strong style={{ marginLeft: 10 }}>Hacker News</Text>
      </Col>
      <Col>
        <Button type="primary" onClick={onRefresh} loading={isRefreshing}>
            Refresh News
        </Button>
      </Col>
    </Row>
  );
}

function StoryItem(
  { story, index }: { story: Story, index: number },
): JSX.Element {
  return (
    <List.Item>
      <List.Item.Meta
        avatar={<ProjectTwoTone />}
        title={
          <Link href={pageRoutes.stories(story.id)}>
            {`${index + 1}. ${story.title}`}
          </Link>
        }
        description={`
          Author: ${story.by} | 
          Rating: ${story.score} | 
          Date: ${generateDate(story.time)}`}
      />
    </List.Item>
  );
}

export default function StoriesList(
  { initialStories }: { initialStories: Story[] },
): JSX.Element {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshNews = useCallback(async () => {
    setIsRefreshing(true);
    const updatedNews = await getStories();
    setStories(updatedNews);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(refreshNews, 60000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [refreshNews]);

  const handleRefreshClick = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await refreshNews();
    intervalRef.current = setInterval(refreshNews, 60000);
  };

  return (
    <>
      <List
        header={
          <StoriesListHeader
            onRefresh={handleRefreshClick}
            isRefreshing={isRefreshing}
          />
        }
        itemLayout="horizontal"
        dataSource={stories}
        renderItem={(story, index) => <StoryItem story={story} index={index} />}
      />
    </>
  );
}
