import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './TopItems.css';
import { FETCHING_ERROR_MESSAGE } from '../constants/errorMessages';


const formatTimeElapsed = (timestamp) => {
    const currentTime = Math.floor(Date.now() / 1000);
    const timeDifference = currentTime - timestamp;
    const hours = Math.floor(timeDifference / 3600);

    if (hours === 1) {
        return '1 hour ago';
    } else if (hours > 1) {
        return `${hours} hours ago`;
    } else {
        return 'just now';
    }
};

const TopItems = () => {
    const [topItems, setTopItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [loadingMore, setLoadingMore] = useState(false);

    const [startIndex, setStartIndex] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchTopItems = async () => {
            try {
                const hackerNewsApiBase = 'https://hacker-news.firebaseio.com/v0/';
                const topStoriesEndpoint = 'topstories.json';
                const itemEndpoint = 'item';

                const response = await fetch(`${hackerNewsApiBase}${topStoriesEndpoint}`);
                const topItemIds = await response.json();

                // Fetch details for each top item
                const itemPromises = topItemIds.slice(0, 10).map(async (itemId) => {
                    const itemResponse = await fetch(`${hackerNewsApiBase}${itemEndpoint}/${itemId}.json`);
                    return itemResponse.json();
                });

                const newItems = await Promise.all(itemPromises);
                setTopItems((prevItems) => [...prevItems, ...newItems]);
                setLoading(false); // Set loading to false once the data is fetched
            } catch (error) {
                console.error('Error fetching top items:', error);
                setError(FETCHING_ERROR_MESSAGE);
            } finally {
                setLoading(false);
            }
        };

        fetchTopItems();
    }, [startIndex]);

    const handleLoadMore = async () => {
        try {
            setLoadingMore(true); //loading to true when load more

            //adding in delay for user experience
            setTimeout(async () => {
            setStartIndex(startIndex + itemsPerPage);
            setLoadingMore(false); // Set load more to false once the new items are loaded
            }, 800); 

        } catch (error) {
            console.error('Error fetching more items:', error);
            setError(FETCHING_ERROR_MESSAGE);
        }
    };

    if (loading) {
        return <div className="loading-spinner"></div>; // loading spinner
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <ul>
                {topItems.map((item, index) => (
                    <li key={item.id}>
                        <div>
                            <span className="number">{index + 1}</span>
                            <Link to={`/item/${item.id}`} className="title">
                                {item.title}
                            </Link>
                        </div>
                        <Link to={`/item/${item.id}`} className="details">
                            <span>{item.score} points</span>
                            <span>{item.descendants} comments</span>
                            <span>{formatTimeElapsed(item.time)}</span>
                        </Link>
                    </li>
                ))}\
            </ul>
            <div className="load-more-container">
                <button
                    className="load-more-button"
                    onClick={handleLoadMore}
                    disabled={loadingMore} // Disable the button while loading
                >
                    {loadingMore ? (
                        <div className="load-more-spinner"></div> // Render the loading spinner when loadingMore is true
                    ) : (
                        'Load More'
                    )}
                </button>
            </div>
        </div>
    );
};

export default TopItems;