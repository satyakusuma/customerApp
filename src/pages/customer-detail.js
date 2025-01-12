import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const CustomerDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/customers?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch customer');
        }
        const data = await response.json();
        console.log(data);
        setCustomer(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCustomer();
  }, [id]);

  if (loading) return <p className="text-center text-blue-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-10">
      <div className="max-w-3xl mx-auto bg-blue-50 p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">Customer Detail</h1>
        <div className="text-center">
          {customer.photo_url && (
            <img src={customer.photo_url} alt="Customer photo" className="w-48 h-48 object-cover mx-auto rounded-full mb-4" />
          )}
          <h2 className="text-2xl font-semibold text-blue-900">{customer.name}</h2>
          <p className="text-gray-700">Email: {customer.email}</p>
          <p className="text-gray-700">Phone: {customer.phone}</p>
          <p className="text-gray-700">Address: {customer.address}</p>
          <p className="text-gray-700">Date of Birth: {customer.dob}</p>
          <p className="text-gray-700">Nationality: {customer.nationality}</p>
          {customer.nationality === 'WNA' && <p className="text-gray-700">Country: {customer.country}</p>}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail;
