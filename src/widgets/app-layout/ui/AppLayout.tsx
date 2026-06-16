import { CalculatorOutlined, FileTextOutlined, FormOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Layout, Menu, Segmented, Typography } from 'antd'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { routePaths } from '../../../app/routes/config/routePaths'
import {
  type AppLanguage,
  i18nStorageKey,
  languageLabels,
  languages,
} from '../../../shared/config/i18n'

const { Content, Header, Sider } = Layout
const { Text, Title } = Typography

export function AppLayout() {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const menuItems: MenuProps['items'] = [
    {
      key: routePaths.policies,
      icon: <FileTextOutlined />,
      label: t('navigation.policies'),
    },
    {
      key: routePaths.calculator,
      icon: <CalculatorOutlined />,
      label: t('navigation.calculator'),
    },
    {
      key: routePaths.policyCreate,
      icon: <FormOutlined />,
      label: t('navigation.newPolicy'),
    },
  ]

  const selectedKey =
    menuItems.find((item) => location.pathname.startsWith(String(item?.key)))?.key ??
    routePaths.policies

  const currentLanguage = languages.includes(i18n.language as AppLanguage)
    ? (i18n.language as AppLanguage)
    : 'ru'

  const handleLanguageChange = (value: string | number) => {
    const nextLanguage = value as AppLanguage

    localStorage.setItem(i18nStorageKey, nextLanguage)
    void i18n.changeLanguage(nextLanguage)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="light" width={240}>
        <div style={{ padding: '24px 20px' }}>
          <Title level={4} style={{ margin: 0 }}>
            {t('app.title')}
          </Title>
          <Text type="secondary">{t('app.subtitle')}</Text>
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
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            {t('app.product')}
          </Title>

          <Segmented
            options={languages.map((language) => ({
              label: languageLabels[language],
              value: language,
            }))}
            value={currentLanguage}
            onChange={handleLanguageChange}
          />
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}