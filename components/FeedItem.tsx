"use client";

import { Card, CardHeader, CardBody, CardFooter, Chip } from "@heroui/react";
import { Image } from "@heroui/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export const FeedItem = ({item}: {item: any}) => {

  return (
    <div className="p-0">
        <div className="">
            <Link href={`/detail/${item.id}`} className="block">
                <Card>
                    <CardBody>
                        <Image 
                        src={item.image_url} 
                        alt="feed image" 
                        className="w-full h-full object-cover"
                         />
                         <Chip className="absolute top-2 right-2"
                         color="primary"
                         variant="flat"
                         >{item.category || 'uncategorized'}</Chip>
                         <div>
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold">{item.title || 'untitled'}</h3>
                                <p className="text-sm text-gray-500 truncate">{item.description || 'undiscription'} </p> 
                                <div className="flex items-center gap-2 text-default-500">
                                    <Icon icon="lucide:clock" className="h-4 w-4" />
                                    <span className="text-sm">{item.duration || ''}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500">
                                    <Icon icon="lucide:calendar" className="h-4 w-4" />
                                    <span className="text-sm">{new Date(item.created_at).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        }) || ''}</span>
                                </div>
                                
                            </div>
                         </div>
                    </CardBody>
                </Card>
            </Link>
        </div>
    </div>
        
  );
};