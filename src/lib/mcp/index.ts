import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getBusinessInfo from "./tools/get-business-info";
import getServicePricing from "./tools/get-service-pricing";
import listServiceAreas from "./tools/list-service-areas";
import searchBlogPosts from "./tools/search-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import getFaqs from "./tools/get-faqs";

const supabaseUrl = (process.env["SUPABASE_URL"] ?? process.env["VITE_SUPABASE_URL"] ?? "").replace(/\/+$/, "");

export default defineMcp({
  name: "ride-n-care-care-in-every-mile",
  title: "Ride N Care (Care in every mile)",
  version: "0.1.0",
  instructions:
    "Tools for Ride N Care, a doorstep bike and car service in Bangalore. Use get_business_info for contact and booking details, get_service_pricing for service rates, list_service_areas for covered Bangalore localities, get_faqs for common questions, and search_blog_posts / get_blog_post for bike and car care articles.",
  auth: auth.oauth.issuer({
    issuer: `${supabaseUrl}/auth/v1`,
    acceptedAudiences: "authenticated",
    jwksUri: `${supabaseUrl}/auth/v1/.well-known/jwks.json`,
    resourceName: "Ride N Care",
  }),
  tools: [getBusinessInfo, getServicePricing, listServiceAreas, getFaqs, searchBlogPosts, getBlogPost],
});
