import type { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { Role } from '../../../generated/prisma/enums'
import { IUpdateProfilePayload } from "./user.interface";
import {ExpertUpdateInput} from "../../../generated/prisma/models/Expert";
import {BuyerUpdateInput} from "../../../generated/prisma/models/Buyer";
import {UserUpdateInput} from "../../../generated/prisma/models/User";
import {FarmerUpdateInput} from "../../../generated/prisma/models/Farmer";
const uploadProfileImage = async (buffer: Buffer, userId: string) => {
    const currentUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            imagePublicId: true,
            imageUrl: true,
        },
    });

    const cloudinaryResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: "auto",
                    },

                    async (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        if (!result) {
                            return reject(new Error("No result returned from Cloudinary"));
                        }

                        resolve(result);
                    },
                )
                .end(buffer);
        },
    );

    const updatedUser = await prisma.user.update({
        where: {
            id: userId,
        },

        data: {
            imageUrl: cloudinaryResult.secure_url,
            imagePublicId: cloudinaryResult.public_id,
        },

        omit: {
            password: true,
        },
    });

    if (currentUser?.imagePublicId && currentUser.imageUrl) {
        await cloudinary.uploader.destroy(currentUser.imagePublicId);
    }

    return updatedUser;
}

const updateProfile = async (
    userId: string,
    role: Role,
    payload: IUpdateProfilePayload
) => {
    // ১. ইউজার ডাটাবেজে অ্যাক্টিভ কি না চেক করা
    const isUserExist = await prisma.user.findUnique({
        where: { id: userId, isDeleted: false },
    });

    if (!isUserExist) {
        throw new Error( "User account not found");
    }

    const {
        name, phone, address, imageUrl, imagePublicId, // User fields
        city, country,                                 // Buyer fields
        certification,                                 // Farmer fields
        specialization, qualification, experience      // Expert fields
    } = payload;

    // ⚡ RECORD-এর পরিবর্তে প্রিসমার নিজস্ব ১০০% টাইপ-সেফ ইনপুট অবজেক্ট
    const userData: UserUpdateInput = {};

    if (name) userData.name = name;
    if (phone) userData.phone = phone;
    if (address) userData.address = address;
    if (imageUrl) userData.imageUrl = imageUrl;
    if (imagePublicId) userData.imagePublicId = imagePublicId;

    // ট্রানজেকশনের মাধ্যমে ডেটাবেজে এটমিক operation চালানো
    const result = await prisma.$transaction(async (tx) => {

        // ক. User টেবিল আপডেট
        if (Object.keys(userData).length > 0) {
            await tx.user.update({
                where: { id: userId },
                data: userData,
            });
        }

        // খ. রোল অনুযায়ী সাব-প্রোফাইল টেবিল আপডেট (Prisma টাইপ ব্যবহার করে)
        if (role === Role.BUYER) {
            const buyerData: BuyerUpdateInput = {}; // 👈 টাইপ সেফ
            if (name) buyerData.name = name;
            if (address) buyerData.address = address;
            if (city) buyerData.city = city;
            if (country) buyerData.country = country;

            if (Object.keys(buyerData).length > 0) {
                await tx.buyer.update({
                    where: { userId },
                    data: buyerData,
                });
            }
        }

        else if (role === Role.FARMER) {
            const farmerData: FarmerUpdateInput = {}; // 👈 টাইপ সেফ
            if (name) farmerData.name = name;
            if (certification) farmerData.certification = certification;

            if (Object.keys(farmerData).length > 0) {
                await tx.farmer.update({
                    where: { userId },
                    data: farmerData,
                });
            }
        }

        else if (role === Role.EXPERT) {
            const expertData: ExpertUpdateInput = {};
            if (name) expertData.name = name;
            if (city) expertData.city = city;
            if (specialization) expertData.specialization = specialization;
            if (qualification) expertData.qualification = qualification;
            if (experience) expertData.experience = Number(experience);

            if (Object.keys(expertData).length > 0) {
                await tx.expert.update({
                    where: { userId },
                    data: expertData,
                });
            }
        }

        // গ. আপডেটেড ডাটা রিলেশনসহ এবং পাসওয়ার্ড ছাড়া রিটার্ন করা
        return await tx.user.findUnique({
            where: { id: userId },
            include: {
                buyer: role === Role.BUYER,
                farmer: role === Role.FARMER,
                expert: role === Role.EXPERT,
            },
            omit: {
                password: true,
            },
        });
    });

    return result;
};

export const UserServices = {
    uploadProfileImage,
    updateProfile
};