type FormatType = 'short' | 'medium' | 'long' | 'relative';

const formatTimestamp = (timestamp: any, formatType: FormatType = 'relative') => {
  if (!timestamp) return 'N/A';

  try {
    // Convert various timestamp formats to Date object
    let date: Date;

    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      // Handle Firebase Timestamp object
      date = timestamp.toDate();
    } else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      // Handle serialized Timestamp object
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      // Handle Date object
      date = timestamp;
    } else if (typeof timestamp === 'number') {
      // Handle timestamp number
      date = new Date(timestamp);
    } else if (typeof timestamp === 'string') {
      // Handle ISO string
      date = new Date(timestamp);
    } else {
      return '';
    }

    // Apply formatting based on formatType
    switch (formatType) {
      case 'short':
        return date.toLocaleString([], {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

      case 'medium':
        return date.toLocaleString([], {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

      case 'long':
        return date.toLocaleString([], {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

      case 'relative':
      default:
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) {
          return 'Just now';
        } else if (diffInMinutes < 60) {
          return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (diffInHours < 24) {
          return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
        } else if (diffInDays < 7) {
          if (diffInDays === 1) return 'Yesterday';
          return `${diffInDays} days ago`;
        } else {
          return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
        }
    }
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return '';
  }
};

export { formatTimestamp as formatTime };
export default formatTimestamp;
