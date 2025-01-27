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

import { useState, useEffect, useCallback } from 'react';
import {
  Layout,
  Typography,
  Select,
  Table,
  Empty
} from 'antd';
import http from 'src/utils/http';
import { FormatBytes } from 'src/utils/common';

const { Text } = Typography;
const { Header, Content } = Layout;

const BackupAnnotationKey = 'backup';

export function Backup(): JSX.Element {
  const [clusterList, setClusterList] = useState([]);
  const [clusterName, setClusterName] = useState('');
  const [backupInfo, setBackupInfo] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false);

  const columnList = [
    {
      key: 'Key',
      header: '文件名称',
      width: 200,
      render: (item: any) => (
        <>
          <p>{item.Key}</p>
        </>
      ),
    },
    {
      key: 'StorageClass',
      header: '存储级别',
      width: 100,
      render: (item: any) => (
        <>
          <p>{item.StorageClass}</p>
        </>
      ),
    },
    {
      key: 'LastModified',
      header: '最后更新时间',
      width: 100,
      render: (item: any) => (
        <>
          <p>{item.LastModified}</p>
        </>
      ),
    },
    {
      key: 'Size',
      header: '文件大小',
      width: 100,
      render: (item: any) => (
        <>
          <p>{FormatBytes(item.Size, 3)}</p>
        </>
      ),
    },
  ];

  const getEtcdCluster = useCallback(async () => {
    setIsLoading(true);
    http.get('/apis/etcdclusters').then((resp) => {
      if (resp.data.items.length) {
        setClusterList(resp.data.items);
        setClusterName(resp.data.items[0].metadata.name);
        updateBackupInfo(resp.data.items[0].metadata.name, resp.data.items);
        setIsLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    getEtcdCluster();
  }, [getEtcdCluster]);

  const selectCluster = (clusterName: any) => {
    setClusterName(clusterName);
    updateBackupInfo(clusterName, clusterList);
  };

  const updateBackupInfo = (clusterName: any, clusterList: any) => {
    let cluster: any = {};
    clusterList.map((item: any) => {
      if (item.metadata.name === clusterName) {
        cluster = item;
        console.log(cluster);
        console.log(cluster.metadata.annotations[BackupAnnotationKey]);
        if (cluster.metadata.annotations[BackupAnnotationKey] === undefined) {
          setBackupInfo(undefined);
        } else {
          http.get(`/apis/backup/${clusterName}`).then((resp) => {
            let result = resp.data;
            if (result === undefined) {
              result = [];
            }
            setBackupInfo(result);
          });
        }
      }
      return item;
    });
  };

  return (<Layout>
    <Header className='site-layout-background' style={{ padding: 0 }}>
      <Text strong style={{ float: 'left', marginLeft: '15px', marginRight: '15px' }}>备份管理</Text>
    </Header>
    <Content
      className='site-layout-background'
      style={{
        margin: '30px 30px',
        padding: 24,
        minHeight: 280,
      }}
    >
      <Header className='site-layout-background' style={{ padding: '0px' }}>
        <span>选择集群：</span>
        <Select
          value={clusterName}
          onChange={(value) => selectCluster(value)}
          placeholder='请选择etcd集群'
        >
          {
            clusterList.map((item: any) => {
              return <Select.Option
                key={item.metadata.name}
                value={item.metadata.name}>{item.metadata.name}</Select.Option>;
            })
          }
        </Select>
      </Header>
      {
        backupInfo === undefined ? (
          <Empty description={`{集群${clusterName}暂未开启备份功能}`} />
        ) : (<Table
          dataSource={backupInfo}
          columns={columnList}
          style={{ marginTop: '10px' }}
          loading={isLoading}
        />)
      }
    </Content>
  </Layout>);
}