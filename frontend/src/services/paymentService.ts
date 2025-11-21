import { auth } from '@/lib/firebase';

const API_BASE_URL = 'http://localhost:10000/api';

const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  return await user.getIdToken();
};

export const paymentService = {

  async verifyPayment(reference: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/payments/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to verify payment');
    return response.json();
  }
};
