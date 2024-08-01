import React, { useEffect, useState } from 'react';
import { getFirestore, collection, setDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { app } from '../../../firebase';
import '../../../App.css';

const db = getFirestore(app);

function Preference() {
  const localpref = localStorage.getItem('preferencesData');
  let userData1;
  if (localpref) {
    try {
      userData1 = JSON.parse(localpref);
      if (!Array.isArray(userData1) || !userData1.length) {
        userData1 = [{}];
      }
    } catch (error) {
      console.error('Error parsing preferencesData:', error);
      userData1 = [{}];
    }
  } else {
    userData1 = [{}];
  }

  const [goals, setGoals] = useState(userData1[0].goals || '');
  const [currentSkills, setCurrentSkills] = useState(userData1[0].currentSkills || '');
  const [desiredSkills, setDesiredSkills] = useState(userData1[0].desiredSkills || '');
  const [category, setCategory] = useState(userData1[0].category || '');
  const [subcategory, setSubcategory] = useState(userData1[0].subCategory || '');
  
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const localUser = localStorage.getItem('userData');
  const userData = localUser ? JSON.parse(localUser) : null;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesCollection = collection(db, 'categories');
        const categoriesSnapshot = await getDocs(categoriesCollection);
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (category) {
        try {
          const subcategoriesCollection = collection(db, 'categories', category, 'subcategories');
          const subcategoriesSnapshot = await getDocs(subcategoriesCollection);
          const subcategoriesList = subcategoriesSnapshot.docs.map(doc => doc.id);
          setSubcategories(subcategoriesList);
          setSubcategory('');
        } catch (error) {
          console.error('Error fetching subcategories:', error);
        }
      }
    };

    fetchSubcategories();
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const obj = { category, subcategory };
    localStorage.setItem('filtervideos', JSON.stringify(obj));

    const id = randomAlphaNumeric(10);
    console.log('Generated ID:', id);

    const preferenceRef = collection(db, 'preferences');
    const preferenceDoc = doc(preferenceRef, userData.uid);

    try {
      await setDoc(preferenceDoc, {
        userid: userData.uid,
        goals,
        prid: id,
        currentSkills,
        desiredSkills,
        category,
        subCategory: subcategory,
      });

      setGoals('');
      setCurrentSkills('');
      setDesiredSkills('');
      setCategory('');
      setSubcategory('');

      const prefsQuery = query(preferenceRef, where('userid', '==', userData.uid));
      const prefsSnapshot = await getDocs(prefsQuery);

      const preferencesData = !prefsSnapshot.empty ? prefsSnapshot.docs.map(doc => doc.data()) : [];
      localStorage.setItem('preferencesData', JSON.stringify(preferencesData));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  function randomAlphaNumeric(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="preference-form-container">
      <h2>Personalize Your Learning Experience</h2>
      <form className="preference-form" onSubmit={handleSubmit}>
        <label>
          Future Goals:
          <textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="Describe your future goals"
            required
          />
        </label>
        <label>
          Current Skills:
          <textarea
            value={currentSkills}
            onChange={(e) => setCurrentSkills(e.target.value)}
            placeholder="List your current skills"
            required
          />
        </label>
        <label>
          Skills You Want to Learn:
          <textarea
            value={desiredSkills}
            onChange={(e) => setDesiredSkills(e.target.value)}
            placeholder="List the skills you want to learn"
            required
          />
        </label>
        <label>
          Category:
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        {category && (
          <label>
            Subcategory:
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              required
            >
              <option value="" disabled>Select a subcategory</option>
              {subcategories.map((subcat, index) => (
                <option key={index} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </label>
        )}
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
}

export default Preference;
