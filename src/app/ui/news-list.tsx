'use client';

import { useState, useEffect } from 'react';
import {
  List, Button, Row, Col, Avatar, Typography,
} from 'antd';
import { ProjectTwoTone } from '@ant-design/icons';

import getStories from '../lib/data';

import type { Story } from '@/types/definitions';

function StoriesListHeader({ onRefresh, isLoaded }: { onRefresh: () => void, isLoaded: boolean }) {
  const { Text } = Typography;

  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Avatar src="H-logo.png" />
        <Text strong style={{ marginLeft: 10 }}>Hacker News</Text>
      </Col>
      <Col>
        <Button type="primary" onClick={onRefresh} loading={isLoaded}>
            Обновить новости
        </Button>
      </Col>
    </Row>
  );
}

export default function StoriesList({ initialStories }: { initialStories: Story[] }): JSX.Element {
  const [stories, setStories] = useState<Story[]>(initialStories);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const refreshNews = async () => {
    setIsLoaded(true);
    const updatedNews = await getStories();
    setStories(updatedNews);
    setIsLoaded(false);
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshNews();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <List
        header={<StoriesListHeader onRefresh={refreshNews} isLoaded={isLoaded} />}
        itemLayout="horizontal"
        dataSource={stories}
        renderItem={({
          url, title, by, score, time,
        }, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<ProjectTwoTone />}
              title={<a href={url}>{`${index + 1}. ${title}`}</a>}
              description={`Автор: ${by} | Рейтинг: ${score} | Дата: ${new Date(time * 1000).toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    </>
  );
}
