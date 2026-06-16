import { CalculatorOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'

const { Content, Header, Sider } = Layout
const { Text, Title } = Typography

const menuItems: MenuProps['items'] = [
  {
    key: routePaths.policies,
    icon: <FileTextOutlined />,
    label: 'Policies',
  },
  {
    key: routePaths.calculator,
    icon: <CalculatorOutlined />,
    label: 'Calculator',
  },
  {
    key: routePaths.policyCreate,
    icon: <FormOutlined />,
    label: 'New Policy',
  },
]

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const selectedKey =
    menuItems?.find((item) => location.pathname.startsWith(String(item?.key)))?.key ??
    routePaths.policies

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={240}>
        <div style={{ padding: '24px 20px' }}>
          <Title level={4} style={{ margin: 0 }}>
            NSK Insurance
          </Title>
          <Text type="secondary">Agent workspace</Text>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[String(selectedKey)]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            OSAGO Demo
          </Title>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
