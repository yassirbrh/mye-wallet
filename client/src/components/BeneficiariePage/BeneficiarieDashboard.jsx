import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    margin: '0 auto',
    width: '60%'
};

const formSectionInputStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    flex: 1
};

const formSectionButtonStyle = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#44c1f7',
    color: 'white',
    cursor: 'pointer'
};

const profileListStyle = {
    flex: 1,
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto'
};

const profileItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    backgroundColor: '#fff',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
};

const profileItemImgStyle = {
    width: '50px',
    height: '50px',
    borderRadius: '50%'
};

const profileDetailsStyle = {
    display: 'flex',
    flexDirection: 'column'
};

const profileUsernameStyle = {
    fontWeight: 'bold',
    fontSize: '16px'
};

const profileFullnameStyle = {
    fontSize: '14px',
    color: '#888'
};

const deleteButtonStyle = {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#f44336',
    color: 'white',
    cursor: 'pointer',
    marginRight: '0', // Remove any default margin
    marginLeft: 'auto' // Push the button to the right
};


const BeneficiarieDashboard = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [searchPattern, setSearchPattern] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        const fetchBeneficiaries = async () => {
            try {
                const { data } = await axios.get('/api/users/getmybeneficiaries');
                const { listOfBeneficiaries } = data;

                const beneficiariesWithPhotos = await Promise.all(
                    listOfBeneficiaries.map(async (beneficiary) => {
                        try {
                            const photoResponse = await axios.post('/api/users/getphotobyusername', {
                                userName: beneficiary.userName
                            }, { responseType: 'arraybuffer' }); // Fetch as binary data

                            // Convert binary data to Base64 URL
                            const base64Flag = `data:${photoResponse.headers['content-type']};base64,`;
                            const base64Image = base64Flag + btoa(
                                String.fromCharCode(...new Uint8Array(photoResponse.data))
                            );

                            return {
                                ...beneficiary,
                                photo: base64Image
                            };
                        } catch (error) {
                            //console.error(`Failed to fetch photo for ${beneficiary.userName}`, error);
                            return { ...beneficiary, photo: null };
                        }
                    })
                );

                setBeneficiaries(beneficiariesWithPhotos);
            } catch (error) {
                console.error('Failed to fetch beneficiaries', error);
            }
        };

        fetchBeneficiaries();
    }, []);

    const handleSearch = async () => {
        try {
            if (searchPattern) {
                const { data } = await axios.post('/api/users/searchbeneficiaries', {
                    beneficiariePattern: searchPattern
                });
                const beneficiariesWithPhotos = await Promise.all(
                    data.listOfBeneficiaries.map(async (beneficiary) => {
                        try {
                            const photoResponse = await axios.post('/api/users/getphotobyusername', {
                                userName: beneficiary.userName
                            }, { responseType: 'arraybuffer' }); // Fetch as binary data

                            // Convert binary data to Base64 URL
                            const base64Flag = `data:${photoResponse.headers['content-type']};base64,`;
                            const base64Image = base64Flag + btoa(
                                String.fromCharCode(...new Uint8Array(photoResponse.data))
                            );

                            return {
                                ...beneficiary,
                                photo: base64Image
                            };
                        } catch (error) {
                            //console.error(`Failed to fetch photo for ${beneficiary.userName}`, error);
                            return { ...beneficiary, photo: null };
                        }
                    })
                );
                setSearchResults(beneficiariesWithPhotos); // Populate search results
            }
        } catch (error) {
            console.error('Failed to search beneficiaries', error);
        }
    };

    const handleDelete = async (userName) => {
        try {
            await axios.post('/api/users/deletebeneficiarie', { userName });
            setBeneficiaries((prev) => prev.filter((beneficiary) => beneficiary.userName !== userName));
        } catch (error) {
            console.error('Failed to delete beneficiary', error);
        }
    };    

    return (
        <div className="dashboard" style={{ flexDirection: 'column', flex: 1 }}>
            <div className="form-section" style={formSectionStyle}>
                <input
                    type="text"
                    placeholder="Enter Username"
                    value={searchPattern}
                    onChange={(e) => setSearchPattern(e.target.value)}
                    style={formSectionInputStyle}
                />
                <button
                    style={formSectionButtonStyle}
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            {/* Search Results */}
            {searchResults.length > 0 && (
                <div className="search-results" style={profileListStyle}>
                    <h1 style={{ fontSize: '16px' }}>Search Results</h1>
                        {searchResults.map((result, index) => {
                            const isBeneficiary = beneficiaries.some(
                                (beneficiary) => beneficiary.userName === result.userName
                            );

                            return (
                                <div key={index} className="profile-item" style={profileItemStyle}>
                                    <img
                                        src={result.photo || 'https://via.placeholder.com/50'}
                                        alt={`${result.userName} Profile Picture`}
                                        style={profileItemImgStyle}
                                    />
                                    <div className="details" style={profileDetailsStyle}>
                                        <div className="username" style={profileUsernameStyle}>@{result.userName}</div>
                                        <div className="fullname" style={profileFullnameStyle}>
                                            {result.firstName} {result.lastName}
                                        </div>
                                    </div>
                                    <button
                                        style={{
                                            ...deleteButtonStyle,
                                            backgroundColor: isBeneficiary ? '#f44336' : 'green',
                                        }}
                                        onClick={async () => {
                                            try {
                                                if (isBeneficiary) {
                                                    await axios.post('/api/users/deletebeneficiarie', {
                                                        userName: result.userName,
                                                    });
                                                    alert('Beneficiarie Deleted!');
                                                } else {
                                                    await axios.post('/api/users/addbeneficiarie', {
                                                        userName: result.userName,
                                                    });
                                                    alert('Beneficiarie Added!');
                                                }
                                                } catch (error) {
                                                    console.error(
                                                        `Failed to ${
                                                        isBeneficiary ? 'delete' : 'add'
                                                        } beneficiarie`,
                                                        error
                                                    );
                                                }
                                        }}
                                    >
                                        {isBeneficiary ? 'Delete' : 'Add'}
                                    </button>
                                </div>
                            );
                        })}
                </div>
            )}


            {/* Profile List */}
            <div className="profile-list" style={profileListStyle}>
                <h1 style={{fontSize: '16px'}}>My Beneficiaries</h1>
                {beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="profile-item" style={profileItemStyle}>
                        <img
                            src={beneficiary.photo || 'https://via.placeholder.com/50'}
                            alt={`${beneficiary.userName} Profile Picture`}
                            style={profileItemImgStyle}
                        />
                        <div className="details" style={profileDetailsStyle}>
                            <div className="username" style={profileUsernameStyle}>@{beneficiary.userName}</div>
                            <div className="fullname" style={profileFullnameStyle}>
                                {beneficiary.firstName} {beneficiary.lastName}
                            </div>
                        </div>
                        <button 
                            style={deleteButtonStyle}
                            onClick={() => handleDelete(beneficiary.userName)}
                        >
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BeneficiarieDashboard;


