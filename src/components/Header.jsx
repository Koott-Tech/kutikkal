export default function Header() {
  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="w-full pl-[50px] pr-[50px]">
        <div className="flex h-20 items-center justify-between">
          {/* Left group: Brand + Nav */}
          <div className="flex items-center gap-10">
            <div className="flex items-center">
              <span className="text-2xl font-semibold tracking-tight text-gray-900">
                kuttikal
              </span>
            </div>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-8 text-sm font-medium text-gray-800">
                <li className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                  <span>Find Care</span>
                  <ChevronDownIcon />
                </li>
                <li className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                  <span>For Providers</span>
                  <ChevronDownIcon />
                </li>
                <li className="relative cursor-pointer text-gray-900">
                  <span>About Us</span>
                  <span className="absolute left-0 right-0 -bottom-3 mx-auto block h-0.5 w-20 bg-indigo-700" />
                </li>
                <li className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                  <span>For Partners</span>
                  <ChevronDownIcon />
                </li>
                <li className="cursor-pointer hover:text-gray-900">Blog</li>
              </ul>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-6">
            <button className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-gray-800 hover:text-gray-900">
              <span>Login</span>
              <ChevronDownIcon />
            </button>
            <button className="inline-flex items-center rounded-full bg-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800">
              Get started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      className="h-4 w-4 text-gray-600"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.192l3.71-2.96a.75.75 0 0 1 .94 1.17l-4.24 3.38a.75.75 0 0 1-.94 0l-4.24-3.38a.75.75 0 0 1 .02-1.06Z"
        clipRule="evenodd"
      />
    </svg>
  );
}


