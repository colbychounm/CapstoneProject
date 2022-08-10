import Header from '../../common/Header';
import NavBar from '../../common/NavBar';
import Footer from '../../common/Footer';
import { gql, useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import '../browse/BrowsePage.css'
import { Link, useHref, useNavigate } from "react-router-dom";
import Slider from "@material-ui/core/Slider"
import { GET_PRODUCTS } from '../../data/queries/get-products';
import { ADD_TO_CART } from '../../data/mutations/add-to-cart';
import { customerId } from '../main/MainPage';

function BrowsePage() {
    // Add variables
    const [searchTerm, setSearchTerm] = useState("");
    const [priceRange, setPriceRange] = useState([0, 300]);
    const [category, setCategory] = useState("");
    const [size, setSize] = useState("");
    const [color, setColor] = useState("");
    const [colorSelected, setColorSelected] = useState(new Array(6).fill(false));

    const [mutate, mutateResult] = useMutation(ADD_TO_CART)
    const navigate = useNavigate();
    const [getProducts, resultQuery] = useLazyQuery(GET_PRODUCTS)
    let itemsSizeFilter = [];
    let itemsColorFilter = []

    // Get list of Products
    useEffect(() => {
        getProducts()
    }, [getProducts])

    //   Add callback function when changing filter variables
    const updatePriceRange = useCallback((e, data) => {
        setPriceRange(data)
    })

    const handleCategoryChange = useCallback((event) => {
        setCategory(event.target.value);
    })

    const handleSizeChange = useCallback((event) => {
        setSize(event.target.value)
    })

    // Handle Add to cart event
    const handleSubmit = useCallback((sz, clrs, id) => {
        mutate({
            variables: {
                customerId: customerId,
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

    // Handle select color
    const handleSelectColor = useCallback((index, color) => {
        setColor(color)
        const arr = [...colorSelected]
        arr.fill(false)
        arr[index] = true
        setColorSelected(arr)
    }, [])

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
                    <input type="text" className='search-input' placeholder='Search...' onChange={(event) => { setSearchTerm(event.target.value) }} />
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
                        <div onClick={() => { handleSelectColor(0, "") }}>
                            <img src="https://cdn-icons-png.flaticon.com/128/190/190446.png" alt="" className='color' />
                        </div>
                        <div className="color color-black" onClick={() => { handleSelectColor(1, "black") }}>
                            <div className={colorSelected[1] ? "color-selected" : "color-nonselected"}><i className="fas fa-check-circle"></i></div>
                        </div>
                        <div className="color color-navy" onClick={() => { handleSelectColor(2, "navy") }}>
                            <div className={colorSelected[2] ? "color-selected" : "color-nonselected"}><i className="fas fa-check-circle"></i></div>
                        </div>
                        <div className="color color-grey" onClick={() => { handleSelectColor(3, "grey") }}>
                            <div className={colorSelected[3] ? "color-selected" : "color-nonselected"}><i className="fas fa-check-circle"></i></div>
                        </div>
                        <div className="color color-silver" onClick={() => { handleSelectColor(4, "silver") }}>
                            <div className={colorSelected[4] ? "color-selected" : "color-nonselected"}><i className="fas fa-check-circle"></i></div>
                        </div>
                        <div className="color color-white" onClick={() => { handleSelectColor(5, "beige") }}>
                            <div className={colorSelected[5] ? "color-selected" : "color-nonselected"}><i className="fas fa-check-circle"></i></div>
                        </div>
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
                {resultQuery.data?.products.filter((item) => {
                    if (searchTerm === "") {
                        return item
                    } else if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
                        return item
                    }
                }).filter((item) => {
                    let cat = "";
                    if (item.categories != null) {
                        cat = item.categories[0]
                    }
                    if (category === "") {
                        return item;
                    } else if (cat === category) {
                        return item;
                    }
                }).filter((item) => {
                    let sz = [];
                    if (item.sizes != null) {
                        sz = item.sizes;
                    }
                    console.log(sz)
                    if (size === "") {
                        return item;
                    } else if (size !== "") {
                        sz.forEach((itemSize) => {
                            if (size === itemSize) 
                                itemsSizeFilter.push(item)
                        })
                        return itemsSizeFilter.includes(item)
                    }
                }).filter((item) => {
                    let clr = [];
                    if (item.colors != null) {
                        clr = item.colors;
                    }

                    if (color === "") {
                        return item
                    } else if (color !== "") {
                        clr.forEach((itemColor) => {
                            if (itemColor.name.toLowerCase() === color.toLowerCase()) {
                                itemsColorFilter.push(item)
                            }
                        })
                        return itemsColorFilter.includes(item)
                    }
                }).filter((item) => {
                    if (item.price > priceRange[0] && item.price < priceRange[1]) {
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
                        <input type="button" value={"ADD TO CART"} className="btn-add-to-card" onClick={() => { if ((item.sizes.length == 1) && (item.colors.length == 1)) { handleSubmit(item.sizes, item.colors, item.id) } else { navigate(`/product-detail/${item.id}`) } }} />
                    </div>
                ))}
            </div>
        </div>
        <Footer />
    </div>
}

export default BrowsePage;