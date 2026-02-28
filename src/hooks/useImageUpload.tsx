import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;
      const filePath = `pg-images/${fileName}`;

      const { error } = await supabase.storage
        .from("pg-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      if (error) {
        toast({ title: "Upload failed", description: error.message, variant: "destructive" });
        return null;
      }

      const { data: urlData } = supabase.storage
        .from("pg-images")
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const uploadMultipleImages = async (files: FileList): Promise<string[]> => {
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadImage(file);
      if (url) urls.push(url);
    }
    return urls;
  };

  return { uploadImage, uploadMultipleImages, uploading };
};
