import Link from 'next/link';

const MobileFooter = () => {
  return (
    <div className="bg-blue-700 text-white p-4 flex justify-around fixed bottom-0 w-full z-50">
      <Link href="/customer-list" legacyBehavior>
        <a className="text-lg font-semibold">Customer List</a>
      </Link>
      <Link href="/add-customer" legacyBehavior>
        <a className="text-lg font-semibold">Add Customer</a>
      </Link>
    </div>
  );
};

export default MobileFooter;