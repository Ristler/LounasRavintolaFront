import React, {useState} from 'react';
import { Card, Button, message } from "antd";
import { useCart } from '../context/CartContext';




//JUST FOR TESTING
const foods = [
  {
    id: 1,
    name: 'Pizza',
    price: 10.99,
    description: 'Mmmm pizza',
    photo: 'https://www.valio.fi/cdn-cgi/image/format=auto/https://cdn-wp.valio.fi/valio-fi/2023/04/36068-pizza.jpeg'
  },
  {
    id: 2,
    name: 'Burger',
    price: 8.99,
    description: 'Juicy e',
    photo: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg'
  },
]



export default function OrderFood() {

  const [foodItems, setFoodItems] = useState(foods);
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
        <p>{food.price} $</p>
        <Button type='primary'
          onClick={() => handleFood(food)}
        >Lisää ostoskoriin
      
        </Button>

      </Card>
)}

  return (
    <div>
          {foodItems.map(food => renderFood(food))}
    </div>
  )
}