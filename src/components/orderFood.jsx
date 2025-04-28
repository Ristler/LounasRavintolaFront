import React, {useEffect, useState} from 'react';
import { Card, Button, message } from "antd";
import { useCart } from '../context/CartContext';
import { getAllFoods } from '../hooks/apiHooks';

let data = []



export default function OrderFood() {


  useEffect(() => {

    const fetchData = async () => {
  
      try {
        data = await getAllFoods();
        setFoodItems(data);
      } catch (error) {
        console.error('Error fetching foods:', error);
        message.error('Virhe tietojen lataamisessa');
      }
    };
    fetchData();
  }
  , []);

  const [foodItems, setFoodItems] = useState(data);
  const { addToCart } = useCart();


  
const handleFood = (food) => {
  addToCart(food);
  message.success(`${food.name} lisätty ostoskoriin!`)
};


const renderFood = (food) => {
  return (
      <Card className='flex flex-col items-center'>
    
        <img className=' w-60 h-48 rounded-2xl' src={food.photo}></img>
        <p>{food.name}</p>
        <p>{food.desc}</p>
        <p>{food.price} €</p>
        <Button type='primary'
          onClick={() => handleFood(food)}
        >Lisää ostoskoriin
      
        </Button>

      </Card>
)}

  return (
    <div>
      <h1 className='text-3xl text-center font-bold'>Valitse ruoka</h1>
          {foodItems.map(food => renderFood(food))}
    </div>
  )
}