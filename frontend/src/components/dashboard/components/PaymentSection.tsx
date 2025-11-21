import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { paymentService } from '@/services/paymentService';
import { useUserStore } from '@/lib/zustand';
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { fireDataBase } from '@/lib/firebase';

declare global {
  interface Window {
    LencoPay: {
      getPaid: (config: any) => void;
    };
  }
}

const PaymentsSection = () => {
  const { user } = useUserStore();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<
    'Annual Membership Fee' | 'AGM Registration' | 'Workshop Registration' | 'Other'
  >('Annual Membership Fee');
  const [amount, setAmount] = useState(1500);

  const paymentTypes = {
    'Annual Membership Fee': 1500,
    'AGM Registration': 300,
    'Workshop Registration': 200,
    Other: 0,
  };

  useEffect(() => {
    loadPaymentHistory();
    loadLencoScript();
  }, []);

  useEffect(() => {
    setAmount(paymentTypes[selectedType] || 0);
  }, [selectedType]);

  const loadLencoScript = () => {
    if (!document.getElementById('lenco-script')) {
      const script = document.createElement('script');
      script.id = 'lenco-script';
      script.src = 'https://pay.sandbox.lenco.co/js/v1/inline.js';
      document.head.appendChild(script);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      if (!user?.uid) return;

      const q = query(
        collection(fireDataBase, 'payments'),
        where('uid', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      const payments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      }));

      setPaymentHistory(payments);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);

      // Generate payment data and initialize Lenco payment
      const reference = 'ref-' + Date.now();
      const publicKey = 'YOUR_PUBLIC_KEY';

      // Create initial payment document
      const paymentDoc = await addDoc(collection(fireDataBase, 'payments'), {
        uid: user.uid,
        email: user.email,
        reference,
        amount,
        currency: 'ZMW',
        membershipType: selectedType,
        duration: 1,
        status: 'pending',
        createdAt: Timestamp.now(),
      });

      // Update user document with payment reference
      const userRef = doc(fireDataBase, 'users', user.uid);
      await updateDoc(userRef, {
        paymentRefs: arrayUnion(paymentDoc.id),
      });

      window.LencoPay.getPaid({
        key: publicKey,
        reference,
        email: user.email,
        amount,
        currency: 'ZMW',
        channels: ['card', 'mobile-money'],
        customer: {
          firstName: user.profile.firstName || 'User',
          lastName: user.profile.lastName || '',
          phone: user.profile.phone || '0971111111',
        },
        onSuccess: async paymentResponse => {
          try {
            const verification = await paymentService.verifyPayment(paymentResponse.reference);

            // Update payment document with verification data
            await updateDoc(doc(fireDataBase, 'payments', paymentDoc.id), {
              lencoReference: verification.data.lencoReference,
              status: verification.data.status,
              paymentMethod: verification.data.paymentMethod,
              fee: verification.data.fee,
              completedAt: verification.data.completedAt
                ? new Date(verification.data.completedAt)
                : null,
              updatedAt: Timestamp.now(),
            });

            if (verification.data.status === 'successful') {
              alert('Payment successful! Your membership has been activated.');
            }
            loadPaymentHistory();
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment completed but verification failed. Please contact support.');
          }
        },
        onClose: () => {
          console.log('Payment window closed');
        },
        onConfirmationPending: async () => {
          try {
            // Update payment status to confirmation pending
            await updateDoc(doc(fireDataBase, 'payments', paymentDoc.id), {
              status: 'confirmation_pending',
              updatedAt: Timestamp.now(),
            });

            alert('Payment is being processed. You will be notified once confirmed.');
            loadPaymentHistory();
          } catch (error) {
            console.error('Failed to update payment status:', error);
          }
        },
      });
    } catch (error) {
      console.error('Payment initialization failed:', error);
      alert('Failed to initialize payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 min-h-screen">
      <h1 className="mb-6 font-bold text-gray-900 text-3xl">Payments</h1>
      <Tabs defaultValue="history">
        <TabsList className="mb-6">
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="pending">Pending Payments</TabsTrigger>
          <TabsTrigger value="make">Make Payment</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map(payment => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-lg">
                          <CreditCard className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{payment.membershipType}</h4>
                          <p className="text-gray-500 text-sm">
                            {new Date(payment.date).toLocaleDateString()}
                          </p>
                          <p className="text-gray-400 text-xs">Ref: {payment.reference}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {payment.currency} {payment.amount}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            payment.status === 'successful'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : payment.status === 'confirmation_pending'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status === 'confirmation_pending'
                            ? 'Confirming'
                            : payment.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-gray-500">No payment history available.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">You have no pending payments at this time.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="make">
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 font-medium text-xl">Make a Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">
                    Payment Type
                  </label>
                  <select
                    className="p-2 border rounded-md w-full"
                    value={selectedType}
                    onChange={e =>
                      setSelectedType(
                        e.target.value as
                          | 'Annual Membership Fee'
                          | 'AGM Registration'
                          | 'Workshop Registration'
                          | 'Other'
                      )
                    }
                  >
                    <option value="Annual Membership Fee">Annual Membership Fee</option>
                    <option value="AGM Registration">AGM Registration</option>
                    <option value="Workshop Registration">Workshop Registration</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                {selectedType === 'Other' && (
                  <div>
                    <label className="block mb-1 font-medium text-gray-700 text-sm">
                      Custom Amount
                    </label>
                    <input
                      type="number"
                      className="p-2 border rounded-md w-full"
                      value={amount}
                      onChange={e => setAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                  </div>
                )}
                <div>
                  <label className="block mb-1 font-medium text-gray-700 text-sm">Amount</label>
                  <input
                    type="text"
                    className="p-2 border rounded-md w-full font-bold text-lg"
                    value={`ZMW ${amount.toFixed(2)}`}
                    readOnly
                  />
                </div>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 text-sm">
                    Payment will be processed securely through Lenco. You can pay using Mobile Money
                    or Card.
                  </p>
                </div>
                <div className="flex justify-end">
                  <button
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 px-6 py-2 rounded-md text-white transition-colors"
                    onClick={handlePayment}
                    disabled={loading || amount <= 0}
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Processing...' : 'Pay with Lenco'}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentsSection;
