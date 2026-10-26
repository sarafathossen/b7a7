
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস লিখুন"),
  password: z.string().min(6, "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "নাম ন্যূনতম ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল অ্যাড্রেস লিখুন"),
  phone: z.string().regex(/^01[3-9]\d{8}$/, "সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর দিন (যেমন: 017XXXXXXXX)"),
  password: z.string().min(6, "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে"),
  role: z.enum(['CALLER', 'DRIVER'], {
    message: 'Invalid role selected',
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;