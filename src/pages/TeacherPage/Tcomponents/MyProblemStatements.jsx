import { useEffect, useState } from 'react';
import { collection, getFirestore, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { app } from '../../../firebase';
import { useNavigate } from 'react-router-dom';
import '../../../App.css';
import { IoIosClose } from "react-icons/io";
const db = getFirestore(app);

function MyProblemStatements() {
    const localuser = localStorage.getItem('userData');
    const userData = JSON.parse(localuser);
    const [problems, setProblems] = useState([]);
    const [selectedProblem, setSelectedProblem] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProblems = async () => {
            let q = null;
            if (userData.Role === 'Teacher') {
                q = query(collection(db, 'problems'), where('userid', '==', userData.uid));
            } else {
                q = query(collection(db, 'problems'));
            }

            const querySnapshot = await getDocs(q);
            const problemsList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setProblems(problemsList);
        };

        fetchProblems();
    }, [userData]);

    const handleProblemClick = (problem) => {
        setSelectedProblem(problem);
    };

    const handleCloseProblem = () => {
        setSelectedProblem(null);
    };

    const deleteProblem = async (id) => {
        try {
            const problemRef = collection(db, "problems");
            const problemDoc = doc(problemRef, id);
            await deleteDoc(problemDoc);
            setProblems((prevProblems) => prevProblems.filter((problem) => problem.id !== id));
        } catch (error) {
            console.error("Error deleting problem: ", error);
        }
    };

    const handleSolveClick = (pdfURL) => {
        navigate('/learner/code-editor', { state: { pdfURL } });
    };

    return (
        <div className="my-problems">
            <h2>My Problem Statements</h2>
            {selectedProblem ? (
                <div className="problem-details" style={{
                    border: '1px solid #ddd',
                    padding: '20px',
                    borderRadius: '12px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    maxWidth: '600px',
                    margin: 'auto'
                }}>
                    <div className="close-button" onClick={handleCloseProblem} style={{

                        left: '70vw',
                        cursor: 'pointer',

                    }}>
                        <IoIosClose className="icon" />
                    </div>
                    <h3 style={{
                        color: '#333',
                        fontSize: '24px',
                        marginBottom: '12px'
                    }}>
                        {selectedProblem.title}
                    </h3>
                    <p style={{
                        color: '#555',
                        lineHeight: '1.6'
                    }}>
                        {selectedProblem.description}
                    </p>
                    <div style={{
                        marginTop: '20px',
                        display: 'flex',
                        gap: '12px'
                    }}>
                        <button
                            onClick={() => window.open(selectedProblem.problemStatement, '_blank')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#007BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
                        >
                            View Problem Statement
                        </button>
                        <button
                            onClick={() => window.open(selectedProblem.solution, '_blank')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
                        >
                            View Solution
                        </button>
                    </div>
                    <p style={{
                        marginTop: '16px',
                        color: '#777',
                        fontSize: '14px'
                    }}>

                    </p>
                    {userData.Role.toLowerCase() === 'learner' && (
                        <button
                            onClick={() => handleSolveClick(selectedProblem.problemStatement)}
                            style={{
                                marginTop: '20px',
                                padding: '12px 24px',
                                backgroundColor: '#17a2b8',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '16px',
                                transition: 'background-color 0.3s ease'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#117a8b'}
                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#17a2b8'}
                        >
                            Solve
                        </button>
                    )}
                </div>

            ) : (
                <ul className="problem-list" style={{
                    listStyle: 'none',
                    padding: '0',
                    margin: '0',
                    maxWidth: '800px',
                    margin: 'auto'
                }}>
                    {problems.map((problem, index) => (
                        <li
                            key={problem.id}
                            onClick={() => handleProblemClick(problem)}
                            className="problem-card"
                            style={{
                                border: '1px solid #e0e0e0',
                                padding: '20px',
                                borderRadius: '12px',
                                marginBottom: '16px',
                                cursor: 'pointer',
                                backgroundColor: '#ffffff',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                position: 'relative'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <div className="problem-info" style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    width: '100%'
                                }}>
                                    <h3 className="problem-title" style={{
                                        margin: '0',
                                        color: '#333',
                                        fontSize: '18px',
                                        fontWeight: '600'
                                    }}>
                                        {index + 1}. {problem.title}
                                    </h3>
                                    {userData.Role.toLowerCase() !== 'learner' && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteProblem(problem.id);
                                            }}
                                            style={{
                                                padding: '8px 18px',
                                                backgroundColor: '#e53935',
                                                color: '#fff',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                fontWeight: '500',
                                                transition: 'background-color 0.3s ease',
                                                width:'30vw'
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c62828'}
                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e53935'}
                                        >
                                            DELETE
                                        </button>
                                    )}
                                </div>
                                <p className="problem-stats" style={{
                                    margin: '8px 0',
                                    color: '#777',
                                    fontSize: '14px'
                                }}>
                                    {problem.uploadDate}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyProblemStatements;
