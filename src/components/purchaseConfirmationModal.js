import React, { Component} from 'react'
import errorImg from '../images/error.jpg'



const purchaseConfirmationModal = props => {
  const { item } = props

  return (
    <div className="modalContainer">
      <div className="modalContent">
        <img id="selected-item"   src={`${baseurl}/user${this.props.selectedItem.user.id}item${this.props.selectedItem.id}.jpg`} alt="selected item image" onError={(e)=>{e.target.onerror = null; e.target.src=errorImg}/>
        <div>@{item.user.username}</div>
        <p>Size: {item.size}</p>
        <p>Brand: {item.brand}</p>
        <button
          className="large green button"
          onClick={props.purchaseItem}>
          Confirm Purchase
        </button>
        <button
          className="large red button"
          onClick={props.toggleModal}>
          Return
        </button>
      </div>
    </div>
  )
}
