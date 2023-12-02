import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ItemDetail.css';
import { ITEM_NOT_FOUND_MESSAGE, FETCHING_ERROR_MESSAGE } from '../constants/errorMessages';

const ItemDetail = () => {
    const { itemId } = useParams();
    const [item, setItem] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json`);
                const data = await response.json();

                if (!data) {
                    setError(ITEM_NOT_FOUND_MESSAGE);
                    return;
                }

                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
                setError(FETCHING_ERROR_MESSAGE);
            }     
    };

        fetchData();
    }, [itemId]);

    return (
        <div className="item-detail">
            <Link to="/" className="back-button">
                Back
            </Link>
            {item && (
                <>
                    <h1>
                        <a
                            href={item.url}
                            target="_blank" // Open the link in a new tab
                            rel="noopener noreferrer" // Security best practice when using target="_blank"
                            className="item-title-link"
                        >
                            {item.title}
                        </a>
                    </h1>
                    <p className="caption">
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            Click to read the full article
                        </a>
                    </p>
                    <p className="content"></p>
                    {item.kids && (
                        <div className="comments">
                            <h2>Comments</h2>
                            {item.kids.map((commentId) => (
                                <Comment key={commentId} commentId={commentId} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const Comment = ({ commentId }) => {
    const [comment, setComment] = useState(null);
    const [showReplies, setShowReplies] = useState(false);
    const [nestedComments, setNestedComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userKarma, setUserKarma] = useState(null);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json`);
                const data = await response.json();
                setComment(data);

                const userResponse = await fetch(`https://hacker-news.firebaseio.com/v0/user/${data.by}.json`);
                const userData = await userResponse.json();
                setUserKarma(userData.karma);

                if (data.kids) {
                    const nestedCommentsData = await Promise.all(
                        data.kids.map(async (nestedCommentId) => {
                            const nestedCommentResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${nestedCommentId}.json`);
                            const nestedCommentData = await nestedCommentResponse.json();
                            return nestedCommentData;
                        })
                    );
                    setNestedComments(nestedCommentsData);

                    // Fetch user data for the comment author to get karma
                    const userResponse = await fetch(`https://hacker-news.firebaseio.com/v0/user/${data.by}.json`);
                    const userData = await userResponse.json();
                    setUserKarma(userData.karma);
                }
            } catch (error) {
                console.error('Error fetching comment:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchComment();
    }, [commentId]);

    const handleToggleReplies = () => {
        setShowReplies(!showReplies);
    };

    return (
        <div className="comment">
            {loading ? (
                <div className="loading-spinner"></div>
            ) : (
                <>{comment && (
                    <>
                            <div
                                className="comment-content"
                                dangerouslySetInnerHTML={{ __html: comment.text }}
                            />
                            <div className="comment-info">
                                <p>
                                    Commented by{' '}
                                    <Link to={`/user/${comment.by}`} className="comment-info-bold">
                                        {comment.by}
                                    </Link>{' '}
                                    on{' '}
                                    <span className="comment-info-bold">
                                        {new Date(comment.time * 1000).toLocaleString()}
                                    </span>
                                </p>
                                <p>
                                    Has{' '}
                                    <Link to={`/user/${comment.by}`} className="comment-info-bold">
                                        {userKarma} Karma
                                    </Link>
                                </p>                            
                            {comment.descendants}{' '}
                            {comment.kids && (
                                <div className="reply-container">
                                    <button
                                        className={`reply-button ${showReplies ? 'show-replies' : 'hide-replies'}`}
                                        onClick={handleToggleReplies}
                                    >
                                        {showReplies ? 'Hide Replies' : 'Show Replies'}
                                    </button>
                                </div>
                            )}
                        </div>
                        {showReplies && (
                            <div className="nested-comments">
                                {nestedComments.map((nestedCommentData) => (
                                    <Comment key={nestedCommentData.id} commentId={nestedCommentData.id} />
                                ))}
                            </div>
                        )}
                    </>
                )}
                </>
            )}
        </div >
    );
};

export default ItemDetail;