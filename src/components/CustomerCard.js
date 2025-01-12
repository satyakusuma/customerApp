import Link from "next/link";
import { useState } from "react";

const CustomerCard = ({ customer, onDelete }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(null);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  const handleDelete = async (id) => {
    try {
      await onDelete(id);
      setMessage({ type: "success", text: "Customer deleted successfully." });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to delete customer." });
    } finally {
      setShowPopup(false);
      setShowMessagePopup(true);
      setTimeout(() => setShowMessagePopup(false), 3000);
    }
  };

  return (
    <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
      {customer.photo_url && (
        <div className="relative h-48 w-full mb-4 rounded-t-xl overflow-hidden">
          <img
            src={customer.photo_url}
            alt={customer.name}
            className="object-cover h-full w-full"
          />
        </div>
      )}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-blue-900">{customer.name}</h2>
        <p className="text-gray-700">{customer.email}</p>
        <p className="text-gray-700">{customer.phone}</p>
        <p className="text-gray-700">{customer.address}</p>
        <p className="text-gray-700">{customer.country}</p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link href={`/customer-detail?id=${customer.id}`} legacyBehavior>
            <a className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors duration-300">
              Detail
            </a>
          </Link>
          <Link href={`/customer-edit?id=${customer.id}`} legacyBehavior>
            <a className="px-6 py-2 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors duration-300">
              Edit
            </a>
          </Link>
          <button
            onClick={() => setShowPopup(true)}
            className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this customer?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => handleDelete(customer.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 mr-2"
              >
                Yes
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition-colors duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showMessagePopup && (
        <div
          className={`fixed bottom-0 right-0 mb-4 mr-4 px-4 py-2 rounded-md ${
            message.type === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CustomerCard;