import { getServerSession } from "next-auth"; // used to access user from session
import dbconnect from "@/Lib/dbconnect";
import UserModel from "@/Lib/Models/User";
import { authOptions } from "../auth/[...nextauth]/option";

