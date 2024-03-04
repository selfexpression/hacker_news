import Link from 'next/link';
import { Menu } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

import { pageRoutes } from '@/utils/routes';

export default function NavLink() {
  const items = [
    {
      label: (
        <Link href={pageRoutes.home()}>
          To Home Page
        </Link>
      ),
      key: 'home',
      icon: <HomeOutlined />,
    },
  ];

  return (
    <nav>
      <Menu mode='horizontal' items={items} />
    </nav>
  );
}
