import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { paymentService } from '@/services/paymentService';
import { useUserStore } from '@/lib/zustand';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
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
      const response = await paymentService.getPaymentHistory();
      setPaymentHistory(response.data || []);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const response = await paymentService.initializePayment({
        amount,
        membershipType: selectedType,
        duration: 1,
        currency: 'ZMW',
      });

      const { data } = response;

      window.LencoPay.getPaid({
        key: data.publicKey,
        reference: data.reference,
        email: data.email,
        amount: data.amount,
        currency: data.currency,
        customer: {
          firstName: data.customerName.split(' ')[0] || '',
          lastName: data.customerName.split(' ')[1] || '',
        },
        onSuccess: async paymentResponse => {
          try {
            const verification = await paymentService.verifyPayment(paymentResponse.reference);
            if (verification.data.status === 'successful') {
              // Update user document with payment history
              const userRef = doc(fireDataBase, 'users', user.uid);
              await updateDoc(userRef, {
                paymentHistory: arrayUnion({
                  id: paymentResponse.reference,
                  amount: data.amount,
                  currency: data.currency,
                  membershipType: selectedType,
                  duration: 1,
                  status: 'completed',
                  date: new Date().toISOString(),
                  method: 'lenco',
                }),
              });

              alert('Payment successful! Your membership has been activated.');
              loadPaymentHistory();
            }
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment completed but verification failed. Please contact support.');
          }
        },
        onClose: () => {
          console.log('Payment window closed');
        },
        onConfirmationPending: () => {
          alert('Payment is being processed. You will be notified once confirmed.');
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
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {payment.currency} {payment.amount}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs ${
                            payment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {payment.status}
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
