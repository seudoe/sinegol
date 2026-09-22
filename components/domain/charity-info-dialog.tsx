"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function CharityInfoDialog({
  charity,
}: {
  charity: { name: string; description: string; image_url?: string | null };
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        More info
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{charity.name}</DialogTitle>
          {charity.image_url && (
            <div className="w-full h-48 bg-muted relative rounded-md overflow-hidden mt-4">
              <img src={charity.image_url} alt={charity.name} className="object-cover w-full h-full" />
            </div>
          )}
          <DialogDescription className="whitespace-pre-wrap mt-4">
            {charity.description}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
