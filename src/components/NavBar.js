import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { BellIcon, MenuIcon, XIcon } from "@heroicons/react/outline";
import { Link } from "react-router-dom";
import AuthHelper from "../services/AuthHelper";
import UserHelper from "../services/UserHelper";
import axios from "axios";
import Balance from "./Balance";

const navigation = [
  { name: "Home", href: "/", current: true, isPrivate: false },
  {
    name: "Notifications",
    href: "/notifications",
    current: false,
    isPrivate: true,
  },
  {
    name: "Profile",
    href: "/profile/" + (UserHelper.getUsername() || ""),
    current: false,
    isPrivate: true,
  }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getFixedByLinkForBigMenu() {
  return (<></>);
}

function getFixedByLinkForMobileMenu() {
  return (<></>);
}

export default function NavBar() {
  return (
    <Disclosure as="nav" className="bg-red-300 shadow">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-full text-white hover:bg-red-700 focus:outline-none">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/coin_logo-noborder.png"
                    alt="Flic"
                  />
                  <img
                    className="hidden lg:block h-4 w-auto"
                    src="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/flic-logo-white.png"
                    alt="Flic"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) =>
                      item.isPrivate ? (
                        AuthHelper.isUserLoggedIn() && (
                          <Link
                            key={item.name}
                            to={item.href}
                            className={classNames(
                              item.current
                                ? "bg-red-500 text-white"
                                : "text-white hover:bg-red-400 hover:text-white",
                              "px-3 py-2 rounded-md text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        )
                      ) : (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current ? "bg-red-500" : "hover:bg-red-40",
                            "text-white px-3 py-2 rounded-md text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                    {getFixedByLinkForBigMenu()}
                  </div>
                </div>
              </div>
              {AuthHelper.isUserLoggedIn() ? (
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <span className="bg-white rounded-2xl p-2 max-h-8 flex items-center" title={"Your NFT Balance"}>
                    <img
                      className="max-h-4"
                      src="https://shelter-cdn.nyc3.cdn.digitaloceanspaces.com/flic/assets/coin_logo_x64.png"
                    ></img>
                    <span className="ml-1 text-red-500 font-medium">
                      <Balance/>
                    </span>
                  </span>
                  <Menu as="div" className="ml-3 relative">
                    {({ open }) => (
                      <>
                        <div>
                          <Menu.Button className="bg-red-500 flex text-sm rounded-full outline-none ring-2 ring-offset-2 ring-offset-red-500 ring-white">
                            <span className="sr-only">Open user menu</span>
                            <img
                              className="h-8 w-8 rounded-full"
                              src={UserHelper.getProfilePicture()}
                              alt=""
                            />
                          </Menu.Button>
                        </div>
                        <Transition
                          show={open}
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            static
                            className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-red-500 ring-opacity-5 focus:outline-none"
                          >
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/profile/${UserHelper.getUsername()}`}
                                  className={classNames(
                                    active ? "bg-red-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Your Profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to={`/profile/${UserHelper.getUsername()}/edit`}
                                  className={classNames(
                                    active ? "bg-red-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Edit profile
                                </Link>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/logout"
                                  className={classNames(
                                    active ? "bg-red-100" : "",
                                    "block px-4 py-2 text-sm text-gray-700"
                                  )}
                                >
                                  Sign out
                                </Link>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </>
                    )}
                  </Menu>
                </div>
              ) : (
                <Link
                  className="bg-red-500 text-white px-3 py-2 rounded-md text-sm font-medium"
                  to="/auth"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={classNames(
                    item.current ? "bg-red-500" : "hover:bg-red-400",
                    "text-white block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Link>
              ))}
              {getFixedByLinkForMobileMenu()}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
