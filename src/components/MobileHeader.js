import Link from 'next/link';

const MobileHeader = () => {
  return (
    <div className="bg-blue-700 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      <h2 className="text-2xl font-bold">MyApp</h2>
      <nav className="flex space-x-4">
        <Link href="/customer-list" legacyBehavior>
          <a className="text-lg font-semibold">Customer List</a>
        </Link>
        <Link href="/add-customer" legacyBehavior>
          <a className="text-lg font-semibold">Add Customer</a>
        </Link>
      </nav>
    </div>
  );
};

export default MobileHeader;
