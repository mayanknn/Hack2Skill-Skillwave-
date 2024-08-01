import { collection, getDocs, where, query, getFirestore, doc, updateDoc, addDoc } from 'firebase/firestore'; 
import React, { useEffect, useState } from 'react'; 
import { app } from '../../../firebase'; 
import { IoIosClose } from "react-icons/io"; 
import '../../../App.css'; 
 
const db = getFirestore(app); 
 
function Videos() { 
    const [allVideos, setAllVideos] = useState([]); // All fetched videos  
    const [videos, setVideos] = useState([]); // Filtered videos  
    const [teachers, setTeachers] = useState([]); // Changed from single teacher to multiple teachers 
    const [selectedVideo, setSelectedVideo] = useState(null); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const [userRating, setUserRating] = useState(0); 
    const [comments, setComments] = useState(''); 
    const [videoComments, setVideoComments] = useState([]); // Store comments for the selected video 
    const [userList, setUserList] = useState([]); // Store user data 
    const localuser = localStorage.getItem('userData'); 
    const userData = JSON.parse(localuser); 
 
    useEffect(() => { 
        const fetchVideos = async () => { 
            const localFilter = localStorage.getItem('preferencesData'); 
            const filters = JSON.parse(localFilter); 
            console.log("Preference Filtered", filters); 
 
            const q = query(collection(db, 'videos')); 
            const p = query(collection(db, 'users'), where('Role', '==', 'Teacher')); 
 
            const querySnapshot1 = await getDocs(p); 
            const querySnapshot = await getDocs(q); 
 
            const teacherList = querySnapshot1.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
            const videosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
 
            if (!filters) { 
                setAllVideos(videosList); 
                setVideos(videosList); 
            } else { 
                console.log(filters); 
                let filteredVideos = videosList; 
                if (filters[0]?.category && filters[0]?.subCategory) { 
                    filteredVideos = videosList.filter(video => video.category === filters[0].category && video.subCategory === filters[0].subCategory); 
                } else if (filters[0]?.category) { 
                    filteredVideos = videosList.filter(video => video.category === filters[0].category); 
                } 
                setAllVideos(filteredVideos); 
                setVideos(filteredVideos); 
            } 
            setTeachers(teacherList); 
        }; 
 
        fetchVideos(); 
    }, [videos]); 
 
    useEffect(() => { 
        const filteredVideos = allVideos.filter(video => 
            video.Title.toLowerCase().includes(searchQuery.toLowerCase()) 
        ); 
        setVideos(filteredVideos); 
    }, [searchQuery, allVideos]); 
 
    const fetchComments = async (videoId) => { 
        const commentsQuery = query(collection(db, 'comments'), where('videoId', '==', videoId)); 
        const commentsSnapshot = await getDocs(commentsQuery); 
        const commentsList = commentsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
        setVideoComments(commentsList); 
 
        const userCollection = collection(db, 'users'); 
        const usersnapshot = await getDocs(userCollection); 
        const userList = usersnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
        setUserList(userList); 
    }; 
 
    const addComment = async (selectedVideo) => { 
        const commentRef = collection(db, 'comments'); 
        await addDoc(commentRef, { 
            userid: userData.uid, 
            videoId: selectedVideo.id, 
            commentText: comments 
        }); 
        fetchComments(selectedVideo.id); // Refresh comments after adding a new one 
    }; 
 
    const handleVideoClick = async(video) => { 
        setSelectedVideo(video); 
 
        // Get a reference to the 'videos' collection 
        const videoRef = doc(db, "videos", video.id); // Ensure 'video.id' is the correct field for the document ID 
     
        // Update the view count 
        await updateDoc(videoRef, { 
            views: video.views + 1 
        }); 
        fetchComments(video.id);  
    };
 
    const handleCloseVideo = () => { 
        setSelectedVideo(null); 
        setVideoComments([]); // Clearcomments when video is closed 
    }; 
 
    const getTeacherById = (userId) => { 
        return teachers.find(teacher => teacher.uid === userId); 
    }; 
 
    const getUsernameById = (userId) => { 
        const user = userList.find(user => user.uid === userId); 
        return user ? user.Username : 'Unknown User'; 
    }; 
 
    const handleRatingChange = (rating) => { 
        setUserRating(rating); 
    }; 
 
    const submitRating = async (selectedVideo) => { 
        if (selectedVideo) { 
            const videoRef = doc(db, 'videos', selectedVideo.id); 
            await updateDoc(videoRef, { 
                ratings: userRating 
            }); 
 
            // Optionally, calculate and update average rating 
            const updatedVideo = { ...selectedVideo, ratings: [...selectedVideo.ratings, userRating] }; 
            const averageRating = updatedVideo.ratings.reduce((a, b) => a + b, 0) / updatedVideo.ratings.length; 
            await updateDoc(videoRef, { 
                averageRating 
            }); 
 
            // Update local state 
            setVideos(videos.map(video => video.id === selectedVideo.id ? updatedVideo : video)); 
            setSelectedVideo(updatedVideo); 
        } 
    }; 
 
    return ( 
        <div className="my-videos"> 
            <h2 style={{ textAlign: 'center' }}>My Videos</h2> 
           
            {selectedVideo ? ( 
                <div className="video-player"> 
                    <div className="close-button" onClick={handleCloseVideo}> 
                        <IoIosClose className="icon" /> 
                    </div> 
                    <div className="video-container"> 
                        <video controls> 
                            <source src={selectedVideo.videoUpload} type="video/mp4" /> 
                            Your browser does not support the video tag. 
                        </video> 
                    </div> 
                    <div className="video-details"> 
                        <div className="title-and-ratings"> 
                            <br /><br />
                            <div className="star-rating"> 
                                {[5, 4, 3, 2, 1].map(star => ( 
                                    <React.Fragment key={star}> 
                                        <input 
                                            type="radio" 
                                            id={`star${star}`} 
                                            name="rating" 
                                            value={star} 
                                            checked={userRating === star} 
                                            onChange={() => handleRatingChange(star)} 
                                        /> 
                                        <label htmlFor={`star${star}`} title={`${star} star${star > 1 ? 's' : ''}`}>&#9733;</label> 
                                    </React.Fragment> 
                                ))} 
                            </div> 
                            <button onClick={() => { 
                                submitRating(selectedVideo) 
                            }}>Submit Rating</button> 
                        </div> 
                    </div> 
                    <p className="video-views">Views: {selectedVideo.views}</p> 
                    <div className="comments-section"> 
                        <h3 className="comments-title">Comments</h3> 
                        <input type="text" onChange={(e) => setComments(e.target.value)} /> 
                        <button onClick={() => addComment(selectedVideo)}>Add Comment</button> 
                        {videoComments.map(comment => ( 
                            <div key={comment.id} className="comment"> 
                                <h4 className="comment-user">{getUsernameById(comment.userid)}</h4> {/* Dis
play username instead of userid */} 
                                <p className="comment-text">{comment.commentText}</p> 
                            </div> 
                        ))} 
                    </div> 
                </div> 
            ) : ( 
                <div>
                     <input 
                type="text" 
                placeholder="Search videos" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="search-input" 
                style={{width:'20vw',margin:'auto'}}
            /> 
                <ul className="video-list"> 
                    {videos.map((video) => { 
                        const teacherInfo = getTeacherById(video.userid); 
                        console.log(teacherInfo); 
 
                        return ( 
                            <li key={video.id} onClick={() => handleVideoClick(video)} className="video-card"> 
                                <img src={video.thumbnailUpload} alt={video.Title} className="thumbnail" /> 
                                <div className="video-info"> 
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}> 
                                        <img src={teacherInfo?.ProfileImage} alt={teacherInfo?.Username} className="channel-pic" /> 
                                        <h3 className="video-title">{video.Title}</h3> 
                                    </div> 
                                    <p className="channel-name">{teacherInfo?.Username}</p> 
                                    <p className="video-stats">{video.views} views • {video.uploadDate}</p> 
                                </div> 
                            </li> 
                        ); 
                    })} 
                </ul> 
                </div>
            )} 
        </div> 
    ); 
} 
 
export default Videos;