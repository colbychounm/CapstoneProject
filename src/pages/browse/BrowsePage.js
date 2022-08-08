import Header from '../../common/Header';
import NavBar from '../../common/NavBar';
import Footer from '../../common/Footer';
import { gql, useLazyQuery, useMutation} from '@apollo/client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import '../browse/BrowsePage.css'
import { Link, useHref, useNavigate } from "react-router-dom";
import {Slider} from "@material-ui/core"

const GET_PRODUCTS = gql`
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

function BrowsePage() {
    // Add variables
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [category, setCategory] = useState("");
    const [size, setSize] = useState("")
    const [color, setColor] = useState("")
    const [mutate, mutateResult] = useMutation(ADD_TO_CART)
    const navigate = useNavigate();
    const [getProducts, resultQuery] = useLazyQuery(GET_PRODUCTS)

    // Get list of Products
    useEffect(() => {
        getProducts()
      }, [getProducts])

    //   Add callback function when changing filter variables
    const updatePriceRange = useCallback((e, data) => {
        setPriceRange(data)
    })

    const handleCategoryChange = useCallback((event)=> {
        setCategory(event.target.value);
    })

    const handleSizeChange = useCallback((event) => {
        setSize(event.target.value)
    })

    // Handle Add to cart event
    const handleSubmit = useCallback((sz, clrs, id) => {
        mutate({
          variables: {
            customerId: "Daisy-0601",
            item: {
              productId: id,
              color: clrs[0].name, 
              size: sz[0]
            }
          }
        })
        alert("Added to your cart");
        navigate("/customer")
      }, [mutate, getProducts])

    if (mutateResult.loading) return <span>Loading...</span>

    // Main
    return <div className="browsepage">
                <Header />
                <NavBar />
                    <div className="browse-container">
                        {/* Side bar */}
                        <div className="sidebar">
                            <h1>FLASH DEAL</h1>

                            <div className="filter-item">
                                <h4>SEARCH</h4>
                                <input type="text" className='search-input' placeholder='Search...' onChange={(event) => {setSearchTerm(event.target.value)}}/>
                            </div>

                            <div className="filter-item">
                                <h4>CATEGORY</h4>
                                <div className="select-input">
                                    <select onChange={handleCategoryChange} className="product-select">
                                        <option value="">Select category</option>
                                        <option value="Suits">Suits</option>
                                        <option value="Tuxedos">Tuxedos</option>
                                        <option value="Dress pants">Dress pants</option>
                                        <option value="Blazers">Blazers</option>
                                        <option value="Outerwear">Outerwear</option>
                                        <option value="Polo's and T-shirt">Polo's and T-shirt</option>
                                        <option value="Shirt">Shirt</option>
                                    </select>
                                </div>
                            </div>

                            <div className="filter-item">
                                <h4>SIZE</h4>
                                <div className="select-input">
                                    <select onChange={handleSizeChange} className="product-select">
                                        <option value="">Select size</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                        <option value="XXXL">XXXL</option>
                                    </select>
                                </div>
                            </div>

                            <div className="filter-item">
                                <h4>COLOR</h4>
                                <div className="color-frame">
                                    <img src="https://cdn-icons-png.flaticon.com/128/190/190446.png" alt="" className="color" onClick={()=>{setColor("")}} />
                                    <div className="color color-black" onClick={()=>{setColor("black")}}></div>
                                    <div className="color color-navy" onClick={()=>{setColor("navy")}}></div>
                                    <div className="color color-grey" onClick={()=>{setColor("grey")}}></div>
                                    <div className="color color-silver" onClick={()=>{setColor("silver")}}></div>
                                    <div className="color color-white" onClick={()=>{setColor("beige")}}></div>
                                </div>
                            </div>

                            <div className="filter-item">
                                <h4>PRICE RANGE</h4>
                                <div className="price-range">
                                <span>{priceRange[0]}</span>
                                <span>{priceRange[1]}</span>
                                </div>
                                <Slider
                                    value={priceRange}
                                    min={0}
                                    max={300}
                                    onChange={updatePriceRange}
                                />
                            </div>
                        </div>

                        {/* Display product list with filters */}
                        <div className="browse-mainpage" >
                        {resultQuery.data?.products.filter((item) =>{
                                if (searchTerm === "") {
                                    return item
                                } else if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                                    return item
                                }                   
                        }).filter((item) => {
                                let cat ="";
                                if (item.categories!=null) {
                                    cat = item.categories[0]
                                }
                                if (category==="") {
                                    return item;
                                } else if (cat === category){
                                    return item;
                                }
                        }).filter((item) => {
                                let sz = "";
                                if (item.sizes!=null) {
                                    sz = item.sizes[0];
                                }
                                if (size==="") {
                                    return item;
                                } else if (sz === size){
                                    return item;
                                }
                        }).filter((item) => {
                                if (color===""){
                                    return item
                                } else if (item.colors[0].name.toLowerCase() === color.toLowerCase()){
                                    return item
                                }                         
                        }).filter((item) => {
                                if (item.price>priceRange[0] && item.price<priceRange[1]){
                                    return item
                                }
                        }).map((item, index) => (                 
                                <div className="product-card" key={index} >
                                    <Link to={`/product-detail/${item.id}`}>
                                        <img src={item.pictures} alt="" className="picture" />
                                        <div className="product-info">
                                            <h4>{item.name}</h4>
                                            <p>Price: ${item.price}</p>
                                        </div>
                                    </Link>
                                    <input type="button" value={"ADD TO CART"} className="btn-add-to-card" onClick={() => {if ((item.sizes.length == 1) && (item.colors.length == 1)) {handleSubmit(item.sizes, item.colors, item.id)} else {navigate(`/product-detail/${item.id}`)}}}/>
                                </div>
                        ))}
                        </div>
                </div>       
                <Footer />
          </div>
}

export default BrowsePage;