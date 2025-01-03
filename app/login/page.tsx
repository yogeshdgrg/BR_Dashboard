"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FaUser, FaLock } from "react-icons/fa"
import { toast } from "react-toastify"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return // Prevent multiple requests

    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("Data in frontend : ", data)

      if (!data.ok) {
        setError(data.error || "Invalid credentials")
        setIsSubmitting(false)
        toast.error("Invalid credentials.")
        return
      }

      toast.success("Login successful")
      router.push("/admin")
    } catch {
      setError("An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3edde] p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg px-8 py-10 w-full max-w-md space-y-6"
      >
        <div className="flex justify-center items-center">
          <Image src={"/br.jpg"} height={48} width={48} alt="Br Logo" />
        </div>
        {error && <p className="text-red-500 text-center text-sm">{error}</p>}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-md p-3 bg-white">
            <FaUser className="text-gray-400 mr-2" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Password
          </label>
          <div className="flex items-center border border-gray-300 rounded-md p-3 bg-white">
            <FaLock className="text-gray-400 mr-2" />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 outline-none bg-transparent text-gray-700 placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 text-white font-bold rounded-lg transition duration-300 ${
            isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}
