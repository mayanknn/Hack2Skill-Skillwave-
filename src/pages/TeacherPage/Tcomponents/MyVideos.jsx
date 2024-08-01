import { useEffect, useState } from 'react'; 
import { collection, getFirestore, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore'; 
import { app } from '../../../firebase'; 
import '../../../App.css'; 
import { IoIosClose } from "react-icons/io"; 
const db = getFirestore(app); 
 
function MyVideos() { 
    const [videos, setVideos] = useState([]); 
    const [filteredVideos, setFilteredVideos] = useState([]); 
    const [selectedVideo, setSelectedVideo] = useState(null); 
    const [searchQuery, setSearchQuery] = useState(''); 
    const localuser = localStorage.getItem('userData'); 
    const [videoComments, setVideoComments] = useState([]); 
    const [userList, setUserList] = useState([]); 
    const userData = JSON.parse(localuser); 
 
    useEffect(() => { 
        const fetchVideos = async () => { 
            const localuser = localStorage.getItem('userData'); 
            const userData = JSON.parse(localuser); 
            console.log(userData); 
            var q = query(collection(db, 'videos'), where('userid', '==', userData.uid)); 
 
            const querySnapshot = await getDocs(q); 
            const videosList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })); 
            setVideos(videosList); 
            setFilteredVideos(videosList); 
        }; 
 
        fetchVideos(); 
    }, []); 
 
    useEffect(() => { 
        const results = videos.filter(video => 
            video.Title.toLowerCase().includes(searchQuery.toLowerCase()) 
        ); 
        setFilteredVideos(results); 
    }, [searchQuery, videos]); 
 
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
 
    const handleVideoClick = (video) => { 
        setSelectedVideo(video); 
        fetchComments(video.id) 
 
    }; 
 
    const getUsernameById = (userId) => { 
        const user = userList.find(user => user.uid === userId); 
        return user ? user.Username : 'Unknown User'; 
    }; 
 
    const handleCloseVideo = () => { 
        setSelectedVideo(null); 
    }; 
 
    const deleteVideo = async (id) => { 
        try { 
            const ytvideoref = collection(db, "videos"); 
            const ytvideodoc = doc(ytvideoref, id); 
            await deleteDoc(ytvideodoc); 
            setVideos((prevVideos) => prevVideos.filter((video) => video.id !== id)); 
        } catch (error) { 
            console.error("Error deleting video: ", error); 
        } 
    }; 
 
    return ( 
        <div className="my-videos"> 
            <h2>My Videos</h2> 
            
            {selectedVideo ? ( 
                <div className="video-player"> 
                    <div className="close-button" onClick={handleCloseVideo}> 
                        <IoIosClose className="icon" /> 
                    </div> 
                    <video controls> 
                        <source src={selectedVideo.videoUpload} type="video/mp4" /> 
                        Your browser does not support the video tag. 
                    </video> 
                    <h3>{selectedVideo.Title}</h3> 
                    <p>Views: {selectedVideo.views}</p> 
                    <p>Ratings: {selectedVideo.ratings || 'N/A'}</p> 
                    <div className="comments-section"> 
                        <h3 className="comments-title">Comments</h3> 
 
                        {videoComments.map(comment => ( 
                            <div key={comment.id}
className="comment"> 
                                <h4 className="comment-user">{getUsernameById(comment.userid)}</h4> {/* Display username instead of userid */} 
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
            /> 
                <ul className="video-list"> 
                    {filteredVideos.map((video) => ( 
                        <li key={video.id} onClick={() => handleVideoClick(video)} className="video-card"> 
                            <img src={video.thumbnailUpload} alt={video.Title} className="thumbnail" /> 
                            <div className="video-info"> 
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}> 
                                    <img src={userData.ProfileImage} alt={video.channelName} className="channel-pic" /> 
                                    <h3 className="video-title">{video.Title}</h3> 
                                    <p>UPDATE</p> 
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            deleteVideo(video.id); 
                                        }} 
                                    > 
                                        DELETE 
                                    </button> 
                                </div> 
 
                                <p className="channel-name">{userData.Username}</p> 
                                <p className="video-stats">{video.views} views • {video.uploadDate}</p> 
 
 
                            </div> 
                        </li> 
                    ))} 
                </ul> 
                </div>
            )} 
        </div> 
    ); 
} 
 
export default MyVideos;