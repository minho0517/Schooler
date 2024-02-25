import dbConnect from "@/config/db";
import PostItem from "@/config/schema/PostItem";

export async function getPosts() {
    await dbConnect();
    const posts = await PostItem.find({}).exec();
    return posts;
}