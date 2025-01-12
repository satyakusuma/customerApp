import Link from 'next/link';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-56 bg-blue-700 text-white transition-transform duration-300 ease-in-out z-50`}>
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center justify-between md:hidden">
          <h2 className="text-2xl font-bold text-white">MyApp</h2>
          <button onClick={toggleSidebar} className="text-white focus:outline-none">✖</button>
        </div>
        <div className="text-center mb-8 hidden md:block">
          <h2 className="text-2xl font-bold">MyApp</h2>
        </div>
        <ul className="flex-1 flex flex-col space-y-4">
          <li>
            <Link href="/add-customer" legacyBehavior>
              <a className="block p-2 text-lg font-semibold hover:bg-blue-500 rounded">Add Customer</a>
            </Link>
          </li>
          <li>
            <Link href="/customer-list" legacyBehavior>
              <a className="block p-2 text-lg font-semibold hover:bg-blue-500 rounded">Customer List</a>
            </Link>
          </li>
        </ul>
        <div className="text-center text-sm mt-8">
          <p>© 2025 MyApp</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;