import React from 'react';
import { Modal, Button, Table, Tag, Divider } from 'antd';



//EI TOIMI VIEL, KESKEN!


export default function OrderModal() {
 const [modalVisible, setModalVisible] = React.useState(false);
const [selectedOrder, setSelectedOrder] = React.useState(null);
    const columns = [
    {
        title: 'Tuote',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Hinta',
        dataIndex: 'price',
        key: 'price',
        render: (text) => `${parseFloat(text).toFixed(2)} €`
    },
    {
        title: 'Määrä',
        dataIndex: 'quantity',
        key: 'quantity'
    }
    ];
const handleModalOpen = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
}
const handleModalClose = () => {
    setModalVisible(false);
    setSelectedOrder(null);
}
const handleOrderClick = (order) => {
    handleModalOpen(order);
}

   


 <Modal
 title={`Tilauksen tiedot #${selectedOrder?._id?.substring(0, 6) || 'Tilaus'}`}
 open={modalVisible}
 onCancel={handleModalClose}
 footer={[
   <Button key="close" onClick={handleModalClose}>
     Sulje
   </Button>
 ]}
 width={700}
>
 {selectedOrder && (
   <div className="py-2">
     <div className="mb-4 flex justify-between">
       <div>
         <p className="text-gray-500">
           Tilauspäivä: {new Date(selectedOrder.createdAt || selectedOrder.date).toLocaleDateString('fi-FI')}
         </p>
         <p className="text-gray-500">
           Tila: <Tag color={selectedOrder.status === 'delivered' || selectedOrder.status === 'Delivered' ? 'green' : 'blue'}>
             {selectedOrder.status === 'delivered' || selectedOrder.status === 'Delivered' ? 'Toimitettu' : 'Käsittelyssä'}
           </Tag>
         </p>
       </div>
       <div className="text-right">
         <p className="text-gray-500">Tilausnumero:</p>
         <p className="font-mono">{selectedOrder._id || selectedOrder.id}</p>
       </div>
     </div>

     <Divider className="my-4" />

     <h3 className="text-lg font-medium mb-3">Tilatut tuotteet</h3>
     
     <Table
       dataSource={selectedOrder.items.map((item, index) => ({
         ...item,
         key: index
       }))}
       columns={columns}
       pagination={false}
       summary={pageData => {
         let totalPrice = 0;
         pageData.forEach(item => {
           totalPrice += (parseFloat(item.price) * parseFloat(item.quantity));
         });
         
         return (
           <Table.Summary.Row>
             <Table.Summary.Cell colSpan={3} className="text-right font-medium">
               Yhteensä:
             </Table.Summary.Cell>
             <Table.Summary.Cell className="text-right font-bold">
               {totalPrice.toFixed(2)} €
             </Table.Summary.Cell>
           </Table.Summary.Row>
         );
       }}
     />
   </div>
 )}
</Modal>

}