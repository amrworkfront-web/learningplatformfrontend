import axiosInstance from "./axiosInstance";

export const RegisterUser= async (userData:{name:string,email:string,password:string,role:string})=>{
    const response=await axiosInstance.post('/auth/register',userData);
    return response.data;
}
export const LoginUser= async (userData:{email:string,password:string})=>{
    const response=await axiosInstance.post('/auth/login',userData);
    return response.data;
}
export const ForgotPassword= async (userData:{email:string})=>{
    const response=await axiosInstance.post('/auth/forgot-password',userData);
    return response.data;
}

export const ResetPassword= async (token:string,newPassword:string)=>{
    const response=await axiosInstance.post(`/auth/reset-password/${token}`,{password:newPassword});
    return response.data;
}