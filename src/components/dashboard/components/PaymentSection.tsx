import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreditCard } from 'lucide-react';

const PaymentsSection = ({ paymentHistory = [] }) => (
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
                        <h4 className="font-medium">{payment.description}</h4>
                        <p className="text-gray-500 text-sm">{payment.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{payment.amount}</p>
                      <span className="inline-block bg-green-100 px-2 py-1 rounded-full text-green-800 text-xs">
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
                <label className="block mb-1 font-medium text-gray-700 text-sm">Payment Type</label>
                <select className="p-2 border rounded-md w-full">
                  <option>Annual Membership Fee</option>
                  <option>AGM Registration</option>
                  <option>Workshop Registration</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">Amount</label>
                <input
                  type="text"
                  className="p-2 border rounded-md w-full"
                  value="K1,500"
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 text-sm">
                  Payment Method
                </label>
                <div className="gap-4 grid grid-cols-1 md:grid-cols-3">
                  <div className="flex items-center gap-2 hover:bg-gray-50 p-4 border rounded-md cursor-pointer">
                    <input type="radio" name="payment-method" id="mobile-money" />
                    <label htmlFor="mobile-money">Mobile Money</label>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-50 p-4 border rounded-md cursor-pointer">
                    <input type="radio" name="payment-method" id="bank-transfer" />
                    <label htmlFor="bank-transfer">Bank Transfer</label>
                  </div>
                  <div className="flex items-center gap-2 hover:bg-gray-50 p-4 border rounded-md cursor-pointer">
                    <input type="radio" name="payment-method" id="card-payment" />
                    <label htmlFor="card-payment">Card Payment</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition-colors">
                  Proceed to Payment
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);
export default PaymentsSection;
