import { Helmet } from 'react-helmet-async';

interface DashboardHelmetProps {
  activeSection?: string;
}

const DashboardHelmet = ({ activeSection = 'overview' }: DashboardHelmetProps) => {
  const getTitleAndDescription = () => {
    switch (activeSection) {
      case 'profile':
        return {
          title: 'Profile - ZIP Member Dashboard',
          description: 'Manage your ZIP membership profile and personal information'
        };
      case 'documents':
        return {
          title: 'Documents - ZIP Member Dashboard',
          description: 'View and manage your membership documents and certificates'
        };
      case 'payments':
        return {
          title: 'Payments - ZIP Member Dashboard',
          description: 'View payment history and manage membership fees'
        };
      case 'events':
        return {
          title: 'Events - ZIP Member Dashboard',
          description: 'Browse and register for ZIP events and activities'
        };
      case 'messages':
        return {
          title: 'Messages - ZIP Member Dashboard',
          description: 'View messages and communications from ZIP administration'
        };
      case 'notifications':
        return {
          title: 'Notifications - ZIP Member Dashboard',
          description: 'Stay updated with important ZIP announcements and alerts'
        };
      case 'settings':
        return {
          title: 'Settings - ZIP Member Dashboard',
          description: 'Manage your account settings and preferences'
        };
      default:
        return {
          title: 'Dashboard - Zambia Institute of Planners',
          description: 'Your ZIP membership dashboard - manage profile, documents, payments and more'
        };
    }
  };

  const { title, description } = getTitleAndDescription();

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default DashboardHelmet;