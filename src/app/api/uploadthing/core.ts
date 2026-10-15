import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/auth";

const f = createUploadthing();

/**
 * CampusHub UploadThing File Router
 * Handles all file uploads with server-side auth enforcement.
 */
export const ourFileRouter = {
  // Lost & Found item photos
  lostFoundImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Lost & Found upload by:", metadata.userId, file.url);
      return { url: file.url };
    }),

  // Grievance evidence photos
  grievanceImage: f({ image: { maxFileSize: "8MB", maxFileCount: 3 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Grievance upload by:", metadata.userId, file.url);
      return { url: file.url };
    }),

  // PYQ / Notes PDF uploads (students)
  academicResource: f({ pdf: { maxFileSize: "32MB" } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Academic resource upload by:", metadata.userId, file.url);
      return { url: file.url };
    }),

  // Marker images — Admin only
  markerImage: f({ image: { maxFileSize: "8MB", maxFileCount: 6 } })
    .middleware(async () => {
      const session = await auth();
      if (!session || session.user.role !== "ADMIN") throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Marker image upload by admin:", metadata.userId, file.url);
      return { url: file.url };
    }),

  // Marketplace listing photos
  marketplaceImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } })
    .middleware(async () => {
      const session = await auth();
      if (!session) throw new Error("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Marketplace upload by:", metadata.userId, file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
