import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CustomerEdit = () => {
  const router = useRouter();
  const { id } = router.query;
  const [customer, setCustomer] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await fetch(`/api/customers?id=${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch customer');
          }
          const data = await response.json();
          setCustomer(data);
          if (data.photo_url) {
            setPhotoPreview(data.photo_url);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCustomer();
  }, [id]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);

    try {
      const formData = new FormData();
      // Append all customer fields
      Object.keys(customer).forEach(key => {
        if (customer[key] && key !== 'photo_url') {
          formData.append(key, customer[key]);
        }
      });
      
      // Append photo if there's a new one
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      const response = await fetch(`/api/customers?id=${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update customer');
      }

      router.push('/customer-list');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  return (
    <form onSubmit={handleUpdate} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold text-blue-800">Edit Customer</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          {photoPreview && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Customer photo preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="flex flex-col items-center">
            <label 
              htmlFor="photo-upload" 
              className="cursor-pointer bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300"
            >
              {photoPreview ? 'Change Photo' : 'Upload Photo'}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Name"
        value={customer.name || ''}
        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        type="email"
        placeholder="Email"
        value={customer.email || ''}
        onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Phone"
        value={customer.phone || ''}
        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Address"
        value={customer.address || ''}
        onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <input
        type="text"
        placeholder="Country"
        value={customer.country || ''}
        onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      <button 
        type="submit" 
        disabled={updating}
        className={`w-full bg-blue-500 text-white p-2 rounded-md transition-colors duration-300 
          ${updating ? 'bg-blue-400 cursor-not-allowed' : 'hover:bg-blue-600'}`}
      >
        {updating ? 'Updating...' : 'Update Customer'}
      </button>
    </form>
  );
};

export default CustomerEdit;