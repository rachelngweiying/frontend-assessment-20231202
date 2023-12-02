import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ItemDetail from '../components/ItemDetail';
import './ItemDetailPage.css';

const ItemDetailPage = ({ itemId }) => {
    const handleGoBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        
        <div>
            <ItemDetail itemId={itemId} />
            <button className="go-back-to-top" onClick={handleGoBackToTop}>
                Go back to top
            </button>
        </div>
    );
};

export default ItemDetailPage;