"use client"

import { useEffect, useState } from "react"
import { INews } from "@/types/news"
import { toast } from "sonner"
import { NewsCard } from "../components/NewsCard"
import { AddNewsSlider } from "../components/AddNewSlider"

export default function NewsPage() {
  const [news, setNews] = useState<INews[]>([])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      const data = await response.json()
      setNews(data.news)
    } catch (error) {
      if (error instanceof Error) {
        toast.error("failed to fetch the news from server")
      }
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (data.success) {
        await fetchNews()
        toast.success("News deleted successfully")
      } else {
        toast.error(data.message || "Failed to delete news")
      }

      // fetchNews()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">News Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item._id} news={item} onDelete={handleDelete} />
        ))}
      </div>
      <AddNewsSlider onNewsAdded={fetchNews} />
    </div>
  )
}
