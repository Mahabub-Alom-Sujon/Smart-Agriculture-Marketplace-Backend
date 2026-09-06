export interface IRequestUser {
    userId: string;  // ইউজারের ইউনিক আইডি (ডেটাবেজের id)
    role: string;    // ইউজারের রোল (যেমন: 'BUYER', 'FARMER', 'ADMIN')
    email?: string;  // অপশনাল: ইউজারের ইমেইল (যদি প্রয়োজন হয়)
}