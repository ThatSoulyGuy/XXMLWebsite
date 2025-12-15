import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/user/",
          "/admin/",
          "/docs/standard-library/editor/",
        ],
      },
    ],
    sitemap: "https://xxml-language.com/sitemap.xml",
  };
}
