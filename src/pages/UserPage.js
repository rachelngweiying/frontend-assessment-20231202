import React from 'react';
import { useParams } from 'react-router-dom';
import UserDetail from '../components/UserDetail';

const UserPage = () => {
    const { userId } = useParams();
    const handleGoBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            <UserDetail userId={userId} />
            <button className="go-back-to-top" onClick={handleGoBackToTop}>
                Go back to top
            </button>
        </div>
    );
};

export default UserPage;
