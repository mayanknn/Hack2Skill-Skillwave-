import React, { useContext, useState, useEffect } from 'react'; 
import { ShowProfileContext } from '../../../context/showProfile'; 
import { IoClose } from "react-icons/io5"; 
import { collection, getFirestore, setDoc, doc, getDoc, getDocs } from 'firebase/firestore'; 
import { app } from '../../../firebase'; 
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; 
 
const db = getFirestore(app); 
const imgdb = getStorage(app); 
 
function UploadVideo() { 
  const { showUploadForm, setShowUploadForm } = useContext(ShowProfileContext); 
  const [questions, setQuestions] = useState([]); 
  const [videoTitle, setVideoTitle] = useState(''); 
  const [videoDescription, setVideoDescription] = useState(''); 
  const [selectedLanguage, setSelectedLanguage] = useState(''); 
  const [uploadVideo, setUploadVideo] = useState(null); 
  const [uploadThumbnail, setUploadThumbnail] = useState(null); 
  const [category, setCategory] = useState(''); 
  const [subCategory, setSubCategory] = useState(''); 
  const [mainTopic, setMainTopic] = useState(''); 
  const [categories, setCategories] = useState([]); 
  const [subCategoryOptions, setSubCategoryOptions] = useState([]); 
  const [showOtherCategoryInput, setShowOtherCategoryInput] = useState(false); 
  const [showOtherSubCategoryInput, setShowOtherSubCategoryInput] = useState(false); 
  const [otherCategory, setOtherCategory] = useState(''); 
  const [otherSubCategory, setOtherSubCategory] = useState(''); 
  const [uploadProgress, setUploadProgress] = useState(0); // New state for upload progress 
  const [uploading, setUploading] = useState(false); // New state for uploading status
 
  useEffect(() => { 
    const fetchCategories = async () => { 
      const categoriesCollection = collection(db, 'categories'); 
      const categorySnapshot = await getDocs(categoriesCollection); 
      const categoryList = categorySnapshot.docs.map(doc => doc.id); 
      setCategories(categoryList); 
    }; 
 
    fetchCategories(); 
  }, []); 
 
  useEffect(() => { 
    const fetchSubCategories = async () => { 
      if (category && category !== 'Other') { 
        const subCategoriesCollection = collection(db, 'categories', category, 'subcategories'); 
        const subCategorySnapshot = await getDocs(subCategoriesCollection); 
        const subCategoryList = subCategorySnapshot.docs.map(doc => doc.id); 
        setSubCategoryOptions(subCategoryList); 
      } else { 
        setSubCategoryOptions([]); 
      } 
    }; 
 
    fetchSubCategories(); 
  }, [category]); 
 
  function handleClose() { 
    setShowUploadForm(false); 
  } 
 
  const handleQuestionChange = (index, value) => { 
    const newQuestions = [...questions]; 
    newQuestions[index].question = value; 
    setQuestions(newQuestions); 
  }; 
 
  const handleOptionChange = (qIndex, oIndex, value) => { 
    const newQuestions = [...questions]; 
    newQuestions[qIndex].options[oIndex] = value; 
    setQuestions(newQuestions); 
  }; 
 
  const handleAddQuestion = () => { 
    setQuestions([...questions, { question: '', options: ['', '', ''] }]); 
  }; 
 
  const handleRemoveQuestion = (index) => { 
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index); 
    setQuestions(newQuestions); 
  }; 
 
  const uploadFile = async (file, path) => {
    return new Promise((resolve, reject) => {
      const fileRef = ref(imgdb, path);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const addVideo = async () => { 
    function randomAlphaNumeric(length) { 
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
      let result = ''; 
      for (let i = 0; i < length; i++) { 
        result += chars.charAt(Math.floor(Math.random() * chars.length)); 
      } 
      return result; 
    } 
   
    const id = randomAlphaNumeric(10); 
    console.log('Generated ID:', id); 
   
    const questionsMap = {};  
    questions.forEach((q, index) => {  
      questionsMap[`question${index + 1}`] = q;  
    }); 
   
    const ytref = collection(db, "videos"); 
    const ytdoc = doc(ytref, id); 
    
    try {
      const thumbnailURL = await uploadFile(uploadThumbnail, `uploads/images/${Date.now()}-${uploadThumbnail.name}`);
      const videoURL = await uploadFile(uploadVideo, `uploads/videos/${Date.now()}-${uploadVideo.name}`);
    
      const localuser = localStorage.getItem('userData'); 
      const userData = JSON.parse(localuser); 
      console.log(userData.uid); 
   
      const finalCategory = category === 'Other' ? otherCategory : category; 
      const finalSubCategory = subCategory === 'Other' ? otherSubCategory : subCategory; 
   
      await setDoc(ytdoc, { 
        userid: userData.uid, 
        vid: id, 
        Title: videoTitle, 
        Description: videoDescription, 
        videoUpload: videoURL, 
        thumbnailUpload: thumbnailURL, 
        questions: questionsMap, 
        Language: selectedLanguage, 
        category: finalCategory, 
        subCategory: finalSubCategory, 
        mainTopic: mainTopic, 
        views: 0 
      });
   
      // Category collection logic 
      const categoryDocRef = doc(db, 'categories', finalCategory); 
      const categoryDocSnap = await getDoc(categoryDocRef); 
   
      if (!categoryDocSnap.exists()) { 
        // Create category document 
        await setDoc(categoryDocRef, { id: finalCategory, name: finalCategory }); 
   
        // If subcategory is provided, create it 
        if (finalSubCategory) { 
          const subCategoryDocRef = doc(collection(categoryDocRef, 'subcategories'), finalSubCategory); 
          await setDoc(subCategoryDocRef, { id: finalSubCategory, name: finalSubCategory }); 
   
          // If main topic is provided, create it 
          if (mainTopic) { 
            const mainTopicDocRef = doc(collection(subCategoryDocRef, 'mainTopics'), mainTopic); 
            await setDoc(mainTopicDocRef, { id: mainTopic, name: mainTopic }); 
          } 
        } 
      } else { 
        // Category exists, check for subcategory 
        if (finalSubCategory) { 
          const subCategoryDocRef = doc(collection(categoryDocRef, 'subcategories'), finalSubCategory); 
          const subCategoryDocSnap = await getDoc(subCategoryDocRef); 
   
          if (!subCategoryDocSnap.exists()) { 
            // Create subcategory document 
            await setDoc(subCategoryDocRef, { id: finalSubCategory, name: finalSubCategory }); 
   
            // If main topic is provided, create it 
            if (mainTopic) { 
              const mainTopicDocRef = doc(collection(subCategoryDocRef, 'mainTopics'), mainTopic); 
              await setDoc(mainTopicDocRef, { id: mainTopic, name: mainTopic }); 
            } 
          } else { 
            // Subcategory exists, check for main topic 
            if (mainTopic) { 
              const mainTopicDocRef = doc(collection(subCategoryDocRef, 'mainTopics'), mainTopic); 
              const mainTopicDocSnap = await getDoc(mainTopicDocRef); 
   
              if (!mainTopicDocSnap.exists()) { 
                // Create main topic document 
                await setDoc(mainTopicDocRef, { id: mainTopic, name: mainTopic }); 
              } 
            } 
          } 
        } 
      }
      
      // Show success alert
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video.');
    }
  }; 

  const handleSubmit = async (e) => { 
    e.preventDefault(); // Prevent default form submission behavior 

    setUploading(true); // Set uploading state to true

    await addVideo(); // Call addVideo to handle video upload logic 

    setUploading(false); // Reset uploading state
    
    // Optionally clear the form or reset state 
    setVideoTitle(''); 
    setVideoDescription(''); 
    setSelectedLanguage(''); 
    setQuestions([]); 
    setCategory(''); 
    setSubCategory(''); 
    setMainTopic(''); 
    setOtherCategory(''); 
    setOtherSubCategory(''); 
    setUploadProgress(0); // Reset progress bar
    handleClose(); // Close the form after submission if needed 
  }; 
 
  return ( 
    <div className="upload-content"> 
      <h2>Upload Content</h2> 
      <form className="upload-form" onSubmit={handleSubmit}> 
        <input 
          type="text" 
          placeholder="Video Title" 
          value={videoTitle} 
          onChange={(e) => setVideoTitle(e.target.value)} 
        /> 
        <textarea 
          placeholder="Video Description" 
          value={videoDescription} 
          onChange={(e) => setVideoDescription(e.target.value)} 
        /> 
        <label htmlFor="video">Upload Video</label> 
        <input id='video' type="file" onChange={(e)=> setUploadVideo(e.target.files[0])}/> 
        <label htmlFor="thumbnail">Upload Thumbnail</label> 
        <input id='thumbnail' type="file" onChange={(e)=> setUploadThumbnail(e.target.files[0])}/> 
        <select 
          value={selectedLanguage} 
          onChange={(e) => setSelectedLanguage(e.target.value)} 
        > 
          <option value="">Select Language</option> 
          <option value="english">English</option> 
          <option value="spanish">Spanish</option> 
          <option value="french">French</option> 
        </select> 
        <select 
          value={category} 
          onChange={(e) => { 
            setCategory(e.target.value); 
            setShowOtherCategoryInput(e.target.value === 'Other'); 
            if (e.target.value === 'Other') { 
              setSubCategoryOptions([]); 
              setShowOtherSubCategoryInput(true); 
            } else { 
              setShowOtherSubCategoryInput(false); 
            } 
          }} 
        > 
          <option value="">Select Category</option> 
          {categories.map(cat => ( 
            <option key={cat} value={cat}>{cat}</option> 
          ))} 
          <option value="Other">Other</option> 
        </select> 
        {showOtherCategoryInput && ( 
          <input 
            type="text" 
            placeholder="Enter Other Category" 
            value={otherCategory} 
            onChange={(e) => setOtherCategory(e.target.value)} 
          /> 
        )} 
        <select 
          value={subCategory} 
          onChange={(e) => { 
            setSubCategory(e.target.value); 
            setShowOtherSubCategoryInput(e.target.value === 'Other'); 
          }} 
          disabled={!category} 
        > 
          <option value="">Select Sub Category</option> 
          {subCategoryOptions.map(subCat => ( 
            <option key={subCat} value={subCat}>{subCat}</option> 
          ))} 
          {category && <option value="Other">Other</option>} 
        </select> 
        {showOtherSubCategoryInput && ( 
          <input 
            type="text" 
            placeholder="Enter Other Sub Category" 
            value={otherSubCategory} 
            onChange={(e) => setOtherSubCategory(e.target.value)} 
          /> 
        )} 
        <input 
          type="text" 
          placeholder="Enter Main Topic Name" 
          value={mainTopic} 
          onChange={(e) => setMainTopic(e.target.value)} 
        /> 
         
        {questions.map((q, qIndex) => ( 
          <div key={qIndex}> 
            <input 
              type="text" 
              placeholder={`Question ${qIndex + 1}`} 
              value={q.question} 
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)} 
            /> 
            {q.options.map((opt, oIndex) => ( 
              <input 
                key={oIndex} 
                type="text" 
                placeholder={`Option ${oIndex + 1}`} 
                value={opt} 
                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
              /> 
            ))} 
            <button type="button" onClick={() => handleRemoveQuestion(qIndex)}>Remove Question</button> 
          </div> 
        ))} 
        <button type="button" onClick={handleAddQuestion}>Add Question</button> 
         
        <button type="submit" disabled={uploading}>Upload</button> 

        {/* Progress Bar */}
        {uploading && (
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
            <div className="progress-text">{Math.round(uploadProgress)}%</div>
          </div>
        )}
      </form> 
    </div> 
  ); 
} 
 
export default UploadVideo;
