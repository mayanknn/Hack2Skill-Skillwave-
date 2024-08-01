import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterForm from './pages/Registration/RegisterForm';
import LoginForm from './pages/Login/LoginForm';
import Teacher from './pages/TeacherPage/Teacher';
import Learner from './pages/LearnerPage/Learner';
import MyVideos from './pages/TeacherPage/Tcomponents/MyVideos';
import UploadVideo from './pages/TeacherPage/Tcomponents/UploadVideo';
import UploadProblem from './pages/TeacherPage/Tcomponents/UploadProblem';
import Error from './pages/Error';
import MyProblemStatements from './pages/TeacherPage/Tcomponents/MyProblemStatements';
import Preference from './pages/LearnerPage/Lcomponents/Preference';
import YT from './pages/LearnerPage/Lcomponents/YT';
import Videos from './pages/LearnerPage/Lcomponents/Videos';
import Events from './pages/TeacherPage/Tcomponents/Events';
import EventDetails from './pages/TeacherPage/Tcomponents/EventDetails';
import RoadMap from './pages/LearnerPage/Lcomponents/RoadMap';
import MainCodeEditor from './components/MainCodeEditor';



const App = () => {
  return (
    <>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="events" element={<Events />} />
            <Route path="events/event-details" element={<EventDetails />} />
            {/* <Route path="event-details" element={<EventDetails />} /> */}
            <Route path="/teacher/*" element={<Teacher />}>
              <Route path="my-videos" element={<MyVideos />} />
              <Route path="upload-content" element={<UploadVideo />} />
              <Route path="upload-problem" element={<UploadProblem />} />
              <Route path="my-problem-statements" element={<MyProblemStatements />} />
            
              <Route path="" element={<MyVideos />} /> {/* Default route */}
            </Route>
            <Route path="/learner/*" element={<Learner />} >
              <Route path="videos" element={<Videos />} />
              <Route path="yt-summary" element={<YT />} />
              <Route path="roadmap" element={<RoadMap/>} />
              <Route path="preference" element={<Preference />} />
              <Route path="my-problem-statements" element={<MyProblemStatements />} />
              <Route path="code-editor" element={<MainCodeEditor />} />
              <Route path="" element={<Videos />} />
            </Route>
            <Route path="/*" element={<Error />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

export default App;
