"use client"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { FaUser, FaLock } from "react-icons/fa"
import { toast } from "react-toastify"

export default function LoginPage() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      console.log("Data in frontend : ",data)

      if (!data.ok) {
        setError(data.error || "Invalid credentials")
        setIsSubmitting(false)
        toast.error("Invalid credentials.")
        return
      }
      setIsSubmitting(false)
      router.push("/admin")
      toast.success("Login successful")
    } catch (err) {
      setError("An unexpected error occurred.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg px-8 py-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-center text-sm mb-4">{error}</p>
        )}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-medium mb-2"
          >
            Email
          </label>
          <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
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
          <div className="flex items-center border border-gray-300 rounded-md p-2 bg-white">
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          Login
        </button>
      </form>
    </div>
  )
}
