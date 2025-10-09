import { Helmet } from 'react-helmet-async';

const AdminSEO = () => (
  <Helmet>
    <title>Admin Dashboard - ZIP Management Portal</title>
    <meta name="description" content="ZIP Admin Dashboard - Manage members, events, notifications and administrative functions for the Zambia Institute of Planners." />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:title" content="Admin Dashboard - ZIP Management Portal" />
    <meta property="og:description" content="Administrative portal for ZIP management" />
    <meta property="og:type" content="website" />
  </Helmet>
);

export default AdminSEO;