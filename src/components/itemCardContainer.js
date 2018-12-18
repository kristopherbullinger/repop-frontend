import React from 'react'
import ItemCard from './itemCard.js'


const ItemCardContainer = props => {
  const renderCards = () => props.items.map(item => <ItemCard key={item.id} item={item}/>)

  return (
    <div className="cardcontainer">
    {props.items[0] ? renderCards() : <p>There seems to be nothing here...</p>}
    </div>
  )
}

export default ItemCardContainer
