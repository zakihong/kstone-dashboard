/*
 * Tencent is pleased to support the open source community by making TKEStack
 * available.
 *
 * Copyright (C) 2012-2023 Tencent. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 * this file except in compliance with the License. You may obtain a copy of the
 * License at
 *
 * https://opensource.org/licenses/Apache-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OF ANY KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations under the License.
 */

import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout as AntdLayout, Menu } from 'antd';
import { ClusterOutlined } from '@ant-design/icons';
import logo from '../../src/logo.png';

import './Layout.css';

const { Header, Content, Sider } = AntdLayout;
const { SubMenu } = Menu;

const Layout = ({ menu }: { menu: any }): JSX.Element => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <AntdLayout style={{ height: '100%' }}>
      <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: 0 }}>
        <div className='logo'>
          <img
            src={logo}
            alt='logo'
            width='150px'
          />
        </div>
      </Header>
      <Content style={{ marginTop: '50px', height: '100%' }}>
        <AntdLayout style={{ minHeight: '100%' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed) } style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }} >
            <Menu
              mode='inline'
              // defaultSelectedKeys={['cluster']}
              defaultOpenKeys={menu.items.map((item: any) => (item.key))}
              style={{ height: '100%' }}
              theme='dark'
            >
              {
                menu.items.map((item: any) => {
                  if ('items' in item) {
                    return (
                      <SubMenu key={item.key} icon={<ClusterOutlined />} title={item.title}>
                        {
                          item.items.map((subItem: any) => {
                            return (
                              <Menu.Item key={subItem.key}><Link to={subItem.route}>{subItem.title}</Link></Menu.Item>
                            );
                          })
                        }
                      </SubMenu>
                    );
                  } else {
                    return <Menu.Item key={item.key}><Link to={item.route}>{item.title}</Link></Menu.Item>;
                  }
                })
              }
            </Menu>
          </Sider>
          <AntdLayout className='site-layout' style={(() => {
            if (collapsed) {
              return { marginLeft: '80px', minHeight: '100%' };
            } else {
              return { marginLeft: '200px', minHeight: '100%' };
            }
          })()}>
            <Outlet></Outlet>
          </AntdLayout>
        </AntdLayout>
      </Content>
    </AntdLayout>
  );
};

export default Layout;

