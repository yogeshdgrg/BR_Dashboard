// "use client"
// import { ReactNode } from 'react';
// import Sidebar from '../components/ui/sidebar';
// import Header from '../components/Header';
// // import Header from '@/components/ui/Header';
// // import Sidebar from '@/components/ui/sidebar';

// interface AdminLayoutProps {
//   children: ReactNode;
// }

// export default function AdminLayout({ children }: AdminLayoutProps) {
//   return (
//     <div className="min-h-screen bg-gray-100">
// <Sidebar />
//       <div className="lg:pl-64">
//         <Header />
//         <main className="px-4 sm:px-6 lg:px-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }

// // app/components/ui/sidebar.tsx

"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import {
  LayoutDashboard,
  ShoppingBag,
  ClipboardList,
  Newspaper,
  BookMinus,
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
// import { cookies } from "next/headers";
import { handleLogout } from "@/lib/handleLogout"
// import { handleLogout } from "@/lib/handleLogout"

type AdminLayoutProps = {
  children: React.ReactNode // Type for child components
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const pathname = usePathname()
  const router = useRouter()

  // useEffect(() => {
  //   // This will be executed on the client side
  //   if (typeof window !== "undefined") {
  //     // Check if the token cookie exists, if not, redirect to login page
  //     const token = document.cookie
  //       .split("; ")
  //       .find((row) => row.startsWith("token="))
  //     if (!token) {
  //       router.push("/login")
  //     }
  //   }
  // }, [router])

  return (
    <main className="grid grid-cols-12 bg-gradient-to-br from-zinc-50/50 via-zinc-50 to-sky-200/50">
      <section className="bg-white col-span-2 h-screen sticky top-0">
        {/* company logo */}
        <div className="h-16 bg-[#F7F7F7] border flex justify-center items-center">
          <Image
            src="/br.jpg"
            alt="logo"
            width={1000}
            height={1000}
            className="w-40 h-10 object-contain"
          />
        </div>

        {/* sidebar menu items */}
        <div className=" p-2">
          {navitems.map((item, index) => (
            <Link
              href={item.path}
              key={index}
              className={`${
                pathname === item.path
                  ? "bg-gray-600 rounded-md text-green-300 "
                  : ""
              } flex items-center gap-4 p-2`}
            >
              <div className="bg-white p-1 rounded-full"> {item.icon}</div>
              <h2 className="font-medium text-sm ">{item.title}</h2>
            </Link>
          ))}
        </div>
      </section>

      {/* main content section */}
      <section className="!overflow-y-scroll col-span-10">
        {/* user profile icon */}
        <div className="h-16 bg-white border flex justify-between px-4 items-center">
          <h2 className="text-lg font-bold text-zinc-950">Admin Dashboard</h2>
          <Popover>
            <PopoverTrigger>
              <Image
                src="/br.jpg"
                alt="avatar"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover border-green-500"
              />
            </PopoverTrigger>
            <PopoverContent className="w-32 mr-7">
              <h2 className="font-bold text-sm">My Account</h2>
              <div className="text-sm space-y-4 mt-2">
                {/* <h2 className=" text-black bg-zinc-200 hover:bg-zinc-300 ease-in-out duration-500 cursor-pointer font-medium py-2 text-center rounded-md w-full">
                  Settings
                </h2> */}
                <button
                  onClick={() => {
                    handleLogout()
                    router.push("/login")
                  }}
                  className="bg-red-500 hover:bg-red-600 ease-in-out duration-500 text-white font-medium py-2 rounded-md w-full mt-2"
                >
                  Logout
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* main content */}
        <div className="p-4">{children}</div>
      </section>
    </main>
  )
}

export default AdminLayout

const navitems = [
  {
    title: "Overview",
    path: "/admin",
    icon: <LayoutDashboard size={24} />,
  },
  {
    title: "Products",
    path: "/admin/products",
    icon: <ShoppingBag />,
  },
  {
    title: "Orders",
    path: "/admin/orders",
    icon: <ClipboardList />,
  },
  {
    title: "News",
    path: "/admin/news",
    icon: <Newspaper />,
  },
  {
    title: "Banner",
    path: "/admin/banner",
    icon: <BookMinus />,
  },
]
