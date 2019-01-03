import React, { Component} from 'react'
import errorImg from '../images/error.jpg'
import { connect } from 'react-redux'
import { baseurl } from '../APIEndpoint.js'



const purchaseConfirmationModal = props => {
  const { toggleModal, purchaseItem } = props
  // const baseurl = "https://res.cloudinary.com/repop/image/upload/v1545005116/"

  return (
    <div className="modalContainer" onClick={toggleModal}>
      <div className="modalContent" onClick={e => e.stopPropagation()}>
        <div id="selected-item-small">
          <img  src={`${baseurl}/user${props.selectedItem.user.id}item${props.selectedItem.id}.jpg`} alt="selected item image" onError={(e)=>{e.target.onerror = null; e.target.src=errorImg}}/>
        </div>
        <div id="button-container">
          <button
            className="large green button"
            onClick={purchaseItem}>
            Pay ${props.selectedItem.price}
          </button>
          <button
            className="large red button"
            onClick={toggleModal}>
            Return
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    selectedItem: state.items.selectedItem

  }
}

export default connect(mapStateToProps)(purchaseConfirmationModal)
