import { useState } from "react";
import Select from "react-select";
import { getData } from "country-list";

const CustomerForm = () => {
  const initialCustomerState = {
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
    nationality: "WNI",
    country: "",
    photo: null,
    photoPreview: null,
  };

  const [customer, setCustomer] = useState(initialCustomerState);

  const countryOptions = getData().map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (selectedOption) => {
    setCustomer((prev) => ({
      ...prev,
      country: selectedOption ? selectedOption.value : "",
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomer((prev) => ({
          ...prev,
          photo: file,
          photoPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setCustomer((prev) => ({
        ...prev,
        photo: null,
        photoPreview: null,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date().toISOString().split("T")[0];
    if (customer.dob > today) {
      alert("Date of birth cannot be in the future");
      return;
    }

    if (!customer.photo) {
      alert("Please upload a photo.");
      return;
    }

    const formData = new FormData();
    formData.append("name", customer.name);
    formData.append("email", customer.email);
    formData.append("phone", customer.phone);
    formData.append("address", customer.address);
    formData.append("dob", customer.dob);
    formData.append("nationality", customer.nationality);
    formData.append("country", customer.country);
    formData.append("photo", customer.photo);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await fetch("/api/customers", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      alert("Customer added successfully!");
      setCustomer(initialCustomerState);
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Add Customer</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <input
            type="text"
            name="name"
            placeholder="Nama Lengkap"
            value={customer.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customer.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Nomor Telepon"
            value={customer.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="date"
            name="dob"
            value={customer.dob}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <textarea
          name="address"
          placeholder="Alamat"
          value={customer.address}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        ></textarea>
        <select
          name="nationality"
          value={customer.nationality}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="WNI">WNI</option>
          <option value="WNA">WNA</option>
        </select>
        {customer.nationality === "WNA" && (
          <Select
            options={countryOptions}
            onChange={handleCountryChange}
            placeholder="Negara"
            className="w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        )}
        <input
          type="file"
          name="photo"
          onChange={handleFileChange}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          required
        />
        {customer.photoPreview && (
          <div className="mt-4">
            <img
              src={customer.photoPreview}
              alt="Foto Pratinjau"
              className="w-32 h-32 object-cover border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;