import React, { useContext, useState } from 'react';
import { ShowProfileContext } from '../../../context/showProfile';
import { IoClose } from "react-icons/io5";
import { collection, getFirestore, setDoc, doc } from 'firebase/firestore';
import { app } from '../../../firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
const db = getFirestore(app);
const storage = getStorage(app);

function UploadProblem() {
  const { showUploadForm, setShowUploadForm } = useContext(ShowProfileContext);
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [problemStatement, setProblemStatement] = useState(null);
  const [solution, setSolution] = useState(null);
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [mainTopic, setMainTopic] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  function handleClose() {
    setShowUploadForm(false);
  }

  const addProblem = async () => {
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

    const problemRef = collection(db, "problems");
    const problemDoc = doc(problemRef, id);

    const problemStatementRef = ref(storage, `uploads/problems/${Date.now()}-${problemStatement.name}`);
    const problemStatementUpload = await uploadBytes(problemStatementRef, problemStatement);
    const problemStatementURL = await getDownloadURL(problemStatementUpload.ref);

    const solutionRef = ref(storage, `uploads/solutions/${Date.now()}-${solution.name}`);
    const solutionUpload = await uploadBytes(solutionRef, solution);
    const solutionURL = await getDownloadURL(solutionUpload.ref);

    const localUser = localStorage.getItem('userData');
    const userData = JSON.parse(localUser);
    console.log(userData.uid);

    await setDoc(problemDoc, {
      userid: userData.uid,
      problemid: id,
      title: problemTitle,
      description: problemDescription,
      problemStatement: problemStatementURL,
      solution: solutionURL,
      category: customCategory || category,
      subCategory: subCategory,
      mainTopic: mainTopic,
    });
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory(''); // Reset sub-category when category changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    console.log('Submitting:', {
      problemTitle,
      problemDescription,
      problemStatement,
      solution,
      category: customCategory || category,
      subCategory,
      mainTopic,
    });

    await addProblem(); // Call addProblem to handle problem upload logic

    // Optionally clear the form or reset state
    setProblemTitle('');
    setProblemDescription('');
    setProblemStatement(null);
    setSolution(null);
    setCategory('');
    setSubCategory('');
    setMainTopic('');
    setCustomCategory('');
    handleClose(); // Close the form after submission if needed
  };

  return (
    <div className="upload-content">
      <h2>Upload Problem</h2>
      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Problem Title"
          value={problemTitle}
          onChange={(e) => setProblemTitle(e.target.value)}
        />
        <textarea
          placeholder="Problem Description"
          value={problemDescription}
          onChange={(e) => setProblemDescription(e.target.value)}
        />
        <label htmlFor="problemStatement">Upload Problem Statement (PDF)</label>
        <input id='problemStatement' type="file" accept="application/pdf" onChange={(e) => setProblemStatement(e.target.files[0])} />
        <label htmlFor="solution">Upload Solution (PDF)</label>
        <input id='solution' type="file" accept="application/pdf" onChange={(e) => setSolution(e.target.files[0])} />

        <select
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="">Select Category</option>
          <option value="Web Development">Web Development</option>
          <option value="Mobile App Development">Mobile App Development</option>
          <option value="DSA">DSA</option>
          <option value="Database">Database</option>
          <option value="Custom">Add New Category</option>
        </select>
        {category === 'Custom' && (
          <input
            type="text"
            placeholder="Enter Custom Category"
            value={customCategory}
            onChange={(e) => setCustomCategory(e.target.value)}
          />
        )}
        <select
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
        >
          <option value="">Select Sub Category</option>
          {category === 'Web Development' && (
            <>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Hosting">Hosting</option>
            </>
          )}
          {category === 'Mobile App Development' && (
            <>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Building APK">Building APK</option>
            </>
          )}
          {category === 'DSA' && (
            <>
              <option value="Arrays">Arrays</option>
              <option value="Trees">Trees</option>
              <option value="Graphs">Graphs</option>
              <option value="Stack">Stack</option>
              <option value="Queue">Queue</option>
              <option value="Linked Lists">Linked Lists</option>
            </>
          )}
          {category === 'Database' && (
            <>
              <option value="SQL">SQL</option>
              <option value="NoSQL">NoSQL</option>
            </>
          )}
        </select>
        <input
          type="text"
          placeholder="Enter Main Topic Name"
          value={mainTopic}
          onChange={(e) => setMainTopic(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

export default UploadProblem;
