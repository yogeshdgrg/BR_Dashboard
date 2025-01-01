"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FaUnlockKeyhole } from "react-icons/fa6"
import { toast } from "react-toastify"
import Image from "next/image"

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    toast.error("Logout Successfully")
  }

  return (
    <header className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900"><Image src={"/br.jpg"} alt="BR Logo" height={48} width={48}/></h1>
          <div className="relative">
            {/* <img
              className="h-10 w-10 rounded-full object-cover cursor-pointer"
              src="https://tse1.mm.bing.net/th?id=OIP.h_VkR2BZEEaeVqnyhKaaawHaJH&pid=Api&P=0&h=220"
              alt="User"
              onClick={() => setDropdownOpen((prev) => !prev)}
            /> */}
            <Image src={"/br.jpg"} onClick={() => setDropdownOpen((prev) => !prev)} width={40} height={40} alt="admin picture"></Image>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-md rounded-md">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 justify-start text-red-700 hover:bg-gray-100"
                >
                  <span>
                    <FaUnlockKeyhole />
                  </span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
