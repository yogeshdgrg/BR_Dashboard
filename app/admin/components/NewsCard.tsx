import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { INews } from "@/types/news";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface NewsCardProps {
  news: INews;
  onDelete: (id: string) => void;
}

export function NewsCard({ news, onDelete }: NewsCardProps) {
  const formattedDate = new Date(news.date).toLocaleDateString();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4">
        <h3 className="font-semibold text-lg">{news.title}</h3>
      </CardHeader>
      <div className="relative w-full h-48">
        <Image
          src={news.img}
          alt={news.title}
          fill
          className="object-cover rounded-md"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <p className="text-sm text-gray-600">{news.description.substring(1,100)}....</p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{news.author}</p>
          <p className="text-xs text-gray-500">{formattedDate}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete News</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this news article? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(news._id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
