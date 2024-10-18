import FrontPage from './components/FrontPage';
import AdminDateSelector from './components/Admin/AdminDateSelector';
import './components/Style.css';
import DateSelector from './components/DateSelector';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Login from './components/Login';
import HourSelector from './components/HourSelector';
import Summary from './components/Summary';
import ApproveMessage from './components/ApproveMessage';
import Layout from './components/Layout';
import AdminHourSelector from './components/Admin/AdminHourSelector';
import AdminAddLesson from './components/Admin/AdminAddLesson';


function App() {

  const router = createHashRouter([
    {
      path: '/',
      element: <FrontPage />
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/admin-date-selector',
      element:<AdminDateSelector />,
    },
    {
      path: '/admin-hour-selector',
      element: <AdminHourSelector />,
    },
    {
      path: '/admin-add-lesson',
      element: <AdminAddLesson />,
    },
    {
      path: '/date-selector',
      element: <Layout><DateSelector /></Layout>,
    },
    {
      path: '/hour-selector',
      element: <Layout><HourSelector /></Layout>,
    },
    {
      path: '/summary',
      element: <Layout><Summary /></Layout>,
    },
    {
      path: '/approve-message',
      element: <Layout><ApproveMessage /></Layout>,
    },
  ]);


  return (
    <div id="app">
    <RouterProvider router={router} />

    </div>
  );
}

export default App;
