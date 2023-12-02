import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import { Link, useLocation } from 'react-router-dom';
import './UserDetail.css';

const UserDetail = ({ userId }) => {
    const [userData, setUserData] = useState(null);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const referrer = new URLSearchParams(location.search).get('referrer') || '/';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://hacker-news.firebaseio.com/v0/user/${userId}.json`);
                const userData = await response.json();
                setUserData(userData);
                setLoading(false); 
            } catch (error) {
                console.error('Error fetching top items:', error);
                setError(FETCHING_ERROR_MESSAGE);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <div className="loading-spinner"></div>; // loading spinner
    }

    return (
        <div>
            <Link to={referrer} className="back-button">
                Back to Article
            </Link>
            {userData && (
                <>
                    <h1>{userData.id}</h1>
                    <p><center>Created on <strong>{new Date(userData.created * 1000).toDateString()}</strong></center></p>
                    <p><center><strong>{userData.karma}</strong> Karma</center></p>
                    {userData.about && (
                        <div>
                            <h2>About:</h2>
                            <p className="small-text" dangerouslySetInnerHTML={{ __html: userData.about }} />
                        </div>
                    )}
                    <div>
                        <ul>
                            {userData.submitted.map((itemId) => (
                                <li key={itemId}>
                                    <a href={`https://news.ycombinator.com/item?id=${itemId}`} target="_blank" rel="noopener noreferrer">
                                        View Submission {itemId}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserDetail;
