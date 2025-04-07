import React from 'react'
import {Space, Card, Avatar, Statistic} from "antd";

export default function profile() {
  return (
    
    <Space className='items-center' direction="vertical" size={16}>
        
        <Card title="Hei (USER)"  style={{ width: 400 }}>
             <Avatar size={'large'}></Avatar>
           
          <p>Esimerkki</p>
          <Statistic title="hei">
            moi
          </Statistic>
   
        </Card>
     
      </Space>
    
  )
}
