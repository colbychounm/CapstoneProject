import React from 'react';
import Header from '../../common/Header';
import NavBar from '../../common/NavBar';
import Footer from '../../common/Footer';
import '../browse/ProductDetail.css'
import { gql, useLazyQuery, useMutation} from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';

const GET_PRODUCT_DETAIL = gql`
 query {
    products {
      id
      name
      price
      stock
      colors {
        name
        hexValue
      }
      description
      categories
      pictures
      sizes
      featuringFrom
      featuringTo
    }
  }
`

export const ADD_TO_CART = gql`
    mutation AddItemToCart($customerId: ID!, $item: CartItemInput!) {
        addItemToCart(customerId: $customerId, item: $item) {
        id
        }
    }
`


function ProductDetail() {
  // Add variables
    const paramValues = useParams();
    const pageId = paramValues.id;
    const [size, setSize] = useState("");
    const [Id, setId] = useState(pageId);
    const [color, setColor] = useState([]);
    const [hexVal, setHexVal] = useState();
    const [picture, setPicture] = useState("");
    const [getProductDetail, result] = useLazyQuery(GET_PRODUCT_DETAIL);
    const [mutate, mutateResult] = useMutation(ADD_TO_CART)

    // Get product details
    useEffect(() => {
        getProductDetail();
      }, [getProductDetail]);

    // Get product details based on its ID, get colors for later use
    let data = [];
    let colors = [];
    result.data?.products.forEach(value => {
        if (value.id === pageId){
            data = value;
            colors = value.colors[0];
        }
    });

    // Get the default picture when loading page
    var pic = data.pictures?.[0]
    useEffect(() => {
      setPicture(pic)
    }, [data.pictures])

    // Add function to handle Changes
    const handleSizeChange = useCallback((event) => {
      setSize(event.target.value)
    }, [size])

    const handleChangePicture = useCallback((event) => {
      setPicture(event.target.src);      
    })

    // Handle Add to cart event
    const handleSubmit = useCallback(() =>{
        mutate({
          variables: {
            customerId: "Daisy-0601",
            item: {
              productId: Id,
              color: color, 
              size: size
            }
          }
        })
        alert("Added to your cart");
      }, [Id, color, size, mutate, getProductDetail])

    if (mutateResult.loading) return <span>Loading...</span>

    // Main
    return <div className='productdetail'>
            <Header />
            <NavBar />
            <div className='product-detail-container'>
                {/* Display images list */}
                <div className='product-img-list'>
                  {data.pictures?.map((p, index) => (
                      <img src={p} alt="" key={index} onClick={handleChangePicture} className='img-in-list'/>
                  ))}
                </div>
                {/* Display default image */}
                <div className="product-img-main">
                    <img src={picture} alt="" className='img-main'/>
                </div>
                {/* Display product details */}
                <div className="product-details">
                  <div>
                    <h2 className="detail-item">{data.name}</h2>
                    <p className="fs-15 detail-item" style={{color: "red"}}>${data.price}</p>
                    <hr style={{width: "90%", opacity: "0.5"}}/>
                  </div>

                  <div>
                    <h4 className="detail-item">DESCRIPTION</h4>
                    <p className="detail-item">{data.description}</p>
                  </div>

                    <div className="detail-item input-features">
                        <div style={{width: "40%", marginRight: "40px"}}>
                            <h4 className="detail-item">SELECT SIZE</h4>
                            <div className="select-input detail-item">
                                <select onChange={handleSizeChange} className="product-select">
                                <option value="">Select size</option>
                                  {data.sizes?.map((sz, index) => (
                                    <option value={sz}>{sz}</option>
                                  ))}
                                </select>
                            </div>
                        </div>

                        <div style={{width: "40%"}}>
                            <h4 className="detail-item">SELECT COLOR</h4>             
                              <div className="color-frame detail-item" style={{justifyContent: "flex-start"}}>
                                {data.colors?.map((c, index) => (
                                  <div className="color mr-10" style={{backgroundColor: `${c.hexValue}`}} key={index} onClick={() => {setColor(c.name)}}></div>
                                ))}
                              </div>
                        </div>
                    </div>
                    <div>
                      <h4 className="detail-item">STOCK</h4>
                      <p className="detail-item">{data.stock}</p>
                    </div>
                    <input type="button" onClick={handleSubmit} value={"ADD TO CART"} className="btn-add-to-card btn-detail" />
                </div>
            </div>
            <Footer />
        </div>
    
}

export default ProductDetail;